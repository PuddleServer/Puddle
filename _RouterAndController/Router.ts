import { SystemRequest, SystemResponse, createHash, WebSocketClient, default_get, default_onmessage, default_onopen, default_error, redirect, ErrorLog } from "../mod.ts";

export type HandlerFunction = {
    (request: SystemRequest, response: SystemResponse): Response | Promise<Response> | void | Promise<void>;
};

export type WebSocketHandlerFunction = {
    (client: WebSocketClient, ev?: Event | MessageEvent<any> | ErrorEvent | CloseEvent): void;
}

/**
 * WebSocketRouteを初期化する際の引数として使用されるオブジェクト。
 * An object used as an argument when initializing a WebSocketRoute.
 */
export interface WebSocketEvent {
    onopen?: WebSocketHandlerFunction;
    onclose?: WebSocketHandlerFunction;
    onmessage?: WebSocketHandlerFunction;
    onerror?: WebSocketHandlerFunction;
}

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
    onget: HandlerFunction;

    /**
     * PUTリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a PUT request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    onput: HandlerFunction;

    /**
     * POSTリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a POST request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    onpost: HandlerFunction;

    /**
     * DELETEリクエスト時の処理をまとめた関数。
     * A function that summarizes the process when a DELETE request is made.
     * @param request SystemRequest.
     * @param response SystemResponse.
     */
    ondelete: HandlerFunction;

    /**
     * クライアントとの通信開始時に実行される関数。
     * Function executed at the start of communication with the client.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     */
    onopen: WebSocketHandlerFunction;

    /**
      * クライアントとの接続が切れたときに実行される関数。
      * Function to be executed when the connection to the client is lost.
      * @param request SystemRequest.
      * @param client WebSocketClient.
      */
    onclose: WebSocketHandlerFunction;
 
    /**
     * クライアントからメッセージが送られてきたときに実行される関数。
     * A function that is executed when a message is sent from a client.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     * @param message A message sent by the client.
     */
    onmessage: WebSocketHandlerFunction;

    onerror: WebSocketHandlerFunction;

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

    #isWebSocket: boolean = false;

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
        this.onget = GET || default_get();
        const process_404: HandlerFunction = (this.#PATH == "404")? this.onget : Route["404"].GET();
        if(GET === undefined) this.onget = default_get();
        else if(GET === null) this.onget = process_404;
        this.onput = PUT || process_404;
        this.onpost = POST || process_404;
        this.ondelete = DELETE || process_404;
        this.onopen = default_onopen;
        this.onclose = function(){};
        this.onmessage = default_onmessage;
        this.onerror = function(){};
        this.#PATCH = PATCH || process_404;
        this.#AUTH = undefined;
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

        if(!process) return this.onget;
        if(typeof process == "object") this.onget = ()=>process;
        else this.onget = process;
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

        if(!process) return this.onput;

        if(typeof process == "object") this.onput = ()=>process;
        else this.onput = process;
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

        if(!process) return this.onpost;

        if(typeof process == "object") this.onpost = ()=>process;
        else this.onpost = process;
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
    DELETE(process: Response): Route;
    DELETE(process?: HandlerFunction | Response): HandlerFunction | Route {

        if(!process) return this.ondelete;

        if(typeof process == "object") this.ondelete = ()=>process;
        else this.ondelete = process;
        return this;

    }

    /**
     * WebSocket通信を使用するルートかどうか。
     * Whether the Route uses WebSocket communication.
     * @return True if WebSocket is used.
     */
    get isWebSocket(): boolean {
        return this.#isWebSocket;
    }

    /**
     * Routeのゲッター兼セッター。
     * Getter and Setter for Route.
     * @param event An associative array that stores the respective processes with onopen, onclose, and onmessage as keys.
     * @returns Route object.
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
    WebSocket(event?: WebSocketEvent): Route {
        this.#isWebSocket = true;
        if(event?.onopen) this.onopen = event.onopen;
        if(event?.onclose) this.onclose = event.onclose;
        if(event?.onmessage) this.onmessage = event.onmessage;
        if(event?.onerror) this.onerror = event.onerror;
        return this;
    }

    /**
     * クライアントとの通信開始時に実行される関数のセッター兼ゲッター。
     * Setter and getter of the function to be executed when communication with the client starts.
     * @param process function (request: SystemRequest, client: WebSocketClient)
     * @return Function or Route.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onopen((req: SystemRequest, client: WebSocketClient) => {
     *      // process
     *  });
     * ```
     */
    OPEN(): WebSocketHandlerFunction;
    OPEN(process: WebSocketHandlerFunction): Route;
    OPEN(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | Route {
        if(process) {
            this.#isWebSocket = true;
            this.onopen = process;
            return this;
        }
        return this.onopen;
    }

    /**
     * クライアントとの接続が切れたときに実行される関数のセッター兼ゲッター。
     * Setter and getter for the function to be executed when the connection to the client is lost.
     * @param process function (request: SystemRequest, client: WebSocketClient)
     * @return Function or Route.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onclose((req: SystemRequest, client: WebSocketClient) => {
     *      // process
     *  });
     * ```
     */
    CLOSE(): WebSocketHandlerFunction;
    CLOSE(process: WebSocketHandlerFunction): Route;
    CLOSE(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | Route {
        if(process) {
            this.#isWebSocket = true;
            this.onclose = process;
            return this;
        }
        return this.onclose;
    }

    /**
     * クライアントからメッセージが送られてきたときに実行される関数のゲッター兼セッター。
     * A getter and setter for a function that is executed when a message is sent from a client.
     * @param process function (request: SystemRequest, client: WebSocketClient, message: string)
     * @return Function or Route.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onmessage((req: SystemRequest, client: WebSocketClient, message: string) => {
     *      client.sendAll(message);
     *  });
     * ```
     */
    MESSAGE(): WebSocketHandlerFunction;
    MESSAGE(process: WebSocketHandlerFunction): Route;
    MESSAGE(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | Route {
        if(process) {
            this.#isWebSocket = true;
            this.onmessage = process;
            return this;
        }
        return this.onmessage;
    }

    ERROR(): WebSocketHandlerFunction;
    ERROR(process: WebSocketHandlerFunction): Route;
    ERROR(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | Route {
        if(process) {
            this.#isWebSocket = true;
            this.onerror = process;
            return this;
        }
        return this.onerror;
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
        let route: Route | undefined;
        for(let _route of Route.list) {
            if(_route.PATH() == path) {
                route = _route;
                break;
            }
        }
        if(route) return route;
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
     * Get a Route object containing the specified URL.
     * @param url URL to be used to identify the Route.
     * @param variables An object that stores the variables contained in a URL.
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
                let flag = true;
                if(true || registeredURL.includes(':')) {
                    for(let i in span) {
                        if(span[i][0] == ":") {
                            variables[span[i].slice(1)] = targets[i];
                            continue;
                        }
                        if(span[i] != targets[i]) {
                            flag = false;
                            break;
                        }
                    }
                } else if(registeredURL === url){
                    return Route.getRouteByPath(route.PATH());
                }

                if(flag) {
                    return Route.getRouteByPath(route.PATH());
                }
                
            }
        }
        return result;
    }

    delete() {
        Route.list = Route.list.filter(route=>route.PATH() !== this.PATH());
    }

}