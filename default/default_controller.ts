import { SystemRequest, SystemResponse, HandlerFunction, lookup, System, Route, WebSocketClient, errorHTML } from "../mod.ts";

/**
 * リダイレクト処理を行う関数。
 * Function to perform redirection processing.
 * @param url The URL to redirect to.
 * @returns Function.
 */
export function redirect(url: string): HandlerFunction {
    return function(request: SystemRequest, response: SystemResponse): void {
        response.redirect(url);
    }
}

/**
 * ルートのPATHに示されたファイルを返す処理を行う関数。
 * A function that returns the file indicated in the PATH of Route.
 * @returns Function.
 */
export function default_get(): HandlerFunction {
    return async function default_get(request: SystemRequest, response: SystemResponse): Promise<void> {
        const filePath: string | undefined = Route.getRouteByUrl(request.getURL().pathname)?.PATH();
        if(!filePath) {
            Route["404"].GET()(request, response);
            return;
        }
        try {
            let file_data: string | ReadableStream<Uint8Array> | Uint8Array = "";
            const extensions: false | string = lookup(filePath);
            try { // After version 1.16.0
                let readableStream: ReadableStream<Uint8Array> | null;
                if(filePath.match(/^\.\/|^\//)) {
                    const mainModule = Deno.mainModule.split("/").slice(0, -1).join("/");
                    readableStream = (await fetch(`${mainModule}/${filePath.replace(/^\.\/|^\//, "")}`)).body;
                } else {
                    readableStream = (await fetch(filePath)).body;
                }
                if(readableStream) {
                    if(extensions && extensions.split("/")[0] === "text") {
                        file_data = await Deno.readFile(filePath);
                        file_data = new TextDecoder('utf-8').decode(file_data);
                    } else {
                        file_data = readableStream;
                    }
                }
            } catch { // Before version 1.16.0
                file_data = await Deno.readFile(filePath);
                if(extensions && extensions.split("/")[0] === "text") {
                    file_data = new TextDecoder('utf-8').decode(file_data);
                }
            }
            response.setText(file_data, 200, filePath);
            if(extensions) response.setType(extensions);
            console.log(`>> [${new Date().toLocaleString()}] Send the "${filePath}" file to the client.`);
        } catch (e) {
            Route["404"].GET()(request, response);
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
export function default_error(status: number, description: string): HandlerFunction {
    return async function (request: SystemRequest, response: SystemResponse) {
        response.preset({status, description});
        response.setText(errorHTML, status, description).setType('text/html');
    }
}

/**
 * WebSocketでクライアント通信を始めた時実行する関数。
 * Function to be executed when client communication is initiated via WebSocket.
 * @param request SystemRequest object.
 * @param client WebSocketClient object.
 */
export function default_onopen(client: WebSocketClient): void {
    console.log(`>> [${new Date().toLocaleString()}] WebSocket opened. Concurrent connections: ${client.concurrentConnections}`);
}

/**
 * WebSocketでクライアントからメッセージを受け取ったときに実行される関数です。
 * This function is executed when a message is received from the client via WebSocket.
 * @param request SystemRequest onject.
 * @param client WebSocketClient object.
 * @param message Message received.
 */
export function default_onmessage(client: WebSocketClient): void {
    client.sendAll(client.message || "");
}