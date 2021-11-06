import { DecodedURL, getCookies } from "../mod.ts";

/**
 * リクエストオブジェクトのアダプタークラス。
 * Adapter class for the request object.
 */
export class SystemRequest {

    /**
     * リクエストオブジェクトを格納する変数。
     * Variable that stores the request object.
     */
    #request: Request;

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
     * リクエストヘッダーを格納する変数。
     * Variable that stores the request header.
     */
    #headers: Headers;

    /**
     * ボディー情報を格納する変数。
     * Variable that stores the body information.
     */
    #body: ReadableStream<Uint8Array> | null;

    /**
     * URLのpathnameに含まれる変数の名前とその値
     * The variable name and its value included in the pathname of the URL.
     */
    variables: { [key: string]: string; };

    constructor(request: Request, variables: {[key:string]:string;}) {
        this.#request = request;
        this.#url = request.url.replace(/\/+/g, "/");
        this.#method = request.method;
        this.#headers = request.headers;
        this.#body = request.body;
        this.variables = variables;
    }

    /**
     * 変換前のリクエストオブジェクトのゲッター。
     * Getter for the request object before conversion.
     */
    get request(): Request {
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
            const url = new DecodedURL(this.#url);
            url.valiable = this.variables;
            return url;
        } catch {
            return new DecodedURL("http://error");
        }
    }

    /**
     * クッキーのゲッター。
     * Cookie Getter
     * @returns Cookies.
     */
    getCookies(): Record<string, string> {
        return getCookies(this.#headers);
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
    get body(): ReadableStream<Uint8Array> | null {
        return this.#body;
    }

    /**
     * デコードされたボディ情報を取得する。
     * Get the decoded body information.
     * @param decodeURI Whether to perform decodeURIComponent. Default is true.
     * @returns Body information.
     */
    async readBody(decodeURI: boolean = true): Promise<string> {
        const result = await this.#body?.getReader().read();
        const decoder = new TextDecoder('utf-8');
        const body: string = decoder.decode(result?.value);
        if(decodeURI) return decodeURIComponent(body);
        return body;
    }

}