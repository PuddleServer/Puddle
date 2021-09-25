/**
 * Serverのresponse関連の機能をまとめたクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-17
 */
import {
    ServerRequest, Response,
    Cookie, setCookie,
    lookup,
    htmlCompile
} from "./mod.ts"

export class SystemResponse {

    /** requestを格納する変数 */
    #request: ServerRequest;

    /** presetを格納する変数 */
    #preset: { [key: string]: any; };

    /** レスポンスオブジェクト */
    response: Response;

    headers: Headers;
    status: number;
    body: string;

    /** 強制ダウンロードかどうか（初期値はfalse） */
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
     * Responseオブジェクトにテキストを設定する。
     * @param text クライアントに返す文字列。
     * @param status ステータスコード（デフォルトは200）。
     * @param statusText ステータステキスト。
     */
    setText(text: string, status: number = 200, statusText: string | null = null): void {
        this.body = htmlCompile(text, this.#preset);
        this.status = status;
        if(statusText != null) this.response.statusText = statusText;
        else if(this.response.statusText != undefined) delete this.response.statusText;
        this.headers.set('Content-Type', 'text/plain');
    }

    /**
     * Responseオブジェクトにファイルを設定する。
     * @param filePath クライアントに返すファイルのパス。
     * @param status ステータスコード（デフォルトは200）。
     * @param statusText ステータステキスト。
     */
    async setFile(filePath: string, status: number = 200, statusText: string | null = null): Promise<void> {
        const file = await Deno.open(filePath);
        let file_data: string;
        try {
            const decoder = new TextDecoder('utf-8');
            file_data = decoder.decode(await Deno.readAll(file));
            this.setText(file_data, status, statusText);
            const extensions: false | string = lookup(filePath);
            if(extensions) this.headers.set('Content-Type', extensions);
        } catch {
            console.log(`\n[ warning ]\n
            The "${filePath}" file could not be read.\n
            "${filePath}"ファイルが読み取れませんでした。\n`);
            this.setText("500 Internal Server Error", 500);
        }
    }

    /**
     * セットしたファイルや文字列に変数が埋め込まれていた場合に、参照されるオブジェクトを定義する。
     * @param object 参照される変数を格納したオブジェクト。
     */
    preset(object: { [key: string]: any; }): void {
        this.#preset = object;
    }

    /**
     * Cookieのセットを行う。
     * @param cookie 
     */
    setCookie(cookie: Cookie): void {
        setCookie(this.response, cookie);
    }

    /**
     * Cookieの削除を行う。
     * @param name 削除するCookie名。
     */
    deleteCookie(
        name: string,
        attributes?: { path?: string; domain?: string }
    ): void {
        this.setCookie({
            name: name,
            value: "",
            expires: new Date(0),
            ...attributes,
        });
    }

    /**
     * ServerRequestのrespondを実行する。
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
     * リダイレクトさせる
     * @param url リダイレクト先
     */
    redirect(url: string): void {
        this.response.status = 302;
        this.headers.set("Location", url);
        this.response.body = "";
        this.#request.respond(this.response);
    }
}
