/**
 * 実行クラス
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-06
 */

import { serve, Server, ServerRequest, Response } from "https://deno.land/std@0.104.0/http/server.ts"
import { Cookie, getCookies, setCookie, deleteCookie } from "https://deno.land/std@0.104.0/http/cookie.ts"
import { 
    acceptWebSocket,
    isWebSocketCloseEvent,
    isWebSocketPingEvent,
    WebSocket,
} from "https://deno.land/std@0.104.0/ws/mod.ts"
import { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts"
import { Route, rooting } from "./Router.ts"
import { htmlCompile } from "./HtmlCompiler.ts"

/**
 * 起動構成
 */
export interface StartupConfig {
    hostname?: string;
    port?: string;
}

/**
 * Serverのresponse関連の機能をまとめたクラス。
 */
export class SystemResponse {

    /** requestを格納する変数 */
    #request: ServerRequest;

    /** presetを格納する変数 */
    #preset: { [key: string]: any; };

    /** レスポンスオブジェクト */
    response: Response;

    /** 強制ダウンロードかどうか（初期値はfalse） */
    isForceDownload: boolean;

    constructor(request: ServerRequest) {
        this.#request = request;

        this.response = {
            status: 500,
            headers: new Headers(),
            body: "500 Internal Server Error"
        }

        this.#preset = {};

        this.isForceDownload = false;
    }

    /**
     * Responseオブジェクトにテキストを設定する。
     * @param text クライアントに返す文字列。
     * @param status ステータスコード（デフォルトは200）。
     * @param statusText ステータステキスト。
     */
    setText(text: String, status: Number = 200, statusText: String | null = null): void {
        this.response.text = htmlCompile(text, this.#preset);
        this.response.status = status;
        if(statusText != null) this.response.statusText = statusText;
        else if(this.response.statusText != undefined) delete this.response.statusText;
        this.response.headers.set('Content-Type', 'text/plain');
    }

    /**
     * Responseオブジェクトにファイルを設定する。
     * @param filePath クライアントに返すファイルのパス。
     * @param status ステータスコード（デフォルトは200）。
     * @param statusText ステータステキスト。
     */
    async setFile(filePath: String, status: Number = 200, statusText: String | null = null): Promise<void> {
        const file = await Deno.open(filePath);
        let file_data: string;
        try {
            file_data = await Deno.readAll(file);
            this.setText(file_data, status, statusText);
            const extensions: false | string = lookup(filePath);
            if(extensions) this.response.headers.set('Content-Type', extensions);
        } catch {
            console.log(`\n[ error ]\n
            The "${filePath}" file could not be read.\n
            "${filePath}"ファイルが読み取れませんでした。\n`);
            this.setText("500 Internal Server Error", 500);
        }
    }

    /**
     * セットしたファイルや文字列に変数が埋め込まれていた場合に、参照されるオブジェクトを定義する。
     * @param object 参照される変数を格納したオブジェクト。
     */
    preset(object: { [key: string]: any; }): void {
        this.#preset = object;
    }

    /**
     * Cookieのセットを行う。
     * @param cookie 
     */
    setCookie(cookie: Cookie): void {
        setCookie(this.response, cookie);
    }

    /**
     * Cookieの削除を行う。
     * @param name 削除するCookie名。
     */
    deleteCookie(
        name: string,
        attributes?: { path?: string; domain?: string }
    ): void {
        this.setCookie({
            name: name,
            value: "",
            expires: new Date(0),
            ...attributes,
        });
    }

    /**
     * ServerRequestのrespondを実行する。
     */
    respond(): void {
        if(this.isForceDownload) this.response.headers.set('Content-Type', 'application/octet-stream');
        this.#request.respond(this.response);
    }
}


export class System {

    /** サーバーを保持する変数 */
    #server: Server;

    /** WebSocketの処理 */
    #wsHandler: Function;

    /** 起動構成を保持する変数 */
    #startupConfig: StartupConfig;

    /** 開発者が追加したモジュールを保持する */
    #modules: any[];

    constructor(...modules: any[]) {
        this.#modules = modules;
    }

    /**
     * サーバーへのリクエストを処理するルートを追加する。
     * @param pathOrRoute 文字列の場合はそれをPATHとしたRouteを作成し追加、Routeの場合はそのまま追加する。
     * @returns 作成したRouteオブジェクトを返す。
     */
    createRoute(pathOrRoute: string | Route): Route {

        const route = (typeof pathOrRoute == "string")? new Route(pathOrRoute) : pathOrRoute;

        return route;
    }

    /**
     * サーバーへのリクエストを処理するルートを複数同時に作成する。
     * @param pathsOrRoutes アクセス先のパス、もしくはRouteオブジェクトの配列。
     * @returns Routeオブジェクト。
     */
    createRoutes(...pathsOrRoutes: (string | Route)[]): Promise<{ [key: string]: Route; }> {

        const routeList: { [key: string]: Route; } = {};
        for(let pathOrRoute of pathsOrRoutes) {
            const route: Route = this.createRoute(pathOrRoute);
            if(route) routeList[route.PATH()] = route;
        }

        return new Promise((resolve) => resolve(routeList));
    }

    /**
     * 指定したrouteを削除する。
     * @param path パス（可変長引数）。
     */
    deleteRoute(...path: string[]): void {
        this.deleteRoutes(path);
    }

    /**
     * 指定したrouteを削除する。
     * @param path パス配列。
     */
    deleteRoutes(paths: string[]): void {
        Route.list = Route.list.filter(route=>!paths.includes(route.PATH()));
    }

    /**
     * 指定したpathが設定されたRouteオブジェクトを返す。
     * @param path RouteオブジェクトのPATH
     * @returns 指定されたRouteオブジェクト。
     */
    Route(path: Route): Route | undefined {

        const route: Route[] = Route.list.filter( (route: Route) => route.PATH() == path );

        return route[0];
    }

    async listen(): Promise<StartupConfig> {
        const startupConfig: StartupConfig = {
            hostname: "localhost",
            port: "8080",
        }
        const server = serve({hostname: startupConfig.hostname, port: startupConfig.port});

        for await (const request of server) {
            //handler(request);
            const [route, isWebSocket]: [Route, boolean] | undefined = rooting(request);
            
        }

        return new Promise(resolve=>resolve(startupConfig));
    }

    //async close(): void
}