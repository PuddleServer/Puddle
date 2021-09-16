/**
 * 実行クラス
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-16
 */

import {
    serve, Server, HTTPOptions, HTTPSOptions, _parseAddrFromStr, ServerRequest, Response,
    Cookie, getCookies, setCookie, deleteCookie,
    acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket,
    lookup,
    Route, control, default_error,
    htmlCompile
} from "./mod.ts"

/**
 * 起動構成
 */
export interface StartupConfig {
    hostname?: string;
    port?: number;
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

    headers: Headers;

    /** 強制ダウンロードかどうか（初期値はfalse） */
    isForceDownload: boolean;

    constructor(request: ServerRequest) {
        this.#request = request;

        this.headers = new Headers();
        this.response = {
            status: 500,
            headers: this.headers,
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
    setText(text: string, status: number = 200, statusText: string | null = null): void {
        this.response.body = htmlCompile(text, this.#preset);
        this.response.status = status;
        if(statusText != null) this.response.statusText = statusText;
        else if(this.response.statusText != undefined) delete this.response.statusText;
        this.headers.set('Content-Type', 'text/plain');
    }

    /**
     * Responseオブジェクトにファイルを設定する。
     * @param filePath クライアントに返すファイルのパス。
     * @param status ステータスコード（デフォルトは200）。
     * @param statusText ステータステキスト。
     */
    async setFile(filePath: string, status: number = 200, statusText: string | null = null): Promise<void> {
        const file = await Deno.open(filePath);
        let file_data: string;
        try {
            const decoder = new TextDecoder('utf-8');
            file_data = decoder.decode(await Deno.readAll(file));
            this.setText(file_data, status, statusText);
            const extensions: false | string = lookup(filePath);
            if(extensions) this.headers.set('Content-Type', extensions);
        } catch {
            console.log(`\n[ warning ]\n
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
    send(): void {
        if(this.isForceDownload) {
            this.headers.set('Content-Type', 'application/octet-stream');
        }
        this.response.headers = this.headers;
        this.#request.respond(this.response);
    }
}

/**
 * URLを扱いやすくするクラス。
 */
export class URL {
    #url: [string, string|undefined];

    constructor(url: string) {
        const index: number = url.indexOf('?');
        if(index < 0) this.#url = [url, undefined];
        else this.#url = [url.slice(0, index), url.slice(index+1)];
    }

    toString(): string {
        return this.#url.join('?');
    }

    get path(): string {
        return this.#url[0];
    }

    get search(): string | undefined {
        return this.#url[1];
    }

    get query(): { [key: string]: string; } | undefined {
        if(!this.#url[1]) return undefined;
        const query: string[][] = this.#url[1].split('&').map(v=>(v.includes('='))?v.split('='):[v,v]);
        const params: { [key: string]: string; } = {};
        for(let q of query) {
            if(!(q[0] && q[1])) continue;
            params[q[0]] = q[1];
        }
        return params;
    }
}

/**
 * URLオブジェクトを返すクラス。
 * @param url 元となるurl
 * @returns URLオブジェクト。
 */
export function parseUrl(url: string) {
    return new URL(url);
}

export class System {

    /** サーバーを保持する変数 */
    static server: Server;

    /** 起動構成を保持する変数 */
    static startupConfig: StartupConfig;

    /** 開発者が追加したモジュールを保持する */
    static modules: { [key: string]: any; } = {};

    /**
     * モジュールを取得する。
     * @param key モジュール名。
     */
    static getModule(key: string): any {
        return System.modules[key];
    }

    /**
     * モジュールを追加する。
     * @param key モジュール名。
     * @param module モジュール本体。
     */
    static setModule(key: string, module: any): void {
        System.modules[key] = module;
    }

    /**
     * モジュールを追加する。
     * @param modules モジュールの連想配列。
     */
    static setModules(modules: { [key: string]: any; }): void {
        for(let key in modules) {
            System.setModule(key, modules[key]);
        }
    }

    /**
     * モジュールを削除する。
     * @param key モジュール名(可変長引数)。
     */
    static deleteModule(...key: string[]) {
        for(let k of key) {
            delete System.modules[k];
        }
    }

    /**
     * サーバーへのリクエストを処理するルートを追加する。
     * @param pathOrRoute 文字列の場合はそれをPATHとしたRouteを作成し追加、Routeの場合はそのまま追加する。
     * @returns 作成したRouteオブジェクトを返す。
     */
    static createRoute(pathOrRoute: string | Route): Route {

        const route = (typeof pathOrRoute == "string")? new Route(pathOrRoute) : pathOrRoute;

        return route;
    }

    /**
     * サーバーへのリクエストを処理するルートを複数同時に作成する。
     * @param pathsOrRoutes アクセス先のパス、もしくはRouteオブジェクトの配列。
     * @returns Routeオブジェクト。
     */
    static createRoutes(...pathsOrRoutes: (string | Route)[]): Promise<{ [key: string]: Route; }> {

        const routeList: { [key: string]: Route; } = {};
        for(let pathOrRoute of pathsOrRoutes) {
            const route: Route = System.createRoute(pathOrRoute);
            if(route) routeList[route.PATH()] = route;
        }

        return new Promise((resolve) => resolve(routeList));
    }

    /**
     * 指定したrouteを削除する。
     * @param path パス（可変長引数）。
     */
    static deleteRoute(...path: string[]): void {
        System.deleteRoutes(path);
    }

    /**
     * 指定したrouteを削除する。
     * @param path パス配列。
     */
    static deleteRoutes(paths: string[]): void {
        Route.list = Route.list.filter(route=>!paths.includes(route.PATH()));
    }

    /**
     * 指定したpathが設定されたRouteオブジェクトを返す。
     * @param path RouteオブジェクトのPATH
     * @returns 指定されたRouteオブジェクト。
     */
    static Route(path: string): Route {
        return Route.getRouteByPath(path);
    }

    static async listen(addr: number | string | HTTPOptions, startFunction?: Function): Promise<StartupConfig> {
        if (typeof addr === "string") {
            // あとでファイルパスからの読み込みに変更
            addr = _parseAddrFromStr(addr);
        } else if(typeof addr === "number") {
            addr = {port: addr};
        }
        const startupConfig: StartupConfig = {
            hostname: addr.hostname || "localhost",
            port: addr.port,
        }
        System.close();
        System.server = serve(addr);
        if(startFunction) startFunction(startupConfig);
        for await (const request of System.server) {
            //handler(request);
            request.url = decodeURIComponent(request.url);
            const route: Route = Route.getRouteByUrl(parseUrl(request.url).path) || Route["404"];
            control(request, route);
        }

        return new Promise(resolve=>resolve(startupConfig));
    }

    static close(): void {
        if(System.server) System.server.close();
    }
}