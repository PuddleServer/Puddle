/**
 * WebSocket通信周りのプログラム。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-16
 */
import { WebSocket, default_onmessage, default_onopen }  from "./mod.ts"

/**
 * WebSocket通信のハンドリングを行うクラス
 */
export class WebSocketRoute {

    /** クライアントとの通信開始時に呼ばれる処理 */
    #onopen: Function;

    /** クライアントとの通信終了時に呼ばれる処理 */
    #onclose: Function;

    /** クライアントからメッセージを受け付けた時に呼ばれる処理 */
    #onmessage: Function;

    constructor(event?: { [key:string]: Function; }) {
        this.#onopen = event?.onopen || default_onopen;
        this.#onclose = event?.onclose || function(){};
        this.#onmessage = event?.onmessage || default_onmessage;
    }

    /**
     * onopen処理の設定と取得を行う
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
     * onclose処理の設定と取得を行う
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
     * onmessage処理の設定と取得を行う
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
 * WebSocketのクライアントとの通信を簡単にするためのクラス。
 */
export class WebSocketClient {

    static lastInsertedId = 0;

    static list: { [key: number]: WebSocketClient; } = [];

    #id: number;

    #tags: string[];

    #attribute: Map<string, any>;
    
    #author: WebSocket;

    constructor(author: WebSocket, tags?: string[]) {
        this.#id = WebSocketClient.lastInsertedId++;
        this.#tags = tags || [];
        this.#attribute = new Map<string, any>();
        this.#author = author;
        WebSocketClient.list[this.#id] = this;;
    }

    /** クライアントIDのゲッター */
    get id() {
        return this.#id;
    }

    /** クライアントと接続しているWebSocketのゲッター */
    get author() {
        return this.#author;
    }

    /** クライアントと紐づけられたタグのゲッター */
    getTags(): string[] {
        return this.#tags;
    }

    /** クライアントと紐づけられたタグのセッター */
    setTags(...tags: string[]): void {
        this.#tags = tags;
    }

    /** 属性の取得 */
    getAttribute(key: string): any {
        return this.#attribute.get(key);
    }

    /** 属性の設定 */
    setAttribute(key: string, value: any): Map<string, any> {
        return this.#attribute.set(key, value);
    }

    /**
     * WebSocketClientのゲッター
     * @param id クライアントID
     * @returns WebSocketClient
     */
    getMemberById(id: number): WebSocketClient {
        return WebSocketClient.list[id];
    }

    /**
     * WebSocketClientのゲッター
     * @returns 全てのクライアント
     */
    getAllMembers(): WebSocketClient[] {
        return Object.values(WebSocketClient.list);
    }

    /** 
     * WebSocketClientのゲッター
     * @param tags 指定したすべてのタグを持っているWebSocketClientを返す
     * @returns WebSocketClient配列
     */
    getMembersByTagName(...tags: string[]): WebSocketClient[] {
        const allMembers: WebSocketClient[] = Object.values(WebSocketClient.list);
        if(!tags.length) return allMembers;
        return allMembers.filter(member=>tags.every(el=>member.getTags().includes(el)));
    }

    /**
     * メッセージを自分に送信する。
     * @param message 送信するテキスト
     * @param members 指定した場合は配列に含まれるクライアントに送信する。
     */
    send(message: string, members?: WebSocketClient[]): void {
        if(!members) members = this.#author;
        members.forEach(member=>member.author.send(message));
    }

    /**
     * メッセージを全員に送信する。
     * @param message 送信するテキスト
     * @param isNotMyself 自分自身を含むかどうか
     */
    sendAll(message: string, isNotMyself?: boolean): void {
        const members: WebSocketClient[] = (isNotMyself)? this.getAllMembers().filter(client=>client.id!=this.#id) : this.getAllMembers();
        members.forEach(member=>member.send(message));
    }

}