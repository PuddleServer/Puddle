import {
    ServerRequest, Response,
    Cookie, setCookie,
    lookup,
    htmlCompile
} from "../mod.ts";

/**
 * クライアントへのレスポンス機能を拡張するクラス。
 * Class that extends the response functionality to the client.
 */
export class SystemResponse {

    /**
     * リクエストオブジェクトを格納する変数。
     * Variable that stores the Request object.
     */
    #request: ServerRequest;

    /**
     * HTML内の変数に挿入するテキストを格納する連想配列。
     * An associative array that stores text to be inserted into variables in HTML.
     */
    #preset: { [key: string]: any; };

    /**
     * レスポンスオブジェクトを格納する変数。
     * Variable that stores the Response object.
     */
    response: Response;

    /**
     * ヘッダーを格納する変数。
     * Variable that stores the Headers object.
     */
    headers: Headers;
    status: number;
    body: string;

    /**
     * 強制ダウンロードかどうか（初期値はfalse）。
     * Whether to force download or not (default value is false).
     */
    isForceDownload: boolean;

    constructor(request: ServerRequest) {
        this.#request = request;

        this.headers = new Headers();
        this.status = 500;
        this.body = "500 Internal Server Error";
        this.response = {
            status: undefined,
            headers: this.headers,
            body: undefined
        }

        this.#preset = {};

        this.isForceDownload = false;
    }

    /**
     * MIMEタイプを設定する。
     * Set the MIME type.
     * @param type MIME (Content-Type)
     * 
     * ```ts
     * response.setType("text/plain");
     * ```
     */
    setType(type: string): SystemResponse {
        this.headers.set('Content-Type', type);
        return this;
    }

    /**
     * レスポンスオブジェクトにテキストを設定する。
     * Set the response object to text.
     * @param text A string to return to the client.
     * @param status Status code (default is 200).
     * @param statusText Status text.
     * @param filePath File path.
     */
    setText(text: string, status: number = 200, statusText: string | null = null, filePath?: string): SystemResponse {
        this.body = htmlCompile(text, this.#preset, filePath);
        this.status = status;
        if(statusText != null) this.response.statusText = statusText;
        else if(this.response.statusText != undefined) delete this.response.statusText;
        if(!this.headers.get('Content-Type')) this.setType('text/plain');
        return this;
    }

    /**
     * レスポンスオブジェクトにファイルを設定する。
     * Set the file to the Response object.
     * @param filePath The path of the file to return to the client.
     * @param status Status code (default is 200).
     * @param statusText Status text.
     */
    async setFile(filePath: string, status: number = 200, statusText: string | null = null): Promise<SystemResponse> {
        const file = await Deno.open(filePath);
        let file_data: string;
        try {
            const decoder = new TextDecoder('utf-8');
            file_data = decoder.decode(await Deno.readAll(file));
            this.setText(file_data, status, statusText, filePath);
            const extensions: false | string = lookup(filePath);
            if(extensions) this.setType(extensions);
        } catch (e) {
            console.log(`\n[ warning ]\n
            The "${filePath}" file could not be read.\n
            "${filePath}"ファイルが読み取れませんでした。\n`);
            this.setText("500 Internal Server Error", 500);
            console.log(e);
        }
        return this;
    }

    /**
     * セットしたファイルや文字列に変数が埋め込まれていた場合に、参照されるオブジェクトを定義する。
     * Defines an object to be referenced when a variable is embedded in a set file or string.
     * @param object An object that contains a variable to be referenced.
     */
    preset(object: { [key: string]: any; }): SystemResponse {
        this.#preset = object;
        return this;
    }

    /**
     * Cookieのセットを行う。
     * Set cookies.
     * @param cookie Cookie object.
     * ```ts
     * response.setCookie({
     *      name: 'deno', value: 'runtime',
     *      httpOnly: true, secure: true, maxAge: 2, domain: "deno.land"
     * });
     * ```
     */
    setCookie(cookie: Cookie): SystemResponse {
        setCookie(this.response, cookie);
        return this;
    }

    /**
     * Cookieの削除を行う。
     * Delete cookie.
     * @param name Cookie name.
     */
    deleteCookie(
        name: string,
        attributes?: { path?: string; domain?: string }
    ): SystemResponse {
        this.setCookie({
            name: name,
            value: "",
            expires: new Date(0),
            ...attributes,
        });
        return this;
    }

    /**
     * クライアントにレスポンスを返して処理を終了する。
     * Return the response to the client and finish the process.
     */
    send(response?: string | Response): void {
        if(this.isForceDownload) {
            this.headers.set('Content-Type', 'application/octet-stream');
        }
        this.response.status = this.status;
        this.response.body = this.body;
        if(typeof response == "string") this.setText(response);
        else if(response) this.response = response;
        this.#request.respond(this.response);
    }

    /**
     * リダイレクトさせる。
     * Redirect.
     * @param url URL of the redirection destination.
     */
    redirect(url: string): void {
        this.response.status = 302;
        this.headers.set("Location", url);
        this.response.body = "";
        this.#request.respond(this.response);
    }
}
