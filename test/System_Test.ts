/**
 * System.tsのSystemクラステスト
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
    Config,
    Server
} from "../mod.ts";

Deno.test({
  name: "get_JSON",
    fn(): void {
        assertStrictEquals(System.JSON, PuddleJSON);
    },
});

Deno.test({
    name: "getModule",
    fn(): void {
        const module = { result: "OK" };
        System.modules.set("test", module);

        assertStrictEquals(System.getModule("test"), module);
        assertNotStrictEquals({result: "OK"}, module)
    },
});

Deno.test({
    name: "setModule",
    fn(): void {
        const module = { result: "OK" };
        System.setModule("test", module);

        assertStrictEquals(System.modules.get("test"), module);
    },
});

Deno.test({
    name: "setModules",
    fn(): void {
        const modules = { module1: { result: 1 }, module2: { result: 2 } };
        System.setModules(modules);

        assertStrictEquals(System.modules.get("module1"), modules.module1);
        assertStrictEquals(System.modules.get("module2"), modules.module2);
    },
});

Deno.test({
    name: "deleteModules",
    fn(): void {
        const module1 = { result: 1 };
        System.modules.set("module1", module1)
        .set("module2", { result: 2 })
        .set("module3", { result: 3 });

        System.deleteModule("module2", "module3");

        assertStrictEquals(System.modules.get("module1"), module1);
        assertStrictEquals(System.modules.get("module2"), undefined);
        assertStrictEquals(System.modules.get("module3"), undefined);
    },
});

Deno.test({
    name: "createRoute1",
    fn(): void {
        const test_route = System.createRoute("test_route1");

        assertEquals(test_route instanceof Route, true);
        assertEquals(test_route.URL(), ["/test_route1"]);
    },
});

Deno.test({
    name: "createRoute2",
    fn(): void {
        const test_route = System.createRoute({PATH: "test_route2"});
        
        assertEquals(test_route instanceof Route, true);
        assertEquals(test_route.URL(), ["/test_route2"]);
    },
});

Deno.test({
    name: "createRoutes1",
    fn(): void {
        System.createRoutes("test_route3.test", {PATH: "test_route4"});
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(path_list.includes("test_route3.test"), true);
        assertEquals(path_list.includes("test_route4"), true);
    },
});

Deno.test({
    name: "createRoutes2",
    fn(): void {
        System.createRoutes("./testdata/assets/*");
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(path_list.includes("./testdata/assets/script.js"), true);
        assertEquals(path_list.includes("./testdata/assets/style.css"), true);
    },
});

Deno.test({
    name: "deleteRoute",
    fn(): void {
        new Route("test_route_tmp");
        System.deleteRoute("test_route_tmp");
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(path_list.includes("test_route_tmp"), false);
    },
});

Deno.test({
    name: "deleteRoutes",
    fn(): void {
        const tmp_list = ["test_route_tmp1", "test_route_tmp2"];
        new Route(tmp_list[0]);
        new Route(tmp_list[1]);
        System.deleteRoutes(tmp_list);
        const path_list = Route.list.map(route=>route.PATH());

        assertEquals(path_list.includes(tmp_list[0]), false);
        assertEquals(path_list.includes(tmp_list[1]), false);
    },
});

Deno.test({
    name: "Route1",
    fn(): void {
        const route = new Route("test_route5");

        assertStrictEquals(System.Route("test_route5"), route);
    },
});

Deno.test({
    name: "Route2",
    fn(): void {
        const route = System.Route("test_route6");

        assertEquals(route instanceof Route, true);
        assertEquals(route.PATH(), "test_route6");
    },
});

Deno.test({
    name: "AUTH",
    fn(): void {
        const auth = System.AUTH;

        assertEquals("GOOGLE" in auth, true);
        assertStrictEquals(typeof auth.GOOGLE, "function");
    },
});

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

        assertEquals(Boolean(error), false);
        assertEquals(host, "localhost:8080");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "listenTLS",
    async fn(): Promise<void> {
        const option = {
            port:       8080,
            certFile:   "./testdata/tls/localhost.crt",
            keyFile:    "./testdata/tls/localhost.key"
        }
        let error, host;
        try {
            await System.listenTLS(option, (conf: Config)=>host=`${conf.hostname}:${conf.port}`);
            System.server.close();
        } catch (e) {
            error = e;
        }

        //console.log(error);

        assertEquals(Boolean(error), false);
        assertEquals(host, "localhost:8080");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "close",
    async fn(): Promise<void> {
        const handler = () => new Response();
        System.server = new Server({ handler });
        let check_before: null | boolean = null;
        let check_after: null | boolean = null;
        try {
          check_before = System.server.closed;
        } finally {
          System.close();
          check_after = System.server.closed;
        }

        assertEquals(check_before, false);
        assertEquals(check_after, true);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});