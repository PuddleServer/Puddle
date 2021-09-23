/**
 * Response処理を行うクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-23
 */
import {
    System, RequestLog, SystemRequest, SystemResponse, Route, WebSocketRoute, WebSocketClient,
    acceptWebSocket, isWebSocketCloseEvent, WebSocket, acceptable, parseUrl
} from "./mod.ts"

/**
 * Routeの処理をメソッドごとに分けて実行する。
 * @param request リクエストオブジェクト。
 * @param route Routeオブジェクト。
 */
export function control(request: SystemRequest, route: Route): void {
    System.record(new RequestLog(
        route.PATH(),
        request.method,
        parseUrl(request.url).search?parseUrl(request.url).toString():parseUrl(request.url).path,
        request.headers.get("Forwarded") || (request.conn.remoteAddr as Deno.NetAddr).hostname
    ));
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
function controller(request: SystemRequest, process: Function) {
    process(request, new SystemResponse(request.request));
}

/**
 * WebSocket通信時のリクエスト時の処理を実行する。
 * @param request リクエストオブジェクト。
 * @param process 実行する処理。
 */
async function webSocketController(request: SystemRequest, wsRoute: WebSocketRoute) {
    if (acceptable(request)) {
        const webSocket: WebSocket = await acceptWebSocket({
            conn: request.conn,
            bufReader: request.request.r,
            bufWriter: request.request.w,
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