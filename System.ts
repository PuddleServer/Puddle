import {
    serve, serveTLS, Server, HTTPOptions, HTTPSOptions,
    SystemRequest, Route, control, ConfigReader, Logger, GoogleOAuth2
} from "./mod.ts"

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
     * サーバーを保持する変数。
     * Variable that holds the server.
     */
    static server: Server;

    /**
     * サーバーURLのorigin情報。
     * Origin information for the server URL
     *  `"https://www.example.com"`
     */
    static URI: string;

    /**
     * GoogleのOAuth2.0認証を利用する際に使用するクラスを格納する変数。
     * Variable that stores the class to be used when using Google's OAuth2.0 authentication.
     */
    static GoogleOAuth2: GoogleOAuth2;

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
     * @param pathOrRoute Key name of the Route, or RouteOption.
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
    static createRoute(pathOrRoute: string | RouteOption): Route {

        const route = (typeof pathOrRoute == "string")? new Route(pathOrRoute) : new Route(
            pathOrRoute.PATH,
            pathOrRoute.URL || [],
            pathOrRoute.GET || null,
            pathOrRoute.POST || null,
            pathOrRoute.PUT || null,
            pathOrRoute.DELETE || null,
            pathOrRoute.PATCH || null
        );

        return route;
    }

    /**
     * サーバーに新しく複数のルートを追加する。
     * Add multiple new routes to the server.
     * @param pathOrRoute Key name of the Route, or RouteOption.
     * @returns System class.
     * 
     * ```ts
     *  System.createRoutes("./assets/index.html", "./assets/about.html");
     * ```
     */
    static createRoutes(...pathsOrRoutes: (string | RouteOption)[]): System {

        for(let pathOrRoute of pathsOrRoutes) {
            if(typeof pathOrRoute == "string") System.createRoute(pathOrRoute);
            else new Route(
                pathOrRoute.PATH,
                pathOrRoute.URL || [],
                pathOrRoute.GET || null,
                pathOrRoute.POST || null,
                pathOrRoute.PUT || null,
                pathOrRoute.DELETE || null,
                pathOrRoute.PATCH || null
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
     * @param URL Pathname of the URL to login.
     * @param process Callback function to process user information associated with an email address.
     * @returns GoogleOAuth2 object.
     * 
     * ```ts
     *  System.GOOGLE_OAUTH2(`${client_id}`, `${client_secret}`).URL("/login", "/Login")
     *  .LOGIN((req: SystemRequest, res: SystemResponse, user_info: {[key:string]: string;}) => {
     *      // Register a user in the database.
     *      // Set a session information cookie in Header.
     *      res.redirect(`${URL}`);
     *  });
     * ```
     * 
     * ※ The redirect URL to set for the Google API is `"http(s)://(www.example.com)/google_oauth2_redirect"`.
     */
    static GOOGLE_OAUTH2(client_id: string, client_secret: string, URL?: string[], process?: Function): GoogleOAuth2 {
        System.GoogleOAuth2 = new GoogleOAuth2(client_id, client_secret, URL, process);
        return System.GoogleOAuth2;
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
        let logDirectoryPath: string = "./log";
        let server_uri: string | undefined = uri;
        
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            
            httpOptions.hostname = conf.HOSTNAME || conf.hostname || conf.SERVER.HOSTNAME || conf.SERVER.hostname || conf.server.HOSTNAME || conf.server.hostname;
            httpOptions.port = conf.PORT || conf.port || conf.SERVER.PORT || conf.SERVER.port || conf.server.PORT || conf.server.port;
            
            logDirectoryPath = conf.LOG || conf.log || conf.SERVER.LOG || conf.SERVER.log || conf.server.LOG || conf.server.log || "./log";
            server_uri = uri || conf.URI || conf.uri || conf.SERVER.URI || conf.SERVER.uri || conf.server.URI || conf.server.uri;
            
            if(startFunction) startFunction(conf);
        
        } else {
            if(typeof option === "number") {
                httpOptions.hostname = "localhost";
                httpOptions.port = option;
            }
            if(startFunction) startFunction(httpOptions);
        }
        
        System.URI = server_uri? new URL(server_uri).origin : `http://${httpOptions.hostname}:${httpOptions.port}`;
        
        if(System.GoogleOAuth2) System.GoogleOAuth2.setup();
        
        Logger.setDirectoryPath(logDirectoryPath);
        
        System.close();
        System.server = serve(httpOptions);
        for await (const request of System.server) {
            const systemRequest: SystemRequest = new SystemRequest(request);
            const route: Route = Route.getRouteByUrl(systemRequest.getURL().pathname) || Route["404"];
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
        let logDirectoryPath: string = "./log";
        let server_uri: string | undefined = uri;
        
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            
            httpsOptions.hostname = conf.HOSTNAME || conf.hostname || conf.SERVER.HOSTNAME || conf.SERVER.hostname || conf.server.HOSTNAME || conf.server.hostname;
            httpsOptions.port = conf.PORT || conf.port || conf.SERVER.PORT || conf.SERVER.port || conf.server.PORT || conf.server.port;
            httpsOptions.certFile = conf.CERTFILE || conf.certFile || conf.certfile || conf.SERVER.CERTFILE || conf.SERVER.certFile || conf.SERVER.certfile || conf.server.CERTFILE || conf.server.certFile || conf.server.certfile;
            httpsOptions.keyFile = conf.KEYFILE || conf.keyFile || conf.keyfile || conf.SERVER.KEYFILE || conf.SERVER.keyFile || conf.SERVER.keyfile || conf.server.KEYFILE || conf.server.keyFile || conf.server.keyfile;
            
            logDirectoryPath = conf.LOG || conf.log || conf.SERVER.LOG || conf.SERVER.log || conf.server.LOG || conf.server.log || "./log";
            server_uri = uri || conf.URI || conf.uri || conf.SERVER.URI || conf.SERVER.uri || conf.server.URI || conf.server.uri;
            
            if(startFunction) startFunction(conf);
        
        } else if(startFunction) {
            startFunction(httpsOptions);
        }
        
        System.URI = server_uri? new URL(server_uri).origin : `https://${httpsOptions.hostname}:${httpsOptions.port}`;
        
        if(System.GoogleOAuth2) System.GoogleOAuth2.setup();
        
        Logger.setDirectoryPath(logDirectoryPath);
        
        System.close();
        System.server = serveTLS(httpsOptions);
        
        for await (const request of System.server) {
            const systemRequest: SystemRequest = new SystemRequest(request);
            const route: Route = Route.getRouteByUrl(systemRequest.getURL().pathname) || Route["404"];
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