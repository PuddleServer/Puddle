/**
 * Router.ts Routesクラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-30
 */

import { assertEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route, Routes } from "../Router.ts";

/**
 * 生成テスト
 */
Deno.test({
    name: "生成テスト",
    fn(): void {
        const route:   Route  = new Route("/index.html");

        const routes1: Routes = new Routes();
        const routes2: Routes = new Routes(route);
        const routes3: Routes = new Routes(route, route);

    },
});

/**
 * pathsテスト
 */
Deno.test({
    name: "pathsテスト",
    fn(): void {
        const route1:  Route = new Route("/index.html");
        const route2:  Route = new Route("/about.html");

        const routes: Routes = new Routes(route1, route2);

        assertEquals(["/index.html", "/about.html"], routes.paths());
    },
});

/**
 * sizeテスト
 */
Deno.test({
    name: "sizeテスト",
    fn(): void {
        const route1:   Route = new Route("/index.html");
        const route2:   Route = new Route("/about.html");
        const route3:   Route = new Route("/contact.html");
        const route4:   Route = new Route("/other.html");

        const routes1: Routes = new Routes(route1);
        const routes2: Routes = new Routes(route1, route2);
        const routes3: Routes = new Routes(route1, route2, route3);
        const routes4: Routes = new Routes(route1, route2, route3, route4);

        assertEquals(1, routes1.size());
        assertEquals(2, routes2.size());
        assertEquals(3, routes3.size());
        assertEquals(4, routes4.size());
    },
});

/**
 * putテスト
 */
Deno.test({
    name: "putテスト",
    fn(): void {
        const route1:  Route = new Route("/index.html");
        const route2:  Route = new Route("/about.html");

        const routes: Routes = new Routes(route1);

        routes.put(route2);
        
        assertEquals(["/index.html", "/about.html"], routes.paths())
    },
});

/**
 * deleteテスト
 */
Deno.test({
    name: "deleteテスト",
    fn(): void {
        const route1:   Route = new Route("/index.html");
        const route2:   Route = new Route("/about.html");
        const route3:   Route = new Route("/contact.html");
        const route4:   Route = new Route("/other.html");

        const routes: Routes = new Routes(route1, route2, route3, route4);

        routes.delete("/qwerty"); // 意味なし
        routes.delete("/about.html");

        assertEquals(["/index.html", "/contact.html", "/other.html"], routes.paths())
    },
});