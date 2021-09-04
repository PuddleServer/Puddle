/**
 * Router.ts Routesクラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-04
 */

import { assertEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route, Routes } from "../Router.ts";

/**
 * 生成テスト
 */
Deno.test({
    name: "生成テスト",
    fn(): void {
        const route1:  Route  = new Route("/index.html");
        const route2:  Route  = new Route("/about.html");

        const routes1: Routes = new Routes();
        const routes2: Routes = new Routes(route1);
        const routes3: Routes = new Routes(route1, route1);
        const routes4: Routes = new Routes(route1, route2); // [warning] Url重複

    },
});

/**
 * pathsテスト
 */
Deno.test({
    name: "pathsテスト",
    fn(): void {
        const route1: Route  = new Route("/index.html");
        const route2: Route  = new Route("/about.html");

        const routes: Routes = new Routes(route1, route2);

        assertEquals(["/index.html", "/about.html"], routes.paths(), "不正なpathが定義されているか，定義されるべきpathがありません．");
    },
});

/**
 * sizeテスト
 */
Deno.test({
    name: "sizeテスト",
    fn(): void {
        const route1:  Route  = new Route("/index.html");
        const route2:  Route  = new Route("/about.html");
        const route3:  Route  = new Route("/contact.html");
        const route4:  Route  = new Route("/other.html");

        const routes1: Routes = new Routes(route1);
        const routes2: Routes = new Routes(route1, route2);
        const routes3: Routes = new Routes(route1, route2, route3);
        const routes4: Routes = new Routes(route1, route2, route3, route4);
        const routes5: Routes = new Routes(route1, route1, route3, route4); // 重複した場合

        assertEquals(1, routes1.size(), "urlが重複しているか，予期しないpathが追加されています．");
        assertEquals(2, routes2.size(), "urlが重複しているか，予期しないpathが追加されています．");
        assertEquals(3, routes3.size(), "urlが重複しているか，予期しないpathが追加されています．");
        assertEquals(4, routes4.size(), "urlが重複しているか，予期しないpathが追加されています．");
        assertEquals(3, routes5.size(), "urlが重複しているか，予期しないpathが追加されています．");
    },
});

/**
 * putテスト
 */
Deno.test({
    name: "putテスト",
    fn(): void {
        const route1: Route  = new Route("/index.html");
        const route2: Route  = new Route("/about.html");
        const route3: Route  = new Route("/about.html");

        const routes: Routes = new Routes(route1);

        routes.put(route2);
        
        assertEquals(["/index.html", "/about.html"], routes.paths(), "urlが重複しているか，追加が正常にできていません．");
        
        routes.put(route3); // 重複したurlの追加

        assertEquals(["/index.html", "/about.html"], routes.paths(), "urlの重複に対して聖樹に処理できていません．");
    },
});

/**
 * deleteテスト
 */
Deno.test({
    name: "deleteテスト",
    fn(): void {
        const route1: Route  = new Route("/index.html");
        const route2: Route  = new Route("/about.html");
        const route3: Route  = new Route("/contact.html");
        const route4: Route  = new Route("/other.html");

        const routes: Routes = new Routes(route1, route2, route3, route4);

        routes.delete("/qwerty"); // 意味なし
        
        assertEquals(["/index.html", "/contact.html", "/other.html"], routes.paths(), "不正な削除処理が行われています．")

        routes.delete("/about.html");

        assertEquals(["/index.html", "/contact.html", "/other.html"], routes.paths(), "削除処理ができていないか，別のurlが削除されています．")
    },
});