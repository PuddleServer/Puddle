import { System, ServerRequest, DecodedURL, getCookies } from "../mod.ts";

/**
 * リクエストオブジェクトのアダプタークラス。
 * Adapter class for the request object.
 */
export class SystemRequest {

    /**
     * リクエストオブジェクトを格納する変数。
     * Variable that stores the request object.
     */
    #request: ServerRequest;

    /**
     * URLを格納する変数。
     * Variable that stores the URL.
     */
    #url: string;

    /**
     * メソッド名を格納する変数。
     * Variable that stores the method name.
     */
    #method: string;

    /**
     * コネクションを格納する変数。
     * Variable that stores the connection.
     */
    #conn: Deno.Conn;

    /**
     * リクエストヘッダーを格納する変数。
     * Variable that stores the request header.
     */
    #headers: Headers;

    /**
     * ボディー情報を格納する変数。
     * Variable that stores the body information.
     */
    #body: Deno.Reader;

    /**
     * URLのpathnameに含まれる変数の名前とその値
     * The variable name and its value included in the pathname of the URL.
     */
    variables: {[key:string]:string;} = {};

    constructor(request: ServerRequest) {
        this.#request = request;
        this.#url = request.url.replace(/\/+/g, "/");
        this.#method = request.method;
        this.#conn = request.conn;
        this.#headers = request.headers;
        this.#body = request.body;
    }

    /**
     * 変換前のリクエストオブジェクトのゲッター。
     * Getter for the request object before conversion.
     */
    get request(): ServerRequest {
        return this.#request;
    }

    /**
     * リクエストオブジェクトに格納されていたURLのゲッター。
     * Getter for the URL stored in the request object.
     */
    get url(): string {
        return this.#url;
    }

    /**
     * デコード済みのURLオブジェクトを取得する。
     * Get the decoded URL object.
     * @returns Decoded URL object.
     */
    getURL(): DecodedURL {
        try {
            const url = new DecodedURL(this.#url ,System.baseURL);
            url.valiable = this.variables;
            return url;
        } catch {
            console.log(new DecodedURL("404" ,System.baseURL))
            return new DecodedURL("404" ,System.baseURL);
        }
    }

    /**
     * クッキーのゲッター。
     * Cookie Getter
     * @returns Cookies.
     */
    getCookies(): Record<string, string> {
        return getCookies(this.#request);
    }

    /**
     * クッキーのゲッター。
     * Cookie Getter
     * @param key Cookie name.
     * @returns Cookie value.
     */
    getCookie(key: string): string | undefined {
        return this.getCookies()[key];
    }

    /**
     * メソッド名のゲッター。
     * Getter for method name.
     */
    get method(): string {
        return this.#method;
    }

    /**
     * コネクションのゲッター。
     * Connection getter.
     */
    get conn(): Deno.Conn {
        return this.#conn;
    }

    /**
     * リクエストヘッダーのゲッター。
     * Getter for the request header.
     */
    get headers(): Headers {
        return this.#headers;
    }

    /**
     * ボディー情報のゲッター。
     * Getter of body information.
     */
    get body(): Deno.Reader {
        return this.#body;
    }

    /**
     * デコードされたボディ情報を取得する。
     * Get the decoded body information.
     * @param decodeURI Whether to perform decodeURIComponent. Default is true.
     * @returns Body information.
     */
    async readBody(decodeURI: boolean = true): Promise<string> {
        const decoder = new TextDecoder('utf-8');
        const body: string = decoder.decode(await Deno.readAll(this.#body));
        if(decodeURI) return decodeURIComponent(body);
        return body;
    }

}