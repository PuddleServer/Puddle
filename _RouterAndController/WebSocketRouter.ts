import { WebSocketClient, default_onmessage, default_onopen }  from "../mod.ts";

export type WebSocketHandlerFunction = {
    (client: WebSocketClient, ev?: Event | MessageEvent<any> | ErrorEvent | CloseEvent): void;
}

/**
 * WebSocketRouteを初期化する際の引数として使用されるオブジェクト。
 * An object used as an argument when initializing a WebSocketRoute.
 */
export interface WebSocketEvent {
    onopen?: WebSocketHandlerFunction;
    onclose?: WebSocketHandlerFunction;
    onmessage?: WebSocketHandlerFunction;
    onerror?: WebSocketHandlerFunction;
}

/**
 * WebSocket通信時のイベントの処理を設定、取得するためのクラス。
 * Class for setting and retrieving event handling during WebSocket communication.
 */
export class WebSocketRoute {

    /**
     * クライアントとの通信開始時に実行される関数。
     * Function executed at the start of communication with the client.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     */
    onopen: WebSocketHandlerFunction;

    /**
     * クライアントとの接続が切れたときに実行される関数。
     * Function to be executed when the connection to the client is lost.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     */
    onclose: WebSocketHandlerFunction;

    /**
     * クライアントからメッセージが送られてきたときに実行される関数。
     * A function that is executed when a message is sent from a client.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     * @param message A message sent by the client.
     */
    onmessage: WebSocketHandlerFunction;

    onerror: WebSocketHandlerFunction;

    constructor(event?: WebSocketEvent) {
        this.onopen = event?.onopen || default_onopen;
        this.onclose = event?.onclose || function(){};
        this.onmessage = event?.onmessage || default_onmessage;
        this.onerror = event?.onerror || function(){};
    }

    /**
     * クライアントとの通信開始時に実行される関数のセッター兼ゲッター。
     * Setter and getter of the function to be executed when communication with the client starts.
     * @param process function (request: SystemRequest, client: WebSocketClient)
     * @return Function or WebSocketRoute.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onopen((req: SystemRequest, client: WebSocketClient) => {
     *      // process
     *  });
     * ```
     */
    OPEN(): WebSocketHandlerFunction;
    OPEN(process: WebSocketHandlerFunction): WebSocketRoute;
    OPEN(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | WebSocketRoute {
        if(process) {
            this.onopen = process;
            return this;
        }
        return this.onopen;
    }

    /**
     * クライアントとの接続が切れたときに実行される関数のセッター兼ゲッター。
     * Setter and getter for the function to be executed when the connection to the client is lost.
     * @param process function (request: SystemRequest, client: WebSocketClient)
     * @return Function or WebSocketRoute.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onclose((req: SystemRequest, client: WebSocketClient) => {
     *      // process
     *  });
     * ```
     */
    CLOSE(): WebSocketHandlerFunction;
    CLOSE(process: WebSocketHandlerFunction): WebSocketRoute;
    CLOSE(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | WebSocketRoute {
        if(process) {
            this.onclose = process;
            return this;
        }
        return this.onclose;
    }

    /**
     * クライアントからメッセージが送られてきたときに実行される関数のゲッター兼セッター。
     * A getter and setter for a function that is executed when a message is sent from a client.
     * @param process function (request: SystemRequest, client: WebSocketClient, message: string)
     * @return Function or WebSocketRoute.
     * 
     * ```ts
     * System.createRoute("./ws").WebSocket()
     *  .onmessage((req: SystemRequest, client: WebSocketClient, message: string) => {
     *      client.sendAll(message);
     *  });
     * ```
     */
    MESSAGE(): WebSocketHandlerFunction;
    MESSAGE(process: WebSocketHandlerFunction): WebSocketRoute;
    MESSAGE(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | WebSocketRoute {
        if(process) {
            this.onmessage = process;
            return this;
        }
        return this.onmessage;
    }

    ERROR(): WebSocketHandlerFunction;
    ERROR(process: WebSocketHandlerFunction): WebSocketRoute;
    ERROR(process?: WebSocketHandlerFunction): WebSocketHandlerFunction | WebSocketRoute {
        if(process) {
            this.onerror = process;
            return this;
        }
        return this.onerror;
    }
}
