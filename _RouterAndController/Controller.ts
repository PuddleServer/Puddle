import {
    SystemRequest, SystemResponse, HandlerFunction, Route, WebSocketRoute, WebSocketClient, authDigest
} from "../mod.ts";

/**
 * Routeの処理をリクエストメソッドに応じて実行する。
 * Route processing is executed according to the request method.
 * @param request SystemRequest object.
 * @param route Route object.
 */
export async function control(requestEvent: Deno.RequestEvent, variables: {[key:string]:string;}, route: Route) {
    if(route.AUTH()) await authDigest(requestEvent, route);
    switch (requestEvent.request.method) {
        case "GET":
            if(route.isWebSocket) await webSocketController(requestEvent, variables, route.WebSocket());
            else await controller(requestEvent, variables, route.GET());
            break;
        case "PUT":
            await controller(requestEvent, variables, route.PUT());
            break;
        case "POST":
            await controller(requestEvent, variables, route.POST());
            break;
        case "DELETE":
            await controller(requestEvent, variables, route.DELETE());
            break;
        case "PATCH":
            await controller(requestEvent, variables, route.PATCH());
            break;

        default:
            await controller(requestEvent, variables, Route["500"].GET());
            break;
    }
}

/**
 * リクエスト時の処理を実行する。
 * Execute the process at the time of the request.
 * @param respondWidth Function for response
 * @param process Function.
 */
async function controller(requestEvent: Deno.RequestEvent, variables: { [key: string]: string; }, process: HandlerFunction) {
    const request = new SystemRequest(requestEvent.request, variables);
    const response = new SystemResponse(requestEvent);
    const res = await process(request, response);
    if(res) await response.send(res);
    else await response.send();
}

/**
 * WebSocket通信時の処理を実行する。
 * Performs processing during WebSocket communication.
 * @param request SystemRequest object.
 * @param wsRoute WebSocketRoute object.
 */
async function webSocketController(requestEvent: Deno.RequestEvent, variables: { [key: string]: string; }, wsRoute: WebSocketRoute) {

    const { socket, response } = Deno.upgradeWebSocket(requestEvent.request);
    const client = new WebSocketClient(socket, requestEvent.request.url, variables);

    socket.onopen = (ev) => {
        wsRoute.onopen()(client, ev);
    };

    socket.onmessage = (ev) => {
        client.setMessage(ev.data);
        client.to([]);
        wsRoute.onmessage()(client, ev);
    };

    socket.onerror = (ev) => {
        client.setMessage("");
        client.to([]);
        wsRoute.onerror()(client, ev);
    };

    socket.onclose = (ev) => {
        client.setMessage("");
        client.to([]);
        wsRoute.onclose()(client, ev);
        delete WebSocketClient.list[client.id];
    };

    requestEvent.respondWith(response);

}