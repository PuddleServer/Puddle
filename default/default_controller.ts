import { ServerRequest, SystemResponse, System, Route, parseUrl } from "../mod.ts"

export function redirect(url: string): Function {
    return function(request: ServerRequest, response: SystemResponse): void {
        response.response =
        {
            status: 302,
            headers: new Headers({
                location: url,
            }),
        }
        response.respond();
    }
}

export function default_get(): Function {
    return async function default_get(request: ServerRequest, response: SystemResponse): Promise<void> {
        const route: Route[] = Route.list.filter(route=>route.URL().includes(parseUrl(request.url).path));
        console.log(`>> ${request.method} request to "${route[0].PATH()}".`);
        await response.setFile(route[0].PATH());
        response.respond();
    }
}

export function default_error(status: number, description: string): Function {
    return async function (request: ServerRequest, response: SystemResponse): Promise<void> {
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
        response.respond();
    }
}