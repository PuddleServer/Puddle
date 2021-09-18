/**
 * Response処理を行うクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-09
 */
import {
    ServerRequest, SystemResponse, Route, WebSocketRoute, WebSocketClient,
    acceptWebSocket, isWebSocketCloseEvent, WebSocket, acceptable
} from "./mod.ts"

/**
 * Routeの処理をメソッドごとに分けて実行する。
 * @param request リクエストオブジェクト。
 * @param route Routeオブジェクト。
 */
export function control(request: ServerRequest, route: Route): void {
    switch (request.method) {
        case "GET":
            if(route.isWebSocket) webSocketController(request, route.WebSocket());
            else controller(request, route.GET());
            break;
        case "PUT":
            controller(request, route.PUT());
            break;
        case "POST":
            controller(request, route.POST());
            break;
        case "DELETE":
            controller(request, route.DELETE());
            break;

        default:
            controller(request, Route["502"].GET());
            break;
    }
}

/**
 * 通常のリクエスト時の処理を実行する。
 * @param request リクエストオブジェクト。
 * @param process 実行する処理。
 */
function controller(request: ServerRequest, process: Function) {
    process(request, new SystemResponse(request));
}

/**
 * WebSocket通信時のリクエスト時の処理を実行する。
 * @param request リクエストオブジェクト。
 * @param process 実行する処理。
 */
async function webSocketController(request: ServerRequest, wsRoute: WebSocketRoute) {
    if (acceptable(request)) {
        const webSocket: WebSocket = await acceptWebSocket({
            conn: request.conn,
            bufReader: request.r,
            bufWriter: request.w,
            headers: request.headers,
        });
        const client: WebSocketClient = new WebSocketClient(webSocket);
        wsRoute.onopen()(request, client);
        for await (const message of webSocket) {
            if (typeof message === "string") {
                wsRoute.onmessage()(request, client, message);
            } else if (isWebSocketCloseEvent(message)) {
                wsRoute.onclose()(request, client);
                delete WebSocketClient.list[client.id];
                break;
            }
        }
    
    }
}