import {
    SystemRequest, SystemResponse, Route, createHash
} from "../mod.ts";

/**
 * ダイジェスト認証を使用する場合に呼び出す関数。
 * Function to call when digest authentication is used.
 * @param respondWidth Function for response
 * @param route Route object.
 */
export function authDigest(requestEvent: Deno.RequestEvent, route: Route) {
    const response = new SystemResponse(requestEvent);
    const auth: {[key:string]:string;} = {};
    (requestEvent.request.headers.get("authorization")||"").replace("Digest ","").replace(/\"/g,"").split(/\,\s*/g).forEach(v=>{
        const tmp = v.split("=");
        auth[tmp[0]] = tmp.slice(1).join("=");
    });
    const _A1: string[] = route.AUTH() || [];
    const res: string[] = [];
    for(let A1 of _A1) {
        const A2 = createHash("md5").update(`${requestEvent.request.method}:${new URL(requestEvent.request.url).pathname}`).toString();
        res.push(createHash("md5").update( `${A1}:${auth?.nonce}:${auth?.nc}:${auth?.cnonce}:${auth?.qop}:${A2}` ).toString());
    }
    if(res.includes(auth?.response)) return;
    response.status = 401;
    response.headers.set("WWW-Authenticate", `Digest realm="${route.PATH()}", nonce="${getRandomStr(60)}", algorithm=MD5, qop="auth"`);
    response.headers.set('Content-Type', 'text/html');
    response.body = `<body><script type="text/javascript">setTimeout(()=>location.pathname='/403', 0);</script></body>`;
    response.send();
}

/**
 * ランダムな文字列を生成する。
 * Generate a random string.
 * @param length Number of characters.
 * @returns Random string.
 */
function getRandomStr(length: number = 8): string {
    const CHAR = "ABCDEFGHIJKLMNOPQRSTUabcdefghijklmnopqrstuvwxyz0123456789=.?!^|-_<>";
    const result = [];
    for(let i = 0; i < length; i++) result.push(CHAR[Math.floor(Math.random() * CHAR.length)]);
    return result.join("");
}