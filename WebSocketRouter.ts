import { WebSocket, default_onmessage, default_onopen }  from "./mod.ts"

/**
 * WebSocketRouteを初期化する際の引数として使用されるオブジェクト。
 * An object used as an argument when initializing a WebSocketRoute.
 */
export interface WebSocketEvent {
    onopen?: Function;
    onclose?: Function;
    onmessage?: Function;
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
    #onopen: Function;

    /**
     * クライアントとの接続が切れたときに実行される関数。
     * Function to be executed when the connection to the client is lost.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     */
    #onclose: Function;

    /**
     * クライアントからメッセージが送られてきたときに実行される関数。
     * A function that is executed when a message is sent from a client.
     * @param request SystemRequest.
     * @param client WebSocketClient.
     * @param message A message sent by the client.
     */
    #onmessage: Function;

    constructor(event?: WebSocketEvent) {
        this.#onopen = event?.onopen || default_onopen;
        this.#onclose = event?.onclose || function(){};
        this.#onmessage = event?.onmessage || default_onmessage;
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
    onopen(): Function;
    onopen(process: Function): WebSocketRoute;
    onopen(process?: Function): Function | WebSocketRoute {
        if(process) {
            this.#onopen = process;
            return this;
        }
        return this.#onopen;
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
    onclose(): Function;
    onclose(process: Function): WebSocketRoute;
    onclose(process?: Function): Function | WebSocketRoute {
        if(process) {
            this.#onclose = process;
            return this;
        }
        return this.#onclose;
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
    onmessage(): Function;
    onmessage(process: Function): WebSocketRoute;
    onmessage(process?: Function): Function | WebSocketRoute {
        if(process) {
            this.#onmessage = process;
            return this;
        }
        return this.#onmessage;
    }

}

/**
 * 接続された各クライアントの情報の保持とメッセージの送信を行うクラス。
 * Class that maintains information on each connected client and sends messages.
 */
export class WebSocketClient {

    /**
     * 最後に追加されたクライアントのID。
     * ID of the last client that was added.
     */
    static lastInsertedId = 0;

    /**
     * 接続されているクライアントを格納した連想配列。
     * An associative array containing the connected clients.
     * @key Client ID.
     * @value WebSocketClient.
     */
    static list: { [key: number]: WebSocketClient; } = {};

    /**
     * クライアントID。
     * Client ID.
     */
    #id: number;

    /**
     * 検索するときに使用されるタグを格納した配列。
     * An array containing the tags to be used when searching.
     */
    #tags: string[];

    /**
     * クライアントに持たせる属性を保持する変数。
     * A variable that holds attributes to be held by the client.
     */
    #attribute: Map<string, any>;
    
    /**
     * クライアントを保持するための変数。
     * A variable to hold the client.
     */
    #author: WebSocket;

    constructor(author: WebSocket, tags?: string[]) {
        this.#id = WebSocketClient.lastInsertedId++;
        this.#tags = tags || [];
        this.#attribute = new Map<string, any>();
        this.#author = author;
        WebSocketClient.list[this.#id] = this;
    }

    /**
     * クライアントIDのゲッター。
     * Getter of client ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * WebSocketオブジェクトのゲッター。
     * Getter of WebSocket object.
     */
    get author() {
        return this.#author;
    }

    /**
     * クライアントに紐づけられたタグのゲッター。
     * Getter for tags tied to clients.
     * @returns An array containing the tags to be used when searching.
     */
    getTags(): string[] {
        return this.#tags;
    }

    /** 
     * クライアントに紐づけられたタグのセッター。
     * Setter for tags tied to clients.
     * @param tags Tag name.
     * 
     * ```ts
     * client.setTags("A", "B", ...);
     * ```
     */
    setTags(...tags: string[]): void {
        this.#tags = tags;
    }

    /**
     * クライアントの属性のゲッター。
     * Getter of client attributes.
     * @param key Attribute name.
     * @returns Attribute value.
     */
    getAttribute(key: string): any {
        return this.#attribute.get(key);
    }

    /**
     * クライアントの属性のセッター。
     * Setter of client attributes.
     * @param key Attribute name.
     * @param value Attribute value.
     */
    setAttribute(key: string, value: any): Map<string, any> {
        return this.#attribute.set(key, value);
    }

    /**
     * クライアントIDでクライアントを取得する。
     * Get the client by client ID.
     * @param id Client ID.
     * @returns WebSocketClient
     */
    getClientById(id: number): WebSocketClient {
        return WebSocketClient.list[id];
    }

    /**
     * 接続されているすべてのクライアントを取得する。
     * Get all connected clients.
     * @returns Client array.
     */
    getAllClients(): WebSocketClient[] {
        return Object.values(WebSocketClient.list);
    }

    /** 
     * 指定したタグをすべて含むクライアントを取得する。
     * Retrieve a client that contains all of the specified tags.
     * @param tags Tag name.
     * @returns Client array.
     * 
     * ```ts
     * client.getClientsByTagName("Tag1", "Tag2", ...);
     * ```
     */
    getClientsByTagName(...tags: string[]): WebSocketClient[] {
        const allClients: WebSocketClient[] = Object.values(WebSocketClient.list);
        if(!tags.length) return allClients;
        return allClients.filter(client=>tags.every(el=>client.getTags().includes(el)));
    }

    /**
     * メッセージを送信する。もし第二引数を指定しない場合は自分自身にのみ送信する。
     * Send the message; If the second argument is not specified, it will be sent only to itself.
     * @param message Message to send.
     * @param clients The client array to send to.
     */
    send(message: string, clients?: WebSocketClient[]): void {
        if(!clients) clients = [this];
        clients.forEach(client=>client.author.send(message));
    }

    /**
     * メッセージを接続している全クライアントに送信する。第二引数にtrueを指定した場合は自分自身には送信しない。
     * Send the message to all connected clients; If true is specified for the second argument, it will not be sent to itself.
     * @param message Message to send.
     * @param isNotMyself Isn't to send to itself.
     */
    sendAll(message: string, isNotMyself?: boolean): void {
        const clients: WebSocketClient[] = (isNotMyself)? this.getAllClients().filter(client=>client.id!=this.#id) : this.getAllClients();
        clients.forEach(client=>client.send(message));
    }

}