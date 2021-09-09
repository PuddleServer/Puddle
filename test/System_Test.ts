/**
 * System.tsのSystemクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-31
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { System, Route }           from "../mod.ts";

class Fruit {

    #variety: string;
    #prise: number;

    constructor(variety: string, prise: number) {
        this.#variety = variety;
        this.#prise = prise;
    }

    getVariety(): string {
        return this.#variety;
    }

    getPrise(): number {
        return this.#prise;
    }
}

/**
 * setModuleテスト
 */
Deno.test({
    name: "setModuleテスト",
    fn(): void {
        const apple: Fruit = new Fruit("apple", 200);
        System.setModule("リンゴ", apple);
    },
});

/**
 * setModulesテスト
 */
Deno.test({
    name: "setModulesテスト",
    fn(): void {
        const orange: Fruit = new Fruit("orange", 20);
        const grape : Fruit = new Fruit("grape", 3000);
        System.setModules({"オレンジ": orange, "ブドウ": grape});
    },
});

/**
 * setModuleテスト
 */
Deno.test({
    name: "getModuleテスト",
    fn(): void {
        assertEquals(200, System.getModule("リンゴ").getPrise());
        assertEquals(3000, System.getModule("ブドウ").getPrise());
    },
});

/**
 * deleteModuleテスト
 */
Deno.test({
    name: "deleteModuleテスト",
    fn(): void {
        System.deleteModule("林檎");
        assertEquals(undefined, System.getModule("林檎"));
    },
});

/**
 * createRouteテスト
 */
Deno.test({
    name: "createRouteテスト",
    fn(): void {
        // 引数がstringの場合
        const route1: Route = System.createRoute("/index.html");
        assertEquals("/index.html", route1.PATH());

        // 引数がRouteの場合
        const r: Route = new Route("/about.html");
        const route2: Route = System.createRoute(r);
        assertEquals("/about.html", route2.PATH())
        
    },
});

/**
 * createRoutesテスト
 */
Deno.test({
    name: "createRoutesテスト",
    async fn(): Promise<void> {
        const r1: Route = new Route("/crs1.html")
        const r2: Route = new Route("/crs2.html")
        
        const routes: { [key: string]: Route; } = await System.createRoutes(r1, r2, "/crs3.html");
        const routes_none: { [key: string]: Route; } = await System.createRoutes();

        assertEquals("/crs1.html", routes["/crs1.html"].PATH());
        assertEquals("/crs2.html", routes["/crs2.html"].PATH());
        assertEquals("/crs3.html", routes["/crs3.html"].PATH());
        assertEquals({}, routes_none);
    },
});

/**
 * Routeテスト
 */
Deno.test({
    name: "Routeテスト",
    fn(): void {
        const get: Function = () => {};
        System.Route("/about.html").GET(get, true);
        System.Route("/crs1.html").GET(get, true);
        System.Route("/crs2.html").GET(get, true);
        assertEquals(true, System.Route("/about.html").isWebSocket);
        assertEquals(true, System.Route("/crs1.html").isWebSocket);
        assertEquals(true, System.Route("/crs2.html").isWebSocket);
    },
});

/**
 * deleteRouteテスト
 */
Deno.test({
    name: "deleteRouteテスト",
    fn(): void {
        System.deleteRoute("/about.html");
        assertEquals(false, System.Route("/about.html").isWebSocket);
    },
});

/**
 * deleteRoutesテスト
 */
Deno.test({
    name: "deleteRoutesテスト",
    fn(): void {
        System.deleteRoutes(["/crs1.html", "/crs2.html"]);
        assertEquals(false, System.Route("/crs1.html").isWebSocket);
        assertEquals(false, System.Route("/crs2.html").isWebSocket);
    },
});
