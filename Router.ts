/**
 * ルーティングを行うクラスファイル。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-24
 */

import { createHash, WebSocketRoute, default_get, default_error, System, ErrorLog } from "./mod.ts"

export class Route {

    static list: Route[] = [];

    static "502" = new Route("502", [], default_error(502, `Server error.<br>サーバーエラー。`));

    static "404" = new Route("404", [], default_error(404, `Not found.<br>見つかりません。`));
    
    static "403" = new Route("403", ["/403"], default_error(403, `Forbidden.<br>認証が拒否されました。`));

    /** サーバーへのリクエストの名前 */
    #PATH: string;

    /** リクエストを許可する別名 */
    #URL: string[];

    /** GETリクエスト時の処理をまとめた関数 */
    #GET: Function;

    /** PUTリクエスト時の処理まとめた関数 */
    #PUT: Function;

    /** POSTリクエスト時の処理まとめた関数 */
    #POST: Function;

    /** DELETEリクエスト時の処理まとめた関数 */
    #DELETE: Function;

    /** PATCHリクエスト時の処理まとめた関数 */
    #PATCH: Function;

    #AUTH: string[] | undefined;

    #wsRoute: WebSocketRoute | undefined;

    constructor(PATH: string, URL: string[] = [], GET?: Function | null, POST?: Function | null, PUT?: Function | null, DELETE?: Function | null, PATCH?: Function | null) {
        if(Route.isThePathInUse(PATH)) {
            new ErrorLog("error", `The path "${PATH}" is already in use.`);
            throw new Error(`\n[ Error ]\n
            The path "${PATH}" is already in use.\n
            "${PATH}"というパスは既に使用されています。\n`);
        }
        this.#PATH = PATH;
        this.#URL = [];
        URL.push(this.#PATH);
        this.URL.apply(this, URL);
        this.#GET = GET || default_get();
        const process_502: Function = (this.#PATH == "502")? this.#GET : Route["502"].GET();
        if(GET==undefined) this.#GET = default_get();
        else if(GET==null) this.#GET = process_502;
        this.#PUT = PUT || process_502;
        this.#POST = POST || process_502;
        this.#DELETE = DELETE || process_502;
        this.#PATCH = PATCH || process_502;
        this.#AUTH = undefined;
        this.#wsRoute = undefined;
        Route.list.push(this);
    }

    /**
     * サーバーへのリクエストの名前を返す。
     * @returns PATH
     */
    PATH(): string {
        return this.#PATH;
    }

    /**
     * URLの取得、設定を行う。
     * @param urls 許可するリクエストURL(可変長引数)。
     * @returns 引数がない場合はURLを、ある場合はthisを返す。
     */
    URL(): string[];
    URL(urls: string[]): Route;
    URL(...urls: string[]): Route;
    URL(...urls: string[]|string[][]): string[] | Route {
        if(!urls.length) return this.#URL;
        urls = urls.flat();

        urls.filter(function (url, i, self) {
            return self.indexOf(url) === i;
        });
        this.#URL = Route.getUniqueUrlArray(urls);
        return this;

    }

    /**
     * GETの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はGETを、ある場合はthisを返す。
     */
    GET(): Function;
    GET(process: Function): Route;
    GET(process?: Function): Function | Route {

        if(!process) return this.#GET;

        this.#GET = process;
        return this;

    }

    /**
     * PUTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPUTを、ある場合はthisを返す。
     */
    PUT(): Function;
    PUT(process: Function): Route;
    PUT(process?: Function): Function | Route {

        if(!process) return this.#PUT;

        this.#PUT = process;
        return this;

    }

    /**
     * POSTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPOSTを、ある場合はthisを返す。
     */
    POST(): Function;
    POST(process: Function): Route;
    POST(process?: Function): Function | Route {

        if(!process) return this.#POST;

        this.#POST = process;
        return this;

    }

    /**
     * DELETEの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はDELETEを、ある場合はthisを返す。
     */
    DELETE(): Function;
    DELETE(process: Function): Route;
    DELETE(process?: Function): Function | Route {

        if(!process) return this.#DELETE;

        this.#DELETE = process;
        return this;

    }

    /**
     * PATCHの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPATCHを、ある場合はthisを返す。
     */
    PATCH(): Function;
    PATCH(process: Function): Route;
    PATCH(process?: Function): Function | Route {

        if(!process) return this.#PATCH;

        this.#PATCH = process;
        return this;

    }

    #_AUTH(param0: string, param1?: string): string {
        if(!param1) return param0;
        return createHash("md5").update(`${param0}:${this.#PATH}:${param1}`).toString();
    }

    AUTH(): string[] | undefined;
    AUTH(hash: string): Route;
    AUTH(name: string, password: string): Route;
    AUTH(...param: {[key:string]:string;}[]): Route;
    AUTH(...param: (string|{[key:string]:string;})[]): string[] | undefined | Route {
        if(param.length == 0) return this.#AUTH;
        if(param.length <= 2 && typeof param[0] == "string") {
            if(typeof param[1] == "string") this.#AUTH = [this.#_AUTH(param[0], param[1])];
            else this.#AUTH = [this.#_AUTH(param[0])];
            return this;
        }
        const hash: string[] = [];
        for(let v of param) {
            if(typeof v != "object") continue;
            if(v.name && v.password) hash.push(this.#_AUTH(v.name, v.password));
            else if(v.hash) hash.push(this.#_AUTH(v.hash));
        }
        this.#AUTH = hash;
        return this;
    }

    /**
     * WebSocket通信かどうか
     */
    get isWebSocket(): boolean {
        return Boolean(this.#wsRoute);
    }

    /**
     * WebSocket通信の場合に呼び出されるメソッド
     * @returns WebSocketRouteを返す
     */
    WebSocket(event?: { [key:string]: Function; }): WebSocketRoute {
        if(!this.#wsRoute) this.#wsRoute = new WebSocketRoute(event);
        return this.#wsRoute;
    }

    /**
     * RouteのURLに重複がないかをチェックし、重複を削除したURL配列を返す。
     * @param urls チェックするURL配列
     * @returns 重複を取り除いたURL配列。
     */
    static getUniqueUrlArray(urls: string[]): string[] {
        
        const uniqueUrlArray: string[] = urls.filter( u => !Route.list.map(route=>route.URL()).flat().includes(u) );
        if( uniqueUrlArray.length != urls.length ) {
            const duplicateUrl = urls.filter( u => !uniqueUrlArray.includes(u) );
            console.log(`\n[ warning ]\n
            Of the specified URLs, ${duplicateUrl.join(', ')} are duplicated.\n
            指定されたURLのうち、${duplicateUrl.join(', ')} が重複しています。\n`);
            new ErrorLog("warning", `Of the specified URLs, ${duplicateUrl.join(', ')} are duplicated.`);
        }
        return uniqueUrlArray;
    }

    /**
     * 指定されたパスが使用済みかどうか。
     * @param path パス。
     * @returns 真偽値。
     */
    static isThePathInUse(path: string): boolean {
        return Route.list.map(route=>route.PATH()).flat().includes(path);
    }

    /**
     * 指定されたURLが使用済みかどうか。
     * @param urls URL配列。
     * @returns 真偽値。
     */
    static isTheUrlAlreadyInUse(...urls: string[]): boolean {
        return Boolean(urls.filter( u => Route.list.map(route=>route.URL()).flat().includes(u) ).length);
    }

    /**
     * 指定したpathが設定されたRouteオブジェクトを返す。
     * @param path RouteオブジェクトのPATH
     * @returns 指定されたRouteオブジェクト。
     */
    static getRouteByPath(path: string): Route {
        const routes: Route[] = Route.list.filter( (route: Route) => route.PATH() == path );
        if(routes.length) return routes[0];
        else {
            console.log(`\n[ warning ]\n
            There is no Route with the PATH "${path}".\n
            パスが"${path}"のRouteはありません。\n`);
            new ErrorLog("warning", `There is no Route with the PATH "${path}".`);
            return new Route(path);
        }
    }

    /**
     * 指定したurlを含むRouteを返す。
     * @param url URL
     * @returns Routeオブジェクト
     */
    static getRouteByUrl(url: string): Route | undefined {
        const routes: Route[] = Route.list.filter(route => route.URL().includes(url));
        return routes[0];
    }

}