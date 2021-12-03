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