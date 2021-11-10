import { SystemRequest, SystemResponse, createHash, WebSocketRoute, WebSocketEvent, default_get, default_error, redirect, ErrorLog } from "../mod.ts";

export type HandlerFunction = {
    (request: SystemRequest, response: SystemResponse): Response | Promise<Response> | void | Promise<void>;
};

/**
 * サーバーのルーティングに関する設定を行う。
 * Configure settings related to server routing.
 * 
 * ```ts
 *  new Route("./assets/index.html");
 *  new Route("./assets/about.html", ["/About", "about"]);
 * ```
 */
export class Route {

    /**
     * ルートを格納する配列。
     * Array to store the route.
     */
    static list: Route[] = [];

    /**
     * 404エラーを返すルート。
     * A route that returns a 404 error.
     */
    static "404" = new Route("404", [], default_error(404, `Not Found. 見つかりません。`));

    /**
     * 500エラーを返すルート。
     * A route that returns a 500 error.
     */
    static "500" = new Route("500", [], default_error(500, `Internal Server Error. サーバーエラー。`));

    /**
     * 502エラーを返すルート。
     * A route that returns a 502 error.
     */
    static "502" = new Route("502", [], default_error(502, `Bad Gateway. サーバー通信エラー。`));

    /**
     * 403エラーを返すルート。
     * A route that returns a 403 error.
     */
    static "403" = new Route("403", [], default_error(403, `Forbidden. 認証が拒否されました。`));

    /**
     * ファイルパス。（`"default_get()"`を使わない場合は、どのルートかが分かるキーワード）
     * File path. (if you don't use `"default_get()"`, the keyword that tells you which root it is)
     */
    #PATH: string;

    /**
     * リクエストを許可するURLのPathname。
     * Pathname of the URL to allow the request.
     */
    #URL: string[];

    /**
     * GETリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a GET request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    #GET: HandlerFunction;

    /**
     * PUTリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a PUT request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    #PUT: HandlerFunction;

    /**
     * POSTリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a POST request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    #POST: HandlerFunction;

    /**
     * DELETEリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a DELETE request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    #DELETE: HandlerFunction;

    /**
     * PATCHリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a PATCH request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    #PATCH: HandlerFunction;

    /**
     * ダイジェスト認証に使用するMd5ハッシュを格納した変数。認証を使用しない場合は`"undefined"`。
     * A variable that contains the Md5 hash used for digest authentication; If authentication is not used, it is "undefined".
     */
    #AUTH: string[] | undefined;

    /**
     * WebSocket通信を利用する場合にWebSocketRouteオブジェクトを格納する変数。WebSocket通信を利用しない場合は"undefined"。
     * Variable that stores the WebSocketRoute object when WebSocket communication is used; `"undefined"` when WebSocket communication is not used.
     */
    #wsRoute: WebSocketRoute | undefined;

    constructor(PATH: string, URL: string[] = [], GET?: HandlerFunction | null, POST?: HandlerFunction | null, PUT?: HandlerFunction | null, DELETE?: HandlerFunction | null, PATCH?: HandlerFunction | null) {
        if(Route.isThePathInUse(PATH)) {
            new ErrorLog("error", `The path "${PATH}" is already in use.`);
            throw new Error(`\n[ Error ]\n
            The path "${PATH}" is already in use.\n
            "${PATH}"というパスは既に使用されています。\n`);
        }
        this.#PATH = PATH;
        this.#URL = [];
        const _path = (this.#PATH[0] == "." ? "/" + this.#PATH.slice(1) : "/" + this.#PATH).replace("//", "/");
        URL.unshift(_path.replace(".html", ""));
        if(URL[0] != _path) URL.push(_path);
        this.URL.apply(this, URL);
        this.#GET = GET || default_get();
        const process_404: HandlerFunction = (this.#PATH == "404")? this.#GET : Route["404"].GET();
        if(GET==undefined) this.#GET = default_get();
        else if(GET==null) this.#GET = process_404;
        this.#PUT = PUT || process_404;
        this.#POST = POST || process_404;
        this.#DELETE = DELETE || process_404;
        this.#PATCH = PATCH || process_404;
        this.#AUTH = undefined;
        this.#wsRoute = undefined;
        Route.list.push(this);
    }

    /**
     * PATHのゲッター。
     * Getter of PATH.
     * @returns PATH
     */
    PATH(): string {
        return this.#PATH;
    }

    /**
     * URLのゲッター兼セッター。
     * URL getter/setter.
     * @param urls URL to allow requests; If not specified, it will function as a getter.
     * @returns URL array or Route object.
     */
    URL(): string[];
    URL(urls: string[]): Route;
    URL(...urls: string[]): Route;
    URL(...urls: string[]|string[][]): string[] | Route {
        if(!urls.length) return this.#URL;
        urls = urls.flat();
        this.#URL = this.getUniqueUrlArray(urls);
        return this;

    }

    /**
     * GETリクエスト時の処理のゲッター兼セッター。
     * A getter and setter for processing GET requests.
     * @param process Handler function describing the process.
     *                Arguments: SystemRequest, SystemResponse.
     * @returns Handler function or Route object.
     */
    GET(): HandlerFunction;
    GET(process: HandlerFunction): Route;
    GET(process: Response): Route;
    GET(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.#GET;
        if(typeof process == "object") this.#GET = ()=>process;
        else this.#GET = process;
        return this;

    }

    /**
     * PUTリクエスト時の処理のゲッター兼セッター。
     * A getter and setter for processing PUT requests.
     * @param process Handler function describing the process.
     *                Arguments: SystemRequest, SystemResponse.
     * @returns Handler function or Route object.
     */
    PUT(): HandlerFunction;
    PUT(process: HandlerFunction): Route;
    PUT(process: Response): Route;
    PUT(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.#PUT;

        if(typeof process == "object") this.#PUT = ()=>process;
        else this.#PUT = process;
        return this;

    }

    /**
     * POSTリクエスト時の処理のゲッター兼セッター。
     * A getter and setter for processing POST requests.
     * @param process Handler function describing the process.
     *                Arguments: SystemRequest, SystemResponse.
     * @returns Handler function or Route object.
     */
    POST(): HandlerFunction;
    POST(process: HandlerFunction): Route;
    POST(process: Response): Route;
    POST(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.#POST;

        if(typeof process == "object") this.#POST = ()=>process;
        else this.#POST = process;
        return this;

    }

    /**
     * DELETEリクエスト時の処理のゲッター兼セッター。
     * A getter and setter for processing DELETE requests.
     * @param process Handler function describing the process.
     *                Arguments: SystemRequest, SystemResponse.
     * @returns Handler function or Route object.
     */
    DELETE(): HandlerFunction;
    DELETE(process: HandlerFunction): Route;
    DELETE(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.#DELETE;

        if(typeof process == "object") this.#DELETE = ()=>process;
        else this.#DELETE = process;
        return this;

    }

    /**
     * PATCHリクエスト時の処理のゲッター兼セッター。
     * A getter and setter for processing PATCH requests.
     * @param process Handler function describing the process.
     *                Arguments: SystemRequest, SystemResponse.
     * @returns Handler function or Route object.
     */
    PATCH(): HandlerFunction;
    PATCH(process: HandlerFunction): Route;
    PATCH(process: Response): Route;
    PATCH(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.#PATCH;

        if(typeof process == "object") this.#PATCH = ()=>process;
        else this.#PATCH = process;
        return this;

    }

    /**
     * ダイジェスト認証に使用する"A1"の情報をハッシュ化するメソッド。
     * A method for hashing the "A1" information used for digest authentication.
     * @param param0 User name.
     * @param param1 Password.
     * @returns Hashed string.
     */
    #_AUTH(param0: string, param1?: string): string {
        if(!param1) return param0;
        return createHash("md5").update(`${param0}:${this.#PATH}:${param1}`).toString();
    }

    /**
     * ダイジェスト認証のゲッター兼セッター。
     * Getter and Setter for Digest Authentication.
     * @param name User name.
     * @param password Password.
     * @param hash String of A1 information hashed with Md5.
     * @return Hash value array or Route object.
     * ```ts
     * const hash = createHash("md5").update(`${user_name}:${Route.PATH()}:${password}`).toString();
     * ```
     */
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
     * WebSocket通信を使用するルートかどうか。
     * Whether the Route uses WebSocket communication.
     * @return True if WebSocket is used.
     */
    get isWebSocket(): boolean {
        return Boolean(this.#wsRoute);
    }

    /**
     * WebSocketRouteのゲッター兼セッター。
     * Getter and Setter for WebSocketRoute.
     * @param event An associative array that stores the respective processes with onopen, onclose, and onmessage as keys.
     * @returns WebSocketRoute object.
     * 
     * ```ts
     * System.createRoute("/ws").WebSocket({
     *      onopen: ((client: WebSocketClient) => {
     *          console.log(`>> WebSocket opened.`);
     *          client.reply("Connected");
     *      },
     *      onmessage: (client: WebSocketClient) => {
     *          client.sendAll(client.message);
     *      }
     * });
     * 
     * System.createRoute("/ws").WebSocket()
     *      .onopen((client: WebSocketClient) => {
     *          console.log(`>> WebSocket opened.`);
     *          client.reply("Connected");
     *      })
     *      .onmessage((client: WebSocketClient) => {
     *          client.sendAll(client.message);
     *      });
     * ```
     */
    WebSocket(event?: WebSocketEvent): WebSocketRoute {
        if(!this.#wsRoute) this.#wsRoute = new WebSocketRoute(event);
        return this.#wsRoute;
    }

    /**
     * ルートのURLに重複がないかをチェックし、重複を削除したURL配列を返す。
     * Checks for duplicates in the Route URLs and returns a URL array with the duplicates removed.
     * @param urls URL array to check.
     * @returns URL array with duplicates removed.
     */
    getUniqueUrlArray(urls: string[]): string[] {
        const registeredURL: string[] = [];
        Route.list.forEach(route=>{
            if(route.PATH()!=this.#PATH) registeredURL.push(...route.URL());
        });
        const uniqueUrlArray: string[] = [];
        const duplicateUrlArray: string[] = [];
        urls.forEach(url=>{
            if(!registeredURL.includes(url)) uniqueUrlArray.push(url);
            else duplicateUrlArray.push(url);
        })
        if( duplicateUrlArray.length ) {
            console.log(`\n[ warning ]\n
            Of the specified URLs, ${duplicateUrlArray.join(', ')} are duplicated.\n
            指定されたURLのうち、${duplicateUrlArray.join(', ')} が重複しています。\n`);
            new ErrorLog("warning", `Of the specified URLs, ${duplicateUrlArray.join(', ')} are duplicated.`);
        }
        return uniqueUrlArray;
    }

    /**
     * 指定されたパスが既に使用されているかどうか。
     * Whether or not the specified path is already in use.
     * @param path PATH name.
     * @returns True if it is already in use.
     */
    static isThePathInUse(path: string): boolean {
        return Route.list.map(route=>route.PATH()).flat().includes(path);
    }

    /**
     * 指定されたURLが既に使用されているかどうか。
     * Whether or not the specified URL is already in use.
     * @param urls URL.
     * @returns True if it is already in use.
     */
    static isTheUrlAlreadyInUse(...urls: string[]): boolean {
        return Boolean(urls.filter( u => Route.list.map(route=>route.URL()).flat().includes(u) ).length);
    }

    /**
     * 指定されたPATHが設定されているRouteオブジェクトを取得する。
     * Get the Route object with the specified PATH set.
     * @param path PATH of the Route object.
     * @returns Route object; If it does not exist, create a new one.
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
     * 指定したURLを含むルートオブジェクトを取得する。
     * @param url Get a Route object containing the specified URL.
     * @returns Route object.
     */
    static getRouteByUrl(url: string, variables: {[key: string]: string;} = {}): Route | undefined {
        let result: Route | undefined = undefined;
        const targets = `${url}/`.replace(/\/+/g, "/").split("/");
        for(let route of Route.list) {
            const urls = route.URL()
            for(let registeredURL of urls) {
                const span = `${registeredURL}/`.replace(/\/+/g, "/").split("/");
                if(targets.length != span.length) continue;
                let flug = true;
                for(let i in span) {
                    if(span[i][0] == ":") {
                        variables[span[i].slice(1)] = targets[i];
                        continue;
                    }
                    if(span[i] != targets[i]) {
                        flug = false;
                        break;
                    }
                }
                if(flug) {
                    result = Route.getRouteByPath(route.PATH());
                    break;
                }
                
            }
            if(result) break;
        }
        return result;
    }

}