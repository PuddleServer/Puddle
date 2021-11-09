import {
    walkSync,
    SystemRequest, SystemResponse, Route, HandlerFunction, control, ConfigReader, Logger, GoogleOAuth2, FileManager, PuddleJSON, RequestLog,
    getHandlerFunctions, loadRoutingFiles
} from "./mod.ts";

/** Initial backoff delay of 5ms following a temporary accept failure. */
const INITIAL_ACCEPT_BACKOFF_DELAY = 5;

/** Max backoff delay of 1s following a temporary accept failure. */
const MAX_ACCEPT_BACKOFF_DELAY = 1000;

/**
 * System.listenの第二引数のコールバック関数に使う引数の型。
 * The type of argument to use for the second argument callback function of "System.listen".
 */
export type Config = {[key:string]: any; };

/**
 * デコードされたURLを操作するためのクラス。
 * Class for manipulating decoded URLs.
 * 
 * ```ts
 *  new DecodedURL("https://www.example.com/abc?def");
 *  new DecodedURL("/abc?def", "https://www.example.com");
 * ```
 * The link shows how to use it.
 * https://developer.mozilla.org/ja/docs/Web/API/URL
 */
export class DecodedURL extends URL {
    hash = decodeURIComponent(super.hash);
    href = decodeURIComponent(super.href);
    password = decodeURIComponent(super.password);
    pathname = decodeURIComponent(super.pathname);
    search = decodeURIComponent(super.search);
    username = decodeURIComponent(super.username);
    valiable: {[key:string]:string;} = {}; // The variable name and its value included in the pathname of the URL.
    toString(): string {
        return decodeURIComponent(super.toString());
    }
}

/**
 * ルートクラスを初期化するためのパラメータ。
 * Parameter to initialize the Route class.
 */
export interface RouteOption {
    PATH: string;
    URL?: string[];
    GET?: HandlerFunction;
    POST?: HandlerFunction;
    PUT?: HandlerFunction;
    DELETE?: HandlerFunction;
    PATCH?: HandlerFunction;
}

export type AuthSetupFunction = {
    (): GoogleOAuth2;
    (client_id: string, client_secret: string, redirect_uri?: string, URL?: string[], process?: Function): GoogleOAuth2;
}
/**
 * 認証に使えるサービスを格納する型。
 * A type that stores services that can be used for authentication.
 */
type AuthType = { "GOOGLE": AuthSetupFunction };

/**
 * 実行クラス。
 * Execution class.
 * 
 *  ```ts
 *  System.createRoute("./assets/index.html").URL("/", "/Top");
 *  
 *  System.listen(8080, (conf: Conf) => {
 *      console.log(`The server running on http://${conf.hostname}:${conf.port}`);
 *  });
 * 
 * System.listenTLS(".env", (conf: Conf) => {
 *      console.log(`The server running on https://${conf.hostname}:${conf.port}`);
 *  }, "https://www.example.com");
 * ```
 */
export class System {

    /**
     * ファイルマネージャーのゲッター。
     * Getter of FileManager class.
     */
    static get fm(): typeof FileManager {
        return FileManager;
    }

    /**
     * PuddleJSONのゲッター。
     * Getter of PuddleJSON class.
     */
    static get JSON(): typeof PuddleJSON {
        return PuddleJSON;
    }

    /**
     * サーバーを保持する変数。
     * Variable that holds the server.
     */
    static server: Server;

    static controllers: { [key: string]: any; };

    /**
     * 開発者が追加したモジュールを保持する変数。
     * A variable that holds the modules added by the developer.
     */
    static modules: Map<string, any> = new Map();

    /**
     * 開発者が追加したモジュールのゲッター。
     * Getter for modules added by developers.
     * @param key Module name.
     */
    static getModule(key: string): any {
        return System.modules.get(key);
    }

    /**
     * 開発者が追加したモジュールのセッター。
     * Setter for modules added by developers.
     * @param key Module name.
     * @param module Module object.
     */
    static setModule(key: string, module: any): void {
        System.modules.set(key, module);
    }

    /**
     * 開発者が追加したモジュールのセッター。
     * Setters for modules added by developers.
     * @param modules An associative array of modules.
     */
    static setModules(modules: { [key: string]: any; }): void {
        for(let key in modules) {
            System.setModule(key, modules[key]);
        }
    }

    /**
     * 開発者が追加したモジュールを削除するメソッド。
     * Method to delete a module added by the developer.
     * @param key Module name.
     */
    static deleteModule(...key: string[]) {
        for(let k of key) {
            System.modules.delete(k);
        }
    }

    /**
     * サーバーに新しくルートを追加する。
     * Add a new route to the Server.
     * @param pathOrRouteOption Key name of the Route, or RouteOption.
     * @returns Route object created.
     * 
     * ```ts
     *  System.createRoute("./assets/index.html").URL("/", "/Top", "/top");
     * 
     *  System.createRoute({
     *      PATH: "about",
     *      URL: ["/About", "/about"],
     *      GET: async (req: SystemRequest, res: SystemResponse) => {
     *          await res.setFile("./assets/about.html");
     *          res.send();
     *      }
     *  });
     * ```
     */
    static createRoute(pathOrRouteOption: string | RouteOption): Route {

        const route = (typeof pathOrRouteOption == "string")? new Route(pathOrRouteOption) : new Route(
            pathOrRouteOption.PATH,
            pathOrRouteOption.URL || [],
            pathOrRouteOption.GET || null,
            pathOrRouteOption.POST || null,
            pathOrRouteOption.PUT || null,
            pathOrRouteOption.DELETE || null,
            pathOrRouteOption.PATCH || null
        );

        return route;
    }

    /**
     * サーバーに新しく複数のルートを追加する。
     * Add multiple new routes to the server.
     * @param pathsOrRouteOptions Key name of the Route, or RouteOption.
     * @returns System class.
     * 
     * ```ts
     *  System.createRoutes("./assets/index.html", "./assets/about.html");
     * 
     *  System.createRoutes("./assets/*");
     * ```
     */
    static createRoutes(...pathsOrRouteOptions: (string | RouteOption)[]): typeof System {

        for(let pathOrRouteOption of pathsOrRouteOptions) {
            if(typeof pathOrRouteOption == "string") {
                const fileName = pathOrRouteOption.split("/").pop();
                if(fileName?.includes(".")) {
                    System.createRoute(pathOrRouteOption);
                    continue;
                }
                for(const entry of walkSync(pathOrRouteOption.replace(/\*/g, ""))) {
                    const path = entry.path.replace(/\\/g, "/");
                    const fileName = path.split("/").pop();
                    if(path.includes("../") || !fileName?.includes(".")) continue;
                    System.createRoute(`./${path}`);
                }
            } else new Route(
                pathOrRouteOption.PATH,
                pathOrRouteOption.URL || [],
                pathOrRouteOption.GET || null,
                pathOrRouteOption.POST || null,
                pathOrRouteOption.PUT || null,
                pathOrRouteOption.DELETE || null,
                pathOrRouteOption.PATCH || null
            );
        }

        return System;
    }

    /**
     * 指定したルートを削除する。
     * Delete the Route.
     * @param path Path name of route.
     * 
     * ```ts
     *  System.deleteRoute("./assets/about.html");
     * ```
     */
    static deleteRoute(...path: string[]): void {
        System.deleteRoutes(path);
    }

    /**
     * 指定したルートを削除する。
     * Delete the Route.
     * @param path Path name array for the root.
     * 
     * ```ts
     *  System.deleteRoute(["./assets/about.html"]);
     * ```
     */
    static deleteRoutes(paths: string[]): void {
        Route.list = Route.list.filter(route=>!paths.includes(route.PATH()));
    }

    /**
     * 指定したルートを取得する。
     * Get the specified Route.
     * @param path Path name of the route.
     * @returns Route object. If not found, create it.
     */
    static Route(path: string): Route {
        return Route.getRouteByPath(path);
    }

    /**
     * Google OAuth2.0 を実装する。
     * Implement Google OAuth2.0.
     * @param client_id OAuth2.0 client_id.
     * @param client_secret OAuth2.0 client_secret.
     * @param redirect_uri OAuth2.0 redirect_url.
     * @param URL Pathname of the URL to login.
     * @param process Callback function to process user information associated with an email address.
     * @returns GoogleOAuth2 object.
     * 
     * ```ts
     *  System.AUTH.GOOGLE(`${client_id}`, `${client_secret}`).URL("/login", "/Login")
     *  .LOGIN((req: SystemRequest, res: SystemResponse, user_info: {[key:string]: string;}) => {
     *      // Register a user in the database.
     *      // Set a session information cookie in Header.
     *      res.redirect(`${URL}`);
     *  });
     * ```
     * 
     * ※ The redirect URL to set for the Google API is `"http(s)://(www.example.com)/auth_google"`.
     */
    static get AUTH(): AuthType {
        return {
            GOOGLE: GoogleOAuth2.setup
        }
    }

    /**
     * サーバーを起動する。
     * Start the server.
     * @param option Port number or config file path or HTTPOption.
     * @param startFunction Function to be executed when the server is started.
     * 
     * ```ts
     *  System.listen(8080);
     * 
     *  System.listen("./.env");
     * 
     *  System.listen("./config.json", (conf: Config) => {
     *      console.log(`The server running on http://${conf.hostname}:${conf.port}`);
     *  })
     * ```
     * 
     * ./.env
     * ```env
     *  SERVER.HOSTNAME=localhost
     *  SERVER.PORT=8080
     * ```
     * 
     * ./config.json
     * ```json
     *  {
     *      "SERVER": {
     *          "HOSTNAME": "localhost",
     *          "PORT":     8080
     *      }
     *  }
     * ```
     */
    static async listen(option: number | string | Deno.ListenOptions, startFunction?: Function): Promise<void> {
        const conf: Config = await listen(option, false);
        if(startFunction) startFunction(conf);
    }

    /**
     * TLSサーバーを起動する。
     * Start the TLS server.
     * @param option Config file path or HTTPsOption.
     * @param startFunction Function to be executed when the server is started.
     * 
     * ```ts
     *  System.listenTLS("./.env");
     * 
     *  System.listenTLS("./config.json", (conf: Config) => {
     *      console.log(`The server running on https://${conf.hostname}`);
     *  })
     * ```
     * 
     * ./.env
     * ```env
     *  SERVER.HOSTNAME=www.example.com
     *  SERVER.PORT=443
     *  SERVER.CERTFILE=/path/to/certFile.crt
     *  SERVER.KEYFILE=/path/to/keyFile.key
     * ```
     * 
     * ./config.json
     * ```json
     *  {
     *      "SERVER": {
     *          "HOSTNAME": "www.example.com",
     *          "PORT":     443,
     *          "CERTFILE": "/path/to/certFile.crt",
     *          "KEYFILE":  "/path/to/keyFile.key"
     *      }
     *  }
     * ```
     */
    static async listenTLS(option: string | Deno.ListenTlsOptions, startFunction?: Function): Promise<void> {
        const conf: Config = await listen(option, true);
        if(startFunction) startFunction(conf);
    }

    /**
     * サーバーを閉じる。
     * Close the server.
     */
    static close(): void {
        if(System.server) System.server.close();
    }

}

async function listen(option: number | string | Deno.ListenOptions | Deno.ListenTlsOptions, isTls: boolean): Promise<Config> {
        
    const options: Config = { hostname: "localhost", port: 8080 };

    let logDirectoryPath: string | undefined = undefined;
    let conf: Config;

    if(typeof option === "string") {
        conf = await ConfigReader.read(option);
        options.hostname = getValueByAllKeys(conf, "HostName") || getValueByAllKeys(conf, "Server", "HostName");
        options.port = getValueByAllKeys(conf, "Port") || getValueByAllKeys(conf, "Server", "Port") || 80;
        if(isTls) {
            options.certFile = getValueByAllKeys(conf, "certFile") || getValueByAllKeys(conf, "Server", "certFile");
            options.keyFile = getValueByAllKeys(conf, "keyFile") || getValueByAllKeys(conf, "Server", "keyFile");
        }

        const logDirectoryPath = getValueByAllKeys(conf, "Log") || getValueByAllKeys(conf, "Server", "Log") || undefined;
        if(logDirectoryPath) Logger.setDirectoryPath(logDirectoryPath);

        const controllersPath = getValueByAllKeys(conf, "Controller") || getValueByAllKeys(conf, "Server", "Controller") || undefined;
        if(controllersPath) System.controllers = await getHandlerFunctions(controllersPath);

        const routingPath = getValueByAllKeys(conf, "Routing") || getValueByAllKeys(conf, "Server", "Routing") || undefined;
        if(routingPath) await loadRoutingFiles(routingPath, System.controllers || {});
    
    } else if(typeof option === "number") {
            options.hostname = "localhost";
            options.port = option;
            conf = options;
    } else {
        conf = option;
    }
    
    System.close();

    options.transport = "tcp";

    const listener = isTls? Deno.listenTls(options as Deno.ListenTlsOptions) : Deno.listen(options as Deno.ListenOptions);
    System.server = new Server(listener, async function(requestEvent: Deno.RequestEvent, remoteAddr: Deno.NetAddr) {
        const variables: {[key:string]:string;} = {};
        let url;
        try {
            url = new DecodedURL(requestEvent.request.url);
        } catch {
            url = new DecodedURL("http://error");
        }
        const route: Route = Route.getRouteByUrl(url.pathname, variables) || Route["404"];
        new RequestLog(
            route.PATH(),
            requestEvent.request.method,
            decodeURIComponent(requestEvent.request.url),
            (requestEvent.request.headers.get("Forwarded")||"").replace("Forwarded: ", "")
            .split(/\,\s*/g).filter(param=>param.toLowerCase().includes("for"))
            .concat([remoteAddr.hostname]).join(" ").replace(/for\s*\=\s*/g, "")
        );
        await control(requestEvent, variables, route);
    });
    return conf;
}

class Server {
    #handler: Function;
    #closed = false;
    #listener: Deno.Listener;
    #httpConnections: Set<Deno.HttpConn> = new Set();

    constructor(listener: Deno.Listener, handler: Function) {
        this.#listener = listener;
        this.#handler = handler;
        this.serve();
    }

    async serve(): Promise<void> {
        if(this.#closed) {
            throw new Deno.errors.Http("Server closed");
        }

        try {
            return await this.#accept(this.#listener);
        } finally {
            try {
                this.#listener.close();
            } catch {
                // リスナーはすでに終了しています。
            }
        }
    }

    close(): void {
        if(this.#closed) {
            throw new Deno.errors.Http("Server closed");
        }

        this.#closed = true;
        this.#listener.close();

        for(const httpConn of this.#httpConnections) {
            this.#closeHttpConn(httpConn);
        }

        this.#httpConnections.clear();
    }

    get closed(): boolean {
        return this.#closed;
    }

    get addrs(): Deno.Addr {
        return this.#listener.addr;
    }

    async #respond(
        requestEvent: Deno.RequestEvent,
        httpConn: Deno.HttpConn,
        remoteAddr: Deno.NetAddr,
    ): Promise<void> {
        try {
            await this.#handler(requestEvent, remoteAddr);
        } catch {
            return this.#closeHttpConn(httpConn);
        }
    }

    async #serveHttp(
        httpConn: Deno.HttpConn,
        remoteAddr: Deno.NetAddr,
    ): Promise<void> {
        while (!this.#closed) {
            let requestEvent: Deno.RequestEvent | null;

            try {
                requestEvent = await httpConn.nextRequest();
            } catch {
                break;
            }

            if(requestEvent === null) {
                break;
            }

            this.#respond(requestEvent, httpConn, remoteAddr);
        }

        this.#closeHttpConn(httpConn);
    }

    async #accept(
        listener: Deno.Listener,
    ): Promise<void> {
        let acceptBackoffDelay: number | undefined;

        while (!this.#closed) {
            let conn: Deno.Conn;

            try {
                conn = await listener.accept();
            } catch (error) {
                if(
                    error instanceof Deno.errors.BadResource ||
                    error instanceof Deno.errors.InvalidData ||
                    error instanceof Deno.errors.UnexpectedEof ||
                    error instanceof Deno.errors.ConnectionReset ||
                    error instanceof Deno.errors.NotConnected
                ) {

                    if(!acceptBackoffDelay) {
                        acceptBackoffDelay = INITIAL_ACCEPT_BACKOFF_DELAY;
                    } else {
                        acceptBackoffDelay *= 2;
                    }

                    if(acceptBackoffDelay >= MAX_ACCEPT_BACKOFF_DELAY) {
                        acceptBackoffDelay = MAX_ACCEPT_BACKOFF_DELAY;
                    }

                    // delay
                    await new Promise(resolve=>setTimeout(resolve, acceptBackoffDelay));

                    continue;
                }

                throw error;
            }

            acceptBackoffDelay = undefined;

            let httpConn: Deno.HttpConn;

            try {
                httpConn = Deno.serveHttp(conn);
            } catch {
                continue;
            }

            this.#trackHttpConnection(httpConn);

            this.#serveHttp(httpConn, conn.remoteAddr as Deno.NetAddr);
        }
    }

    #closeHttpConn(httpConn: Deno.HttpConn): void {
        this.#untrackHttpConnection(httpConn);

        try {
            httpConn.close();
        } catch {
            // 接続はすでに終了しています。
        }
    }

    #trackHttpConnection(httpConn: Deno.HttpConn): void {
        this.#httpConnections.add(httpConn);
    }

    #untrackHttpConnection(httpConn: Deno.HttpConn): void {
        this.#httpConnections.delete(httpConn);
    }
}

/**
 * 様々な形式のキーからオブジェクトの値を取得する。
 * Get the value of an object from keys of various forms.
 * @param object target object
 * @param keys Keys of the object
 * @returns Object Value
 */
function getValueByAllKeys(object: Config, ...keys: string[]): any {
    const key = keys.shift();
    if(!(key && object)) return undefined;
    if(!keys.length) {
        return  object[key] || object[key.toUpperCase()] || object[key.toLowerCase()];
    }
    return  getValueByAllKeys(object[key], ...keys) || getValueByAllKeys(object[key.toUpperCase()], ...keys) || getValueByAllKeys(object[key.toLowerCase()], ...keys);
}