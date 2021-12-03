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
    HandlerFunction
} from "../../mod.ts";

Deno.test({
    name: "constructor1",
    fn(): void {
        const route = new Route("test_route1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertEquals(true, route instanceof Route);
        assertStrictEquals("test_route1", route.PATH());
        assertStrictEquals(JSON.stringify(["/test_route1"]), JSON.stringify(route.URL()));
        assertStrictEquals(default_get().toString(), route.GET().toString());
        assertStrictEquals(process_404.toString(), route.PUT().toString());
        assertStrictEquals(process_404.toString(), route.POST().toString());
        assertStrictEquals(process_404.toString(), route.DELETE().toString());
        assertStrictEquals(process_404.toString(), route.PATCH().toString());
    },
});

Deno.test({
    name: "constructor2",
    fn(): void {
        const route = new Route("test_route2", [], null);
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertEquals(true, route instanceof Route);
        assertStrictEquals(process_404.toString(), route.GET().toString());
    },
});

Deno.test({
    name: "PATH",
    fn(): void {
        const route = new Route("test_PATH");
        assertEquals("test_PATH", route.PATH());
    }
});

Deno.test({
    name: "URL1",
    fn(): void {
        const route = new Route("test_URL1");

        assertStrictEquals(JSON.stringify(["/test_URL1"]), JSON.stringify(route.URL()));
    }
});

Deno.test({
    name: "URL2",
    fn(): void {
        const route = new Route("test_URL2");
        const urls = ["/url1", "/url2"];
        route.URL(urls);

        assertStrictEquals(JSON.stringify(urls.sort()), JSON.stringify(route.URL().sort()));
    }
});

Deno.test({
    name: "URL3",
    fn(): void {
        const route = new Route("test_URL3");
        const urls = ["/url3", "/url4"];
        route.URL(urls[0], urls[1]);

        assertStrictEquals(JSON.stringify(urls.sort()), JSON.stringify(route.URL().sort()));
    }
});

Deno.test({
    name: "GET1",
    fn(): void {
        const route = new Route("test_GET1");

        assertStrictEquals(default_get().toString(), route.GET().toString());
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

        assertStrictEquals(handler.toString(), route.GET().toString());
    },
});

Deno.test({
    name: "GET3",
    fn(): void {
        const route = new Route("test_GET3");
        const process = new Response();
        const handler = ()=>process;
        route.GET(process);

        assertStrictEquals(handler.toString(), route.GET().toString());
    },
});

Deno.test({
    name: "PUT1",
    fn(): void {
        const route = new Route("test_PUT1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(process_404.toString(), route.PUT().toString());
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

        assertStrictEquals(handler.toString(), route.PUT().toString());
    },
});

Deno.test({
    name: "PUT3",
    fn(): void {
        const route = new Route("test_PUT3");
        const process = new Response();
        const handler = ()=>process;
        route.PUT(process);

        assertStrictEquals(handler.toString(), route.PUT().toString());
    },
});

Deno.test({
    name: "POST1",
    fn(): void {
        const route = new Route("test_POST1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(process_404.toString(), route.POST().toString());
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

        assertStrictEquals(handler.toString(), route.POST().toString());
    },
});

Deno.test({
    name: "POST3",
    fn(): void {
        const route = new Route("test_POST3");
        const process = new Response();
        const handler = ()=>process;
        route.POST(process);

        assertStrictEquals(handler.toString(), route.POST().toString());
    },
});

Deno.test({
    name: "DELETE1",
    fn(): void {
        const route = new Route("test_DELETE1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(process_404.toString(), route.DELETE().toString());
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

        assertStrictEquals(handler.toString(), route.DELETE().toString());
    },
});

Deno.test({
    name: "DELETE3",
    fn(): void {
        const route = new Route("test_DELETE3");
        const process = new Response();
        const handler = ()=>process;
        route.DELETE(process);

        assertStrictEquals(handler.toString(), route.DELETE().toString());
    },
});

Deno.test({
    name: "PATCH1",
    fn(): void {
        const route = new Route("test_PATCH1");
        const process_404 = default_error(404, `Not Found. 見つかりません。`);

        assertStrictEquals(process_404.toString(), route.PATCH().toString());
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

        assertStrictEquals(handler.toString(), route.PATCH().toString());
    },
});

Deno.test({
    name: "PATCH3",
    fn(): void {
        const route = new Route("test_PATCH3");
        const process = new Response();
        const handler = ()=>process;
        route.PATCH(process);

        assertStrictEquals(handler.toString(), route.PATCH().toString());
    },
});