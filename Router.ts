/**
 * ルーティングを行うクラスファイル。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-30
 */
export class Route {

    /** サーバーへのリクエストの名前 */
    #PATH: string;

    /** リクエストを許可する別名 */
    #URL: string[];

    /** GETリクエスト時の処理をまとめた関数 */
    #GET: Function;

    /** PUTリクエスト時の処理まとめた関数 */
    #PUT: Function;

    /** POSTリクエスト時の処理まとめた関数 */
    #POST: Function;

    /** DELETEリクエスト時の処理まとめた関数 */
    #DELETE: Function;

    isWebSocket: boolean;

    constructor(PATH: string, URL?: string[] | null, GET?: Function | null, PUT?: Function | null, POST?: Function | null, DELETE?: Function | null, isWebSocket?: boolean | null) {
        this.#PATH = PATH;
        this.#URL = URL || [];
        this.#GET = GET || function(){console.log("GET")};// || default_get;
        this.#PUT = PUT || function(){console.log("PUT")};// || default_PUT;
        this.#POST = POST || function(){console.log("POST")};// || default_POST;
        this.#DELETE = DELETE || function(){console.log("DELETE")};// || default_DELETE;
        this.isWebSocket = Boolean(isWebSocket);

        if(!this.#URL.includes(this.#PATH)) this.#URL.push(this.#PATH);
    }

    /**
     * サーバーへのリクエストの名前を返す。
     * @returns PATH
     */
    PATH(): string {
        return this.#PATH;
    }

    /**
     * URLの取得、設定を行う。
     * @param urls 許可するリクエストURL(可変長引数)。
     * @returns 引数がない場合はURLを、ある場合はthisを返す。
     */
    URL(): string[];
    URL(...urls: string[]): Route;
    URL(...urls: string[]): string[] | Route {

        if(!urls.length) return this.#URL;

        this.#URL = urls;
        return this;

    }

    /**
     * GETの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はGETを、ある場合はthisを返す。
     */
    GET(): Function;
    GET(process: Function): Route;
    GET(process?: Function): Function | Route {

        if(!process) return this.#GET;

        this.#GET = process;
        return this;

    }

    /**
     * PUTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPUTを、ある場合はthisを返す。
     */
    PUT(): Function;
    PUT(process: Function): Route;
    PUT(process?: Function): Function | Route {

        if(!process) return this.#PUT;

        this.#PUT = process;
        return this;

    }

    /**
     * POSTの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はPOSTを、ある場合はthisを返す。
     */
    POST(): Function;
    POST(process: Function): Route;
    POST(process?: Function): Function | Route {

        if(!process) return this.#POST;

        this.#POST = process;
        return this;

    }

    /**
     * DELETEの取得、設定を行う。
     * @param process 処理内容を記述した関数。
     * @returns 引数がない場合はDELETEを、ある場合はthisを返す。
     */
    DELETE(): Function;
    DELETE(process: Function): Route;
    DELETE(process?: Function): Function | Route {

        if(!process) return this.#DELETE;

        this.#DELETE = process;
        return this;

    }

    /**
     * Routeオブジェクト動詞を比較する。
     * @param route 比較対象のRouteオブジェクト。
     * @returns 同じオブジェクトであればtrueを、そうでなければfalseを返す。
     */
    equals(route: any): boolean {
        const Path: boolean = this.#PATH == route.PATH();
        const Url: boolean = this.#URL.toString() == route.URL().toString();
        const Get: boolean = this.#GET.toString() == route.GET().toString();
        const Put: boolean = this.#PUT.toString() == route.PUT().toString();
        const Post: boolean = this.#POST.toString() == route.POST().toString();
        const Delete: boolean = this.#DELETE.toString() == route.DELETE().toString();
        return Path && Url && Get && Put && Post && Delete;
    }

    /**
     * 自身をディープコピーする。
     * @returns 自身と同じパラメータを持つRouteオブジェクトを返す。
     */
    clone(): Route {
        return new Route(this.#PATH, this.#URL, this.#GET, this.#PUT, this.#POST, this.#DELETE);
    }
}

/**
 * 複数のRouteオブジェクトを保持するクラス。
 */
export class Routes {

    [key: string]: Route | Function;

    constructor(...routes: Route[]){
        routes.forEach(route=> this.put(route) );
    }

    /**
     * 保持しているRouteオブジェクトのPATHの配列。
     * @returns RouteオブジェクトのPATHの配列。
     */
    paths(): string[] {
        return Object.keys(this).map(path=>path);
    }

    /**
     * 保持しているRouteの数。
     * @returns 要素数。
     */
    size(): number {
        return this.paths().length;
    }

    /**
     * Routeオブジェクトを追加する。
     * @param routes 追加するRouteオブジェクト
     */
    put(...routes: Route[]): void {
        for(let route of routes) {
            if(!this.#checkUrl(route)) return;
            const path = route.PATH();
            this[path] = route;
        }
    }

    /**
     * 指定したPathを持つRouteを削除する。
     * @param paths パス(可変長引数)。
     * @returns 外されたRoute。
     */
    delete(...paths: string[]): void {
        paths.forEach( path => {
            delete this[path];
        });
    }

    /**
     * RouteのURLに重複がないかをチェックする。
     * @param route チェック対象のRouteオブジェクト。
     * @returns 重複がなければtrueを返す。
     */
    #checkUrl(route: Route): boolean {
        
        const duplicateUrl: string[] = this.paths().filter( (url: string) => route.URL().includes(url) );
        if( duplicateUrl.length ) {
            console.log(`\n[ warning ]\n
            Of the specified URLs, ${duplicateUrl.join(', ')} are duplicated.\n
            指定されたURLのうち、${duplicateUrl.join(', ')} が重複しています。\n`);
            return false;
        }
        return true;
    }

}