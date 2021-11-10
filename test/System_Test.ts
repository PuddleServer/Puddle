/**
 * System.tsのSystemクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-31
 */

import { assertEquals, assertNotEquals }        from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { System, Route, RouteOption }           from "../mod.ts";

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
 * getModuleテスト
 */
Deno.test({
    name: "getModuleテスト",
    fn(): void {
        assertEquals(200, System.getModule("リンゴ").getPrise(), "getModuleメソッド内の処理を見直してください");
        assertEquals(3000, System.getModule("ブドウ").getPrise(), "getModuleメソッド内の処理を見直してください");
    },
});

/**
 * deleteModuleテスト
 */
Deno.test({
    name: "deleteModuleテスト",
    fn(): void {
        System.setModule("林檎", new Fruit("apple", 200))
        assertNotEquals(undefined, System.getModule("林檎"), "setModuleの時点で失敗しています");
        System.deleteModule("林檎");
        assertEquals(undefined, System.getModule("林檎"), "deleteModuleの処理を見直してください");
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
        const r: Route = new Route("ro代入用");
        const ro: RouteOption = {
            PATH:   "/about.html",
            URL:    ["/about"],
        }

        const route2 = System.createRoute(ro);
        assertEquals("/about.html", route2.PATH())
        
    },
});

/**
 * createRoutesテスト
 * 変更の可能性からコメントアウト
 *//*
Deno.test({
    name: "createRoutesテスト",
    async fn(): Promise<void> {
        // const result;

        const r1: RouteOption = { PATH:"/crs1.html" }
        const r2: RouteOption = { PATH:"/crs2.html" }
        
        const routes: Route[]       = await System.createRoutes(r1, r2, "/crs3.html");
        const routes_none: Route[]  = await System.createRoutes();

        // for(let i of routes) console.log(i.PATH());
        // assertEquals("/crs1.html", routes[0].PATH());
        // assertEquals("/crs2.html", routes["/crs2.html"].PATH());
        // assertEquals("/crs3.html", routes["/crs3.html"].PATH());
        // assertEquals({}, routes_none);
    },
});

/**
 * Routeテスト
 */
Deno.test({
    name: "Routeテスト",
    fn(): void {
        const get: Function = () => {};
        System.createRoute("/crs4.html");
        System.Route("/crs4.html").GET(get); 
        assertEquals(false, System.Route("/crs4.html").isWebSocket);
    },
});

/**
 * deleteRouteテスト
 */
Deno.test({
    name: "deleteRouteテスト",
    fn(): void {
        System.createRoute("/crs5.html");
        
        assertNotEquals(undefined, Route.getRouteByUrl("/crs5.html"));
        
        System.deleteRoute("/crs5.html");
        assertEquals(undefined, Route.getRouteByUrl("/crs5.html"));
    },
});

/**
 * deleteRoutesテスト
 */
Deno.test({
    name: "deleteRoutesテスト",
    fn(): void {
        System.createRoute("/crs6.html");
        System.createRoute("/crs7.html");
        
        assertNotEquals(undefined, Route.getRouteByUrl("/crs6.html"));
        assertNotEquals(undefined, Route.getRouteByUrl("/crs7.html"));

        System.deleteRoutes(["/crs6.html", "/crs7.html"]);
        assertEquals(undefined, Route.getRouteByUrl("/crs6.html"));
        assertEquals(undefined, Route.getRouteByUrl("/crs7.html"));
    },
});
