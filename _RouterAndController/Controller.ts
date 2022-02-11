import {
    SystemRequest, SystemResponse, HandlerFunction, Route, WebSocketRoute, WebSocketClient, authDigest
} from "../mod.ts";

/**
 * Routeの処理をリクエストメソッドに応じて実行する。
 * Route processing is executed according to the request method.
 * @param request SystemRequest object.
 * @param route Route object.
 */
export async function control(request: Request, variables: {[key:string]:string;}, route: Route): Promise<Response> {
    if(route.AUTH()) {
        const res = await authDigest(request, route);
        if(res) return res;
    }
    switch (request.method) {
        case "GET":
            if(route.isWebSocket) return await webSocketController(request, variables, route.WebSocket());
            else return await controller(request, variables, route.GET());

        case "PUT":
            return await controller(request, variables, route.PUT());

        case "POST":
            return await controller(request, variables, route.POST());

        case "DELETE":
            return await controller(request, variables, route.DELETE());

        case "PATCH":
            return await controller(request, variables, route.PATCH());

        default:
            return await controller(request, variables, Route["500"].GET());
    }
}

/**
 * リクエスト時の処理を実行する。
 * Execute the process at the time of the request.
 * @param respondWidth Function for response
 * @param process Function.
 */
async function controller(request: Request, variables: { [key: string]: string; }, process: HandlerFunction): Promise<Response> {
    const sRequest = new SystemRequest(request, variables);
    const sResponse = new SystemResponse(request);

    const res = await process(sRequest, sResponse);
    if(res) await sResponse.send(res);
    else await sResponse.send();
    
    return sResponse.response;
}

/**
 * WebSocket通信時の処理を実行する。
 * Performs processing during WebSocket communication.
 * @param request SystemRequest object.
 * @param wsRoute WebSocketRoute object.
 */
async function webSocketController(request: Request, variables: { [key: string]: string; }, wsRoute: WebSocketRoute): Promise<Response> {

    const { socket, response } = Deno.upgradeWebSocket(request);
    const client = new WebSocketClient(socket, request.url, variables);

    socket.onopen = (ev) => {
        wsRoute.OPEN()(client, ev);
    };

    socket.onmessage = (ev) => {
        client.setMessage(ev.data);
        client.to([]);
        wsRoute.MESSAGE()(client, ev);
    };

    socket.onerror = (ev) => {
        client.setMessage("");
        client.to([]);
        wsRoute.ERROR()(client, ev);
    };

    socket.onclose = (ev) => {
        client.setMessage("");
        client.to([]);
        wsRoute.CLOSE()(client, ev);
        delete WebSocketClient.list[client.id];
    };

    return response;

}