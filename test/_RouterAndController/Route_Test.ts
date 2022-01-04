/**
 * Router.ts Routeクラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-12-03
 */

import {
    assertEquals,
    assertStrictEquals
} from "../mod_test.ts";
import {
    Route,
    default_get,
    default_error,
    SystemRequest,
    SystemResponse,
    HandlerFunction,
    createHash,
    WebSocketRoute,
    WebSocketClient
} from "../../mod.ts";

Deno.test({
    name: "constructor1",
    fn(): void {
        const route = new Route("test_route1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertEquals(route instanceof Route, true);
        assertStrictEquals(route.PATH(), "test_route1");
        assertStrictEquals(JSON.stringify(route.URL()), JSON.stringify(["/test_route1"]));
        assertStrictEquals(route.GET().toString(), default_get().toString())
        assertStrictEquals(route.PUT().toString(), process_404.toString());
        assertStrictEquals(route.POST().toString(), process_404.toString());
        assertStrictEquals(route.DELETE().toString(), process_404.toString());
        assertStrictEquals(route.PATCH().toString(), process_404.toString());
    },
});

Deno.test({
    name: "constructor2",
    fn(): void {
        const route = new Route("test_route2", [], null);
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertEquals(route instanceof Route, true);
        assertStrictEquals(route.GET().toString(), process_404.toString());
    },
});

Deno.test({
    name: "PATH",
    fn(): void {
        const route = new Route("test_PATH");
        assertEquals(route.PATH(), "test_PATH");
    }
});

Deno.test({
    name: "URL1",
    fn(): void {
        const route = new Route("test_URL1");

        assertStrictEquals(JSON.stringify(route.URL()), JSON.stringify(["/test_URL1"]));
    }
});

Deno.test({
    name: "URL2",
    fn(): void {
        const route = new Route("test_URL2");
        const urls = ["/url1", "/url2"];
        route.URL(urls);

        assertStrictEquals(JSON.stringify(route.URL().sort()), JSON.stringify(urls.sort()));
    }
});

Deno.test({
    name: "URL3",
    fn(): void {
        const route = new Route("test_URL3");
        const urls = ["/url3", "/url4"];
        route.URL(urls[0], urls[1]);

        assertStrictEquals(JSON.stringify(route.URL().sort()), JSON.stringify(urls.sort()));
    }
});

Deno.test({
    name: "GET1",
    fn(): void {
        const route = new Route("test_GET1");

        assertStrictEquals(route.GET().toString(), default_get().toString());
    },
});

Deno.test({
    name: "GET2",
    fn(): void {
        const route = new Route("test_GET2");
        const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
            res.setText("Collect!"); 
        }
        route.GET(handler);

        assertStrictEquals(route.GET().toString(), handler.toString());
    },
});

Deno.test({
    name: "GET3",
    fn(): void {
        const route = new Route("test_GET3");
        const process = new Response();
        const handler = ()=>process;
        route.GET(process);

        assertStrictEquals(route.GET().toString(), handler.toString());
    },
});

Deno.test({
    name: "PUT1",
    fn(): void {
        const route = new Route("test_PUT1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(route.PUT().toString(), process_404.toString());
    },
});

Deno.test({
    name: "PUT2",
    fn(): void {
        const route = new Route("test_PUT2");
        const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
           res.setText("Collect!"); 
        }
        route.PUT(handler);

        assertStrictEquals(route.PUT().toString(), handler.toString());
    },
});

Deno.test({
    name: "PUT3",
    fn(): void {
        const route = new Route("test_PUT3");
        const process = new Response();
        const handler = ()=>process;
        route.PUT(process);

        assertStrictEquals(route.PUT().toString(), handler.toString());
    },
});

Deno.test({
    name: "POST1",
    fn(): void {
        const route = new Route("test_POST1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(route.POST().toString(), process_404.toString());
    },
});

Deno.test({
    name: "POST2",
    fn(): void {
        const route = new Route("test_POST2");
        const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
           res.setText("Collect!"); 
        }
        route.POST(handler);

        assertStrictEquals(route.POST().toString(), handler.toString());
    },
});

Deno.test({
    name: "POST3",
    fn(): void {
        const route = new Route("test_POST3");
        const process = new Response();
        const handler = ()=>process;
        route.POST(process);

        assertStrictEquals(route.POST().toString(), handler.toString());
    },
});

Deno.test({
    name: "DELETE1",
    fn(): void {
        const route = new Route("test_DELETE1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(route.DELETE().toString(), process_404.toString());
    },
});

Deno.test({
    name: "DELETE2",
    fn(): void {
        const route = new Route("test_DELETE2");
        const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
           res.setText("Collect!"); 
        }
        route.DELETE(handler);

        assertStrictEquals(route.DELETE().toString(), handler.toString());
    },
});

Deno.test({
    name: "DELETE3",
    fn(): void {
        const route = new Route("test_DELETE3");
        const process = new Response();
        const handler = ()=>process;
        route.DELETE(process);

        assertStrictEquals(route.DELETE().toString(), handler.toString());
    },
});

Deno.test({
    name: "PATCH1",
    fn(): void {
        const route = new Route("test_PATCH1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(route.PATCH().toString(), process_404.toString());
    },
});

Deno.test({
    name: "PATCH2",
    fn(): void {
        const route = new Route("test_PATCH2");
        const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
           res.setText("Collect!"); 
        }
        route.PATCH(handler);

        assertStrictEquals(route.PATCH().toString(), handler.toString());
    },
});

Deno.test({
    name: "PATCH3",
    fn(): void {
        const route = new Route("test_PATCH3");
        const process = new Response();
        const handler = ()=>process;
        route.PATCH(process);

        assertStrictEquals(route.PATCH().toString(), handler.toString());
    },
});

Deno.test({
    name: "AUTH1",
    fn(): void {
        const route = new Route("test_AUTH1");

        assertEquals(route.AUTH(), undefined);
    },
});

Deno.test({
    name: "AUTH2",
    fn(): void {
        const route = new Route("test_AUTH2");
        const hash = createHash("md5").update(`user_name:${route.PATH()}:password`).toString();
        route.AUTH(hash);
        
        assertEquals(JSON.stringify(route.AUTH()) ,JSON.stringify([hash]));
    },
});

Deno.test({
    name: "AUTH3",
    fn(): void {
        const route = new Route("test_AUTH3");
        const hash = createHash("md5").update(`user_name:${route.PATH()}:password`).toString();
        route.AUTH("user_name", "password");

        assertStrictEquals(JSON.stringify(route.AUTH()) ,JSON.stringify([hash]));
    },
});

Deno.test({
    name: "AUTH4",
    fn(): void {
        const name = "user_name", password = "password";
        const route = new Route("test_AUTH4");
        const hash = createHash("md5").update(`${name}:${route.PATH()}:${password}`).toString();
        route.AUTH({name, password}, {hash});

        assertStrictEquals(JSON.stringify(route.AUTH()) ,JSON.stringify([hash, hash]));
    },
});

Deno.test({
    name: "isWebSocket",
    fn(): void {
        const route = new Route("test_isWebSocket");
        let before, after;
        before = route.isWebSocket;
        route.WebSocket();
        after = route.isWebSocket;

        assertEquals(before, false);
        assertEquals(after, true);
    },
});

Deno.test({
    name: "WebSocket1",
    fn(): void {
        const route = new Route("test_WebSocket1");

        assertStrictEquals(route.WebSocket() instanceof WebSocketRoute, true);
    },
});

Deno.test({
    name: "WebSocket2",
    fn(): void {
        const handler = (client: WebSocketClient)=>console.log(client);
        const route = new Route("test_WebSocket2");
        const ws = route.WebSocket({onerror: handler});

        assertEquals(ws instanceof WebSocketRoute, true);
        assertStrictEquals(ws.onerror().toString(), handler.toString());
    },
});

Deno.test({
    name: "getUniqueUrlArray",
    fn(): void {
        const uniqueUrlArray = ["/url1", "/url2"];
        const route = new Route("test_getUniqueUrlArray");
        route.URL(uniqueUrlArray);

        assertEquals(route.getUniqueUrlArray(uniqueUrlArray), []);
    },
});

Deno.test({
    name: "isThePathInUse",
    fn(): void {
        const path = "test_isThePathInUse1";
        new Route(path);

        assertEquals(Route.isThePathInUse(path), true);
        assertEquals(Route.isThePathInUse("test_isThePathInUse2"), false);
    },
});

Deno.test({
    name: "isTheUrlAlreadyInUse",
    fn(): void {
        const url = "/test_isTheUrlAlreadyInUse1";
        new Route("test_isTheUrlAlreadyInUse1", [url]);

        assertEquals(Route.isTheUrlAlreadyInUse(url), true);
        assertEquals(Route.isTheUrlAlreadyInUse("/test_isTheUrlAlreadyInUse2"), false);
    },
});

Deno.test({
    name: "getRouteByPath1",
    fn(): void {
        const path = "test_getRouteByPath1";
        const route = new Route(path);

        assertStrictEquals(Route.getRouteByPath(path) ,route);
    },
});

Deno.test({
    name: "getRouteByPath2",
    fn(): void {
        const path = "test_getRouteByPath2";

        assertEquals(Route.getRouteByPath(path) instanceof Route, true);
        assertEquals(Route.getRouteByPath(path).PATH(), "test_getRouteByPath2");
    },
});

Deno.test({
    name: "getRouteByUrl",
    fn(): void {
        const route = new Route("/test_getRouteByUrl/:var");
        const variables: {[key: string]: string;} = {};
        const _route = Route.getRouteByUrl("/test_getRouteByUrl/test", variables);

        assertStrictEquals(_route ,route);
        assertEquals(variables["var"], "test");
    },
});
