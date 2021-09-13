import { ServerRequest, SystemResponse, System, Route } from "../mod.ts"

export async function default_get(request: ServerRequest, response: SystemResponse) {
    const route: Route[] = Route.list.filter(route=>route.URL().includes(request.url.split(/\?/)[0]));
    await response.setFile(`./assets${route[0].PATH()}`);
    response.respond();
}

export async function default_error(request: ServerRequest, response: SystemResponse, status: number, description: string) {
    response.preset({status, description});
    await response.setFile(`./default/error_template.thml`, status, description);
    response.respond();
}

export async function default_error_404(request: ServerRequest, response: SystemResponse) {
    await default_error(request, response, 404, `Not found.<br>見つかりません。`);
}

export async function default_error_502(request: ServerRequest, response: SystemResponse) {
    await default_error(request, response, 502, `Server error.<br>サーバーエラー`);
}