/**
 * ルーティングを行うクラスファイル。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-07
 */

import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts"

export class Route {

    static list: Route[] = [];

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

    isWebSocket: boolean;

    constructor(PATH: string, URL: string[] = [], GET?: Function | null, PUT?: Function | null, POST?: Function | null, DELETE?: Function | null) {
        if(Route.isThePathInUse(PATH)) {
            throw new Error(`\n[ Error ]\n
            The path "${PATH}" is already in use.\n
            "${PATH}"というパスは既に使用されています。\n`);
        }
        this.#PATH = PATH;
        URL.push(this.#PATH);
        this.URL(...URL);
        this.#GET = GET || function(){console.log("GET")};// || default_get;
        this.#PUT = PUT || function(){console.log("PUT")};// || default_PUT;
        this.#POST = POST || function(){console.log("POST")};// || default_POST;
        this.#DELETE = DELETE || function(){console.log("DELETE")};// || default_DELETE;

        this.isWebSocket = false;
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
    URL(...urls: string[]): Route;
    URL(...urls: string[]): string[] | Route {

        if(!urls.length) return this.#URL;

        urls.filter(function (url, i, self) {
            return self.indexOf(url) === i;
        });
        this.#URL = this.getUniqueUrlArray(urls);
        return this;

    }

    /**
     * GETの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @param isWebSocket WebSocketの処理かどうか。
     * @returns 引数がない場合はGETを、ある場合はthisを返す。
     */
    GET(): Function;
    GET(process: Function, isWebSocket?: boolean): Route;
    GET(process?: Function, isWebSocket?: boolean): Function | Route {
        
        if(isWebSocket) this.isWebSocket = isWebSocket;

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
    PUT(process?: Function, isWebSocket?: false): Function | Route {

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
    POST(process?: Function, isWebSocket?: false): Function | Route {

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
    DELETE(process?: Function, isWebSocket?: false): Function | Route {

        if(!process) return this.#DELETE;

        this.#DELETE = process;
        return this;

    }

    /**
     * RouteのURLに重複がないかをチェックし、重複を削除したURL配列を返す。
     * @param urls チェックするURL配列
     * @returns 重複を取り除いたURL配列。
     */
    private getUniqueUrlArray(urls: string[]): string[] {
        
        const uniqueUrlArray: string[] = urls.filter( u => !Route.list.map(route=>route.URL()).flat().includes(u) );
        if( uniqueUrlArray.length != urls.length ) {
            const duplicateUrl = urls.filter( u => !uniqueUrlArray.includes(u) );
            console.log(`\n[ warning ]\n
            Of the specified URLs, ${duplicateUrl.join(', ')} are duplicated.\n
            指定されたURLのうち、${duplicateUrl.join(', ')} が重複しています。\n`);
        }
        return uniqueUrlArray;
    }

    /**
     * 指定されたパスが使用済みかどうか。
     * @param path パス。
     * @returns 真偽値。
     */
    static isThePathInUse(path: string) {
        return Route.list.map(route=>route.PATH()).flat().includes(path);
    }

    /**
     * 指定されたURLが使用済みかどうか。
     * @param urls URL配列。
     * @returns 真偽値。
     */
    static isTheUrlAlreadyInUse(...urls) {
        return Boolean(urls.filter( u => Route.list.map(route=>route.URL()).flat().includes(u) ).length);
    }

}

/**
 * requestとRoute配列を照合して、リクエストのあったRouteを返す。
 * @param request サーバーリクエスト。
 * @param routes 参照するRoute配列。
 * @returns ハンドラー関数, WebSocketの処理かどうか。
 */
export function rooting(request: ServerRequest, routes: Route[]): Function | undefined {
    const requestRoute: Route[] = routes.filter(route => route.URL().includes(request.url));
    const route: Route | undefined = (requestRoute.length) ? requestRoute[0] : undefined;
    if(!route) return undefined;
    switch (request.method) {
        case "GET":
            return route.GET;
        case "PUT":
            return route.PUT;
        case "POST":
            return route.POST;
        case "DELETE":
            return route.DELETE;

        default:
            return undefined;
    }
}