import {
    System, RequestLog, SystemRequest, SystemResponse, Response, Route, WebSocketRoute, WebSocketClient,
    acceptWebSocket, isWebSocketCloseEvent, WebSocket, acceptable, DecodedURL, authDigest
} from "../mod.ts";

/**
 * Routeの処理をリクエストメソッドに応じて実行する。
 * Route processing is executed according to the request method.
 * @param request SystemRequest object.
 * @param route Route object.
 */
export function control(request: SystemRequest, route: Route): void {
    new RequestLog(
        route.PATH(),
        request.method,
        new DecodedURL(request.url, System.URI).toString(),
        (request.headers.get("Forwarded")||"").replace("Forwarded: ", "")
        .split(/\,\s*/g).filter(param=>param.toLowerCase().includes("for"))
        .concat([(request.conn.remoteAddr as Deno.NetAddr).hostname]).join(" ").replace(/for\s*\=\s*/g, "")
    );
    if(route.AUTH()) authDigest(request, route);
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
        case "PATCH":
            controller(request, route.PATCH());
            break;

        default:
            controller(request, Route["502"].GET());
            break;
    }
}

/**
 * リクエスト時の処理を実行する。
 * Execute the process at the time of the request.
 * @param request SystemRequest object.
 * @param process Function.
 */
async function controller(request: SystemRequest, process: Function) {
    const response = new SystemResponse(request.request);
    const res: Response | undefined = await process(request, response);
    if(res) response.send(res);
    else response.send();
}

/**
 * WebSocket通信時の処理を実行する。
 * Performs processing during WebSocket communication.
 * @param request SystemRequest object.
 * @param wsRoute WebSocketRoute object.
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