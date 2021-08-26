/**
 * ルーティングを行うクラスファイル。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-24
 */
export class Route {

    /** サーバーへのリクエストの名前 */
    #PATH: String;

    /** リクエストを許可する別名 */
    #URL: String[];

    /** GETリクエスト時の処理をまとめた関数 */
    #GET: Function;

    /** PUTリクエスト時の処理まとめた関数 */
    #PUT: Function;

    /** POSTリクエスト時の処理まとめた関数 */
    #POST: Function;

    /** DELETEリクエスト時の処理まとめた関数 */
    #DELETE: Function;

    constructor(PATH: String, URL: String[], GET: Function, PUT: Function, POST: Function, DELETE: Function) {
        this.#PATH = PATH;
        this.#URL = URL || [];
        this.#GET = GET;// || default_get;
        this.#PUT = PUT;// || default_PUT;
        this.#POST = POST;// || default_POST;
        this.#DELETE = DELETE;// || default_DELETE;

        if(!this.#URL.includes(this.#PATH)) this.#URL.push(this.#PATH);
    }

    /**
     * サーバーへのリクエストの名前を返す。
     * @returns PATH
     */
    PATH(): String {
        return this.#PATH;
    }

    /**
     * URLの取得、設定を行う。
     * @param urls 許可するリクエストURL(可変長引数)。
     * @returns 引数がない場合はURLを、ある場合はthisを返す。
     */
    URL(...urls: String[]): String[] | Promise<Route> {

        if(!urls.length) return this.#URL;

        this.#URL = urls;
        return new Promise((resolve)=>resolve(this));

    }

    /**
     * GETの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はGETを、ある場合はthisを返す。
     */
    GET(process: Function): Function | Promise<Route> {

        if(!process) return this.#GET;

        this.#GET = process;
        return new Promise((resolve)=>resolve(this));

    }

    /**
     * PUTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPUTを、ある場合はthisを返す。
     */
    PUT(process: Function): Function | Promise<Route> {

        if(!process) return this.#PUT;

        this.#PUT = process;
        return new Promise((resolve)=>resolve(this));

    }

    /**
     * POSTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPOSTを、ある場合はthisを返す。
     */
    POST(process: Function): Function | Promise<Route> {

        if(!process) return this.#POST;

        this.#POST = process;
        return new Promise((resolve)=>resolve(this));

    }

    /**
     * DELETEの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はDELETEを、ある場合はthisを返す。
     */
    DELETE(process: Function): Function | Promise<Route> {

        if(!process) return this.#DELETE;

        this.#DELETE = process;
        return new Promise((resolve)=>resolve(this));

    }
}