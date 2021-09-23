/**
 * サーバーの初期設定時の処理
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-23
 */
import { SystemRequest, SystemResponse, System, Route, parseUrl, WebSocketClient } from "../mod.ts"

export function redirect(url: string): Function {
    return function(request: SystemRequest, response: SystemResponse): void {
        response.status = 302;
        response.headers.set("Location", url);
        response.send();
    }
}

export function default_get(): Function {
    return async function default_get(request: SystemRequest, response: SystemResponse): Promise<void> {
        const route: string | undefined = Route.getRouteByUrl(request.getURL().path)?.PATH();
        console.log(`>> ${request.method} request to "${route}".`);
        if(!route) return Route["404"].GET()(request, response);
        await response.setFile(route);
        response.send();
    }
}

export function default_error(status: number, description: string): Function {
    return async function (request: SystemRequest, response: SystemResponse): Promise<void> {
        //response.preset({status, description});
        const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${status} ${description}</title>
        </head>
        <body>
            <h1>${status}</h1>
            <p>${description}</p>
        </body>
        </html>
        `;
        await response.setText(html, status, description);
        response.headers.set('Content-Type', 'text/html');
        response.send();
    }
}

export function default_onopen(request: SystemRequest, client: WebSocketClient): void {
    console.log(`>> WebSocket opened with "${request.url}". Connections ${client.getAllClients().length}`);
}

export function default_onmessage(request: SystemRequest, client: WebSocketClient, message: string): void {
    client.sendAll(message);
}