import { SystemRequest, SystemResponse, System, Route, WebSocketClient, errorHTML, version } from "../mod.ts";

/**
 * リダイレクト処理を行う関数。
 * Function to perform redirection processing.
 * @param url The URL to redirect to.
 * @returns Function.
 */
export function redirect(url: string): Function {
    return function(request: SystemRequest, response: SystemResponse): void {
        response.redirect(url);
    }
}

/**
 * ルートのPATHに示されたファイルを返す処理を行う関数。
 * A function that returns the file indicated in the PATH of Route.
 * @returns Function.
 */
export function default_get(): Function {
    return async function default_get(request: SystemRequest, response: SystemResponse): Promise<void> {
        const route: string | undefined = Route.getRouteByUrl(request.getURL().pathname)?.PATH();
        if(!route) return Route["404"].GET()(request, response);
        try {
            await response.setFile(route);
            console.log(`>> [${new Date().toLocaleString()}] Send the "${route}" file to the client.`);
        } catch {
            return Route["404"].GET()(request, response);
        }
    }
}

/**
 * エラーページを返す関数。
 * Function to return an error page.
 * @param status HTTP status.
 * @param description Error description.
 * @returns Function.
 */
export function default_error(status: number, description: string): Function {
    return async function (request: SystemRequest, response: SystemResponse): Promise<void> {
        response.preset({version, status, description});
        response.setText(errorHTML, status, description).setType('text/html');
    }
}

/**
 * WebSocketでクライアント通信を始めた時実行する関数。
 * Function to be executed when client communication is initiated via WebSocket.
 * @param request SystemRequest object.
 * @param client WebSocketClient object.
 */
export function default_onopen(request: SystemRequest, client: WebSocketClient): void {
    console.log(`>> WebSocket opened with "${request.url}". Connections ${client.getAllClients().length}`);
}

/**
 * WebSocketでクライアントからメッセージを受け取ったときに実行される関数です。
 * This function is executed when a message is received from the client via WebSocket.
 * @param request SystemRequest onject.
 * @param client WebSocketClient object.
 * @param message Message received.
 */
export function default_onmessage(request: SystemRequest, client: WebSocketClient, message: string): void {
    client.sendAll(message);
}