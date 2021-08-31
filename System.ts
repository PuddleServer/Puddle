/**
 * 実行クラス
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-27
 */

import { Server, ServerRequest, Response } from "deno.land / std@0.104.0 / http / server.ts"
import { getCookies, setCookie, deleteCookie } from "https://deno.land/std@0.104.0/http/cookie.ts"
import { 
    acceptWebSocket,
    isWebSocketCloseEvent,
    isWebSocketPingEvent,
    WebSocket,
} from "https://deno.land/std@0.104.0/ws/mod.ts"
import { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts"
import { Route, Routes } from "./Router.ts"


export class System {

    /** サーバーを保持する変数 */
    #server: Server;

    /** WebSocketの処理 */
    #wsHandler: Function;

    /** 起動構成を保持する変数 */
    //#startupConfig: StartupConfig;

    /** 開発者が追加したモジュールを保持する */
    #modules: any[];

    /** Routeオブジェクトの配列を保持する */
    #routes: Routes;

    constructor(...modules: any[]) {
        this.#modules = modules;
        this.#routes = [];
    }

    /**
     * サーバーへのリクエストを処理するルートを追加する。
     * @param pathOrRoute 文字列の場合はそれをPATHとしたRouteを作成し追加、Routeの場合はそのまま追加する。
     * @returns 作成したRouteオブジェクトを返す。
     */
    createRoute(pathOrRoute: string | Route): Route {

        const route = (typeof pathOrRoute == "string")? new Route(pathOrRoute) : pathOrRoute;

        this.#routes.put(route);

        return route;
    }

    /**
     * サーバーへのリクエストを処理するルートを複数同時に作成する。
     * @param pathsOrRoutes アクセス先のパス、もしくはRouteオブジェクトの配列。
     * @returns Routeオブジェクト。
     */
    createRoutes(...pathsOrRoutes: (string | Route)[]): Promise<{ [key: string]: Route; }> {

        const routeList: { [key: string]: Route; } = {};
        for(let pathOrRoute of pathsOrRoutes) {
            const route: Route = this.createRoute(pathOrRoute);
            if(route) routeList[route.PATH()] = route;
        }

        return new Promise((resolve) => resolve(routeList));
    }

    /**
     * 指定したpathが設定されたRouteオブジェクトを返す。
     * @param path RouteオブジェクトのPATH
     * @returns 指定されたRouteオブジェクト。
     */
    Route(path: Route): Route | undefined {

        const route: Route[] = this.#routes.filter( (route: Route) => route.PATH() == path );

        return ( !route.length )? undefined : route;
    }

    //async listen(wsHandler: Function): Promise<StartupConfig>

    //async close(): void
}