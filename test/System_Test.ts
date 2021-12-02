/**
 * System.tsのSystemクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-12-01
 */

import {
    assertEquals,
    assertNotEquals,
    assertStrictEquals,
    assertNotStrictEquals
} from "./mod_test.ts";
import {
    System,
    PuddleJSON,
    Route,
    Config
} from "../mod.ts";

/**
 * static get JSON()
 */
Deno.test({
  name: "get_JSON",
    fn(): void {
        assertStrictEquals(PuddleJSON, System.JSON);
    },
});

/**
 * static getModule
 */
Deno.test({
    name: "getModule",
    fn(): void {
        const module = { result: "OK" };
        System.modules.set("test", module);

        assertStrictEquals(module, System.getModule("test"));
        assertNotStrictEquals(module, {result: "OK"})
    },
});

/**
 * static setModule
 */
Deno.test({
    name: "setModule",
    fn(): void {
        const module = { result: "OK" };
        System.setModule("test", module);

        assertStrictEquals(module, System.modules.get("test"));
    },
});

/**
 * static setModules
 */
Deno.test({
    name: "setModules",
    fn(): void {
        const modules = { module1: { result: 1 }, module2: { result: 2 } };
        System.setModules(modules);

        assertStrictEquals(modules.module1, System.modules.get("module1"));
        assertStrictEquals(modules.module2, System.modules.get("module2"));
    },
});

/**
 * static deleteModules
 */
Deno.test({
    name: "deleteModules",
    fn(): void {
        const module1 = { result: 1 };
        System.modules.set("module1", module1)
        .set("module2", { result: 2 })
        .set("module3", { result: 3 });

        System.deleteModule("module2", "module3");

        assertStrictEquals(module1, System.modules.get("module1"));
        assertStrictEquals(undefined, System.modules.get("module2"));
        assertStrictEquals(undefined, System.modules.get("module3"));
    },
});

/**
 * static createRoute(case1)
 */
Deno.test({
    name: "createRoute1",
    fn(): void {
        const test_route = System.createRoute("test_route1");

        assertEquals(true, test_route instanceof Route);
        assertEquals(["/test_route1"], test_route.URL());
    },
});

/**
 * static createRoute(case2)
 */
Deno.test({
    name: "createRoute2",
    fn(): void {
        const test_route = System.createRoute({PATH: "test_route2"});
        
        assertEquals(true, test_route instanceof Route);
        assertEquals(["/test_route2"], test_route.URL());
    },
});

/**
 * static createRoutes(case1)
 */
Deno.test({
    name: "createRoutes1",
    fn(): void {
        System.createRoutes("test_route3.test", {PATH: "test_route4"});
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(true, path_list.includes("test_route3.test"));
        assertEquals(true, path_list.includes("test_route4"));
    },
});

/**
 * static createRoutes(case2)
 */
Deno.test({
    name: "createRoutes2",
    fn(): void {
        System.createRoutes("./system_test/assets/*");
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(true, path_list.includes("./system_test/assets/script.js"));
        assertEquals(true, path_list.includes("./system_test/assets/style.css"));
    },
});

/**
 * static deleteRoute
 */
Deno.test({
    name: "deleteRoute",
    fn(): void {
        new Route("test_route_tmp");
        System.deleteRoute("test_route_tmp");
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(false, path_list.includes("test_route_tmp"));
    },
});

/**
 * static deleteRoutes
 */
Deno.test({
    name: "deleteRoutes",
    fn(): void {
        const tmp_list = ["test_route_tmp1", "test_route_tmp2"];
        new Route(tmp_list[0]);
        new Route(tmp_list[1]);
        System.deleteRoutes(tmp_list);
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(false, path_list.includes(tmp_list[0]));
        assertEquals(false, path_list.includes(tmp_list[1]));
    },
});

/**
 * static Route(case1)
 */
Deno.test({
    name: "Route1",
    fn(): void {
        const route = new Route("test_route5");

        assertStrictEquals(route, System.Route("test_route5"));
    },
});

/**
 * static Route(case2)
 */
Deno.test({
    name: "Route2",
    fn(): void {
        const route = System.Route("test_route6");

        assertEquals(true, route instanceof Route);
        assertEquals(route.PATH(), "test_route6");
    },
});

/**
 * static AUTH(case1)
 */
Deno.test({
    name: "AUTH",
    fn(): void {
        const auth = System.AUTH;

        assertEquals(true, "GOOGLE" in auth);
        assertStrictEquals("function", typeof auth.GOOGLE);
    },
});

/**
 * static listen
 */
Deno.test({
    name: "listen",
    async fn(): Promise<void> {
        let error, host;
        try {
            await System.listen(8080, (conf: Config)=>host=`${conf.hostname}:${conf.port}`);
            System.server.close();
        } catch (e) {
            error = e;
        }

        assertEquals(false, Boolean(error));
        assertEquals("localhost:8080", host);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
