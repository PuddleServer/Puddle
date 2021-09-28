/**
 * 実行クラス
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-23
 */

import {
    serve, serveTLS, Server, HTTPOptions, HTTPSOptions,
    SystemRequest, Route, control, ConfigReader, Logger, Log, GoogleOAuth2
} from "./mod.ts"

export type Config = {[key:string]: any; };

/**
 * URLを扱いやすくするクラス。
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

export interface RouteOption {
    PATH: string;
    URL?: string[];
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
    PATCH?: Function;
}

export class System {

    /** サーバーを保持する変数 */
    static server: Server;

    static URI: string;

    static GoogleOAuth2: GoogleOAuth2;

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
     * サーバーへのリクエストを処理するルートを複数同時に作成する。
     * @param pathsOrRoutes アクセス先のパス、もしくはRouteオブジェクトの配列。
     * @returns Route配列
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

    static GOOGLE_OAUTH2(client_id: string, client_secret: string, URL?: string[], process?: Function): GoogleOAuth2 {
        System.GoogleOAuth2 = new GoogleOAuth2(client_id, client_secret, URL, process);
        return System.GoogleOAuth2;
    }

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
        }  else if(startFunction) startFunction(httpsOptions);
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

    static close(): void {
        if(System.server) System.server.close();
    }
}