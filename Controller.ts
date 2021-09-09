/**
 * Response処理を行うクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-09
 */
import {
    System, ServerRequest, SystemResponse, Route,
    acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent, WebSocket, acceptable
} from "./mod.ts"

/**
 * Routeの処理をメソッドごとに分けて実行する。
 * @param request リクエストオブジェクト。
 * @param route Routeオブジェクト。
 */
export function control(request: ServerRequest, route: Route): void {
    switch (request.method) {
        case "GET":
            if(route.isWebSocket) webSocketController(request, route.GET);
            else controller(request, route.GET);
            break;
        case "PUT":
            controller(request, route.PUT);
            break;
        case "POST":
            controller(request, route.POST);
            break;
        case "DELETE":
            controller(request, route.DELETE);
            break;

        default:
            break;
    }
}

/**
 * 通常のリクエスト時の処理を実行する。
 * @param request リクエストオブジェクト。
 * @param process 実行する処理。
 */
function controller(request: ServerRequest, process: Function) {
    process(request, new SystemResponse(request), System.modules);
}

/**
 * WebSocket通信時のリクエスト時の処理を実行する。
 * @param request リクエストオブジェクト。
 * @param process 実行する処理。
 */
async function webSocketController(request: ServerRequest, process: Function) {
    if (acceptable(request)) {
        const webSocket: WebSocket = await acceptWebSocket({
            conn: request.conn,
            bufReader: request.r,
            bufWriter: request.w,
            headers: request.headers,
        });
        process(webSocket, System.modules);
    }
}