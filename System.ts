/**
 * 実行クラス
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-17
 */

import {
    serve, serveTLS, Server, HTTPOptions, HTTPSOptions,
    Route, control, ConfigReader,
} from "./mod.ts"

export type Config = {[key:string]: any; };

/**
 * URLを扱いやすくするクラス。
 */
export class URL {
    #url: [string, string|undefined];

    constructor(url: string) {
        url = decodeURIComponent(url);
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

    static url: URL;

    static getUrl(): URL {
        return System.url;
    }

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
     * @returns Route配列
     */
    static createRoutes(...pathsOrRoutes: (string | RouteOption)[]): Route[] {

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

        return Route.list;
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

    static async listen(option: number | string | HTTPOptions, startFunction?: Function): Promise<void> {
        const httpOptions: HTTPOptions = {hostname: "localhost", port: 8080};
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            httpOptions.hostname = conf.HOSTNAME || conf.hostname || conf.SERVER.HOSTNAME || conf.SERVER.hostname || conf.server.HOSTNAME || conf.server.hostname;
            httpOptions.port = conf.PORT || conf.port || conf.SERVER.PORT || conf.SERVER.port || conf.server.PORT || conf.server.port;
            if(startFunction) startFunction(conf);
        } else if(typeof option === "number") {
            httpOptions.hostname = "localhost";
            httpOptions.port = option;
            if(startFunction) startFunction(httpOptions);
        } else if(startFunction) startFunction(httpOptions);
        System.close();
        System.server = serve(httpOptions);
        for await (const request of System.server) {
            System.url = parseUrl(request.url);
            const route: Route = Route.getRouteByUrl(System.url.path) || Route["404"];
            control(request, route);
        }
    }

    static async listenTLS(option: string | HTTPSOptions, startFunction?: Function): Promise<void> {
        const httpsOptions: HTTPSOptions = {hostname: "localhost", port: 8080, certFile: "", keyFile: ""};
        if (typeof option === "string") {
            const conf: Config = await ConfigReader.read(option);
            httpsOptions.hostname = conf.HOSTNAME || conf.hostname || conf.SERVER.HOSTNAME || conf.SERVER.hostname || conf.server.HOSTNAME || conf.server.hostname;
            httpsOptions.port = conf.PORT || conf.port || conf.SERVER.PORT || conf.SERVER.port || conf.server.PORT || conf.server.port;
            httpsOptions.certFile = conf.CERTFILE || conf.certFile || conf.certfile || conf.SERVER.CERTFILE || conf.SERVER.certFile || conf.SERVER.certfile || conf.server.CERTFILE || conf.server.certFile || conf.server.certfile;
            httpsOptions.keyFile = conf.KEYFILE || conf.keyFile || conf.keyfile || conf.SERVER.KEYFILE || conf.SERVER.keyFile || conf.SERVER.keyfile || conf.server.KEYFILE || conf.server.keyFile || conf.server.keyfile;
            if(startFunction) startFunction(conf);
        }  else if(startFunction) startFunction(httpsOptions);
        System.close();
        System.server = serveTLS(httpsOptions);
        for await (const request of System.server) {
            request.url = decodeURIComponent(request.url);
            const route: Route = Route.getRouteByUrl(parseUrl(request.url).path) || Route["404"];
            control(request, route);
        }
    }

    static close(): void {
        if(System.server) System.server.close();
    }
}