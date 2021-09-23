import { ServerRequest, parseUrl, URL } from "./mod.ts";
export class SystemRequest {

    #request: ServerRequest;

    #url: string;

    #method: string;

    #conn: Deno.Conn;

    #headers: Headers;

    #body: Deno.Reader;

    constructor(request: ServerRequest) {
        this.#request = request;
        this.#url = request.url;
        this.#method = request.method;
        this.#conn = request.conn;
        this.#headers = request.headers;
        this.#body = request.body;
    }

    get request(): ServerRequest {
        return this.#request;
    }

    get url(): string {
        return this.#url;
    }

    getURL(): URL {
        return parseUrl(this.#url);
    }

    get method(): string {
        return this.#method;
    }

    get conn(): Deno.Conn {
        return this.#conn;
    }

    get headers(): Headers {
        return this.#headers;
    }

    get body(): Deno.Reader {
        return this.#body;
    }

    async readBody(decodeURI: boolean = true): Promise<string> {
        const decoder = new TextDecoder('utf-8');
        const body: string = decoder.decode(await Deno.readAll(this.#body));
        if(decodeURI) return decodeURIComponent(body);
        return body;
    }

}