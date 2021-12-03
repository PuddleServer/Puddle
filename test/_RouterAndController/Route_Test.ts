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
    default_error
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

