import {
    serve, serveTLS, Server, HTTPOptions, HTTPSOptions, walkSync,
    SystemRequest, Route, control, ConfigReader, Logger, GoogleOAuth2, FileManager, PuddleJSON
} from "./mod.ts";

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
    toString() {
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
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
    PATCH?: Function;
}

/**
 * 認証に使えるサービスを格納する型。
 * A type that stores services that can be used for authentication.
 */
type authType = { "GOOGLE": Function; };

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
    static get fm() {
        return FileManager;
    }

    /**
     * PuddleJSONのゲッター。
     * Getter of PuddleJSON class.
     */
    static get JSON() {
        return PuddleJSON;
    }

    /**
     * サーバーを保持する変数。
     * Variable that holds the server.
     */
    static server: Server;

    /**
     * サーバーURLのorigin情報。
     * Origin information for the server URL
     *  `"https://www.example.com"`
     */
    static baseURL: string;

    /**
     * 開発者が追加したモジュールを保持する変数。
     * A variable that holds the modules added by the developer.
     */
    static modules: { [key: string]: any; } = {};

    /**
     * 開発者が追加したモジュールのゲッター。
     * Getter for modules added by developers.
     * @param key Module name.
     */
    static getModule(key: string): any {
        return System.modules[key];
    }

    /**
     * 開発者が追加したモジュールのセッター。
     * Setter for modules added by developers.
     * @param key Module name.
     * @param module Module object.
     */
    static setModule(key: string, module: any): void {
        System.modules[key] = module;
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
            delete System.modules[k];
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
     * ```
     */
    static createRoutes(...pathsOrRouteOptions: (string | RouteOption)[]): System {

        for(let pathOrRouteOption of pathsOrRouteOptions) {
            if(typeof pathOrRouteOption == "string") {
                const fileName = pathOrRouteOption.split("/").pop();
                if(fileName?.includes(".")) {
                    System.createRoute(pathOrRouteOption);
                    continue;
                }
                for (const entry of walkSync(pathOrRouteOption.replace(/\*/g, ""))) {
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
    static get AUTH(): authType {
        return {
            GOOGLE: GoogleOAuth2.setup
        }
    }

    /**
     * サーバーを起動する。
     * Start the server.
     * @param option Port number or config file path or HTTPOption.
     * @param startFunction Function to be executed when the server is started.
     * @param uri The "URL origin" for the client to access. Example `"http://localhost:8080"`.
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
    static async listen(option: number | string | HTTPOptions, startFunction?: Function, uri?: string): Promise<void> {
        const httpOptions: HTTPOptions = {hostname: "localhost", port: 8080};
        let logDirectoryPath: string = "";
        let server_uri: string | undefined = uri;
        
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            httpOptions.hostname = getValueByAllKeys(conf, "HostName") || getValueByAllKeys(conf, "Server", "HostName");
            httpOptions.port = getValueByAllKeys(conf, "Port") || getValueByAllKeys(conf, "Server", "Port") || 80;

            logDirectoryPath = getValueByAllKeys(conf, "Log") || getValueByAllKeys(conf, "Server", "Log") || "./log";
            server_uri = uri || getValueByAllKeys(conf, "Uri") || getValueByAllKeys(conf, "Server", "Uri");
            if(startFunction) startFunction(conf);
        
        } else {
            if(typeof option === "number") {
                httpOptions.hostname = "localhost";
                httpOptions.port = option;
            }
            if(startFunction) startFunction(httpOptions);
        }
        
        System.baseURL = server_uri? new URL(server_uri).origin : `http://${httpOptions.hostname}:${httpOptions.port}`;
        
        System.AUTH.GOOGLE()?.setRedirectURL();

        Logger.setDirectoryPath(logDirectoryPath);
        
        System.close();
        System.server = serve(httpOptions);
        for await (const request of System.server) {
            const systemRequest: SystemRequest = new SystemRequest(request);
            const route: Route = Route.getRouteByUrl(systemRequest.getURL().pathname, systemRequest.variables) || Route["404"];
            control(systemRequest, route);
        }
    }

    /**
     * TLSサーバーを起動する。
     * Start the TLS server.
     * @param option Config file path or HTTPOption.
     * @param startFunction Function to be executed when the server is started.
     * @param uri The "URL origin" for the client to access. Example `"https://www.example.com"`.
     * 
     * ```ts
     *  System.listen("./.env");
     * 
     *  System.listen("./config.json", (conf: Config) => {
     *      console.log(`The server running on http://${conf.hostname}:${conf.port}`);
     *  })
     * ```
     * 
     * ./.env
     * ```env
     *  SERVER.URI=https://www.example.com
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
     *          "URI":      "https://www.example.com",
     *          "HOSTNAME": "www.example.com",
     *          "PORT":     443,
     *          "CERTFILE": "/path/to/certFile.crt",
     *          "KEYFILE":  "/path/to/keyFile.key"
     *      }
     *  }
     * ```
     */
    static async listenTLS(option: string | HTTPSOptions, startFunction?: Function, uri?: string): Promise<void> {
        const httpsOptions: HTTPSOptions = {hostname: "localhost", port: 8080, certFile: "", keyFile: ""};
        let logDirectoryPath: string = "";
        let server_uri: string | undefined = uri;
        
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            
            httpsOptions.hostname = getValueByAllKeys(conf, "HostName") || getValueByAllKeys(conf, "Server", "HostName");
            httpsOptions.port = getValueByAllKeys(conf, "Port") || getValueByAllKeys(conf, "Server", "Port") || 443;
            httpsOptions.certFile = getValueByAllKeys(conf, "certFile") || getValueByAllKeys(conf, "Server", "certFile");
            httpsOptions.keyFile = getValueByAllKeys(conf, "keyFile") || getValueByAllKeys(conf, "Server", "keyFile");
            
            logDirectoryPath = getValueByAllKeys(conf, "Log") || getValueByAllKeys(conf, "Server", "Log") || "./log";
            server_uri = uri || getValueByAllKeys(conf, "Uri") || getValueByAllKeys(conf, "Server", "Uri");
            
            if(startFunction) startFunction(conf);
        
        } else if(startFunction) {
            startFunction(httpsOptions);
        }
        
        System.baseURL = server_uri? new URL(server_uri).origin : `https://${httpsOptions.hostname}:${httpsOptions.port}`;
        
        System.AUTH.GOOGLE()?.setRedirectURL();

        Logger.setDirectoryPath(logDirectoryPath);
        
        System.close();
        System.server = serveTLS(httpsOptions);
        
        for await (const request of System.server) {
            const systemRequest: SystemRequest = new SystemRequest(request);
            const route: Route = Route.getRouteByUrl(systemRequest.getURL().pathname, systemRequest.variables) || Route["404"];
            control(systemRequest, route);
        }
    }

    /**
     * サーバーを閉じる。
     * Close the server.
     */
    static close(): void {
        if(System.server) System.server.close();
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