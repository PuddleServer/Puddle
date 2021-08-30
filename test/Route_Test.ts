/**
 * Router.ts Routeクラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-30
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route }            from "../Router.ts";

/**
 * ディープコピー関数
 */
 const deepCopy: any = (_object: any) => {
    return JSON.parse(JSON.stringify(_object));
  }

// Routeオブジェクトに必要なもの
const path: String   = "/index.html";
const urls: String[] = ["/", "/top", "/Top", "/トップ"];
const get: Function = function() { return "GET!";    }
const put: Function = function() { return "PUT!";    }
const pos: Function = function() { return "POST!";   }
const del: Function = function() { return "DELETE!"; }

/**
 * Route生成テスト
 */
Deno.test({
    name: "Route生成テスト",
    fn(): void {
        let urls1: String[] = deepCopy(urls);
        let route: Route = new Route(path, urls1, get, put, pos, del);
        route = new Route(path);
        
    },
});

/**
 * equalsテスト
 */
Deno.test({
    name: "equalsテスト",
    fn(): void {
        const route: Route = new Route(path, deepCopy(urls), get, put, pos, del);
        const route2: Route = new Route("/route2.html", deepCopy(urls), get, put, pos, del);
        const route3: Route = new Route(path, ["/route3"], get, put, pos, del);
        const route4: Route = new Route(path, deepCopy(urls), put, put, pos, del);
        const route5: Route = new Route(path, deepCopy(urls), get, pos, pos, del);
        const route6: Route = new Route(path, deepCopy(urls), get, put, del, del);
        const route7: Route = new Route(path, deepCopy(urls), get, put, pos, get);

        assertEquals(true, route.equals(route));
        assertEquals(false, route.equals(route2));
        assertEquals(false, route.equals(route3));
        assertEquals(false, route.equals(route4));
        assertEquals(false, route.equals(route5));
        assertEquals(false, route.equals(route6));
        assertEquals(false, route.equals(route7));

    },
});

/**
 * PATH取得テスト
 */
Deno.test({
    name: "PATH取得テスト",
    fn(): void {
        const route: Route = new Route(path, deepCopy(urls), get, put, pos, del);

        assertEquals(path, route.PATH());
    },
});

/**
 * URL取得テスト
 */
Deno.test({
    name: "URL取得テスト",
    fn(): void {
        let route_after: Route = new Route(path, deepCopy(urls), get, put, pos, del);
        let route_before: Route = route_after.clone();
        
        // 引数無しの時は#URLが返る
        console.log(urls, route_after.URL(), route_before.URL())
        assertEquals([ "/", "/top", "/Top", "/トップ", "/index.html" ], route_after.URL());
        // アリの時はthisが返る
        assertEquals(true, route_before.equals(route_after.URL("/", "/top", "/Top", "/トップ", "/index.html")));
        assertEquals(false, route_before.equals(route_after.URL("/", "/top", "/Top", "/トップ")));

    },
});

/**
 * GET取得テスト
 */
 Deno.test({
    name: "GET取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        // 引数無しの時は#GETが返る
        assertEquals(get, route.GET());
        // アリの時はthisが返る
        assertEquals(true, route.equals(route.GET(get)));
    },
});

/**
 * PUT取得テスト
 */
 Deno.test({
    name: "PUT取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        // 引数無しの時は#PUTが返る
        assertEquals(put, route.PUT());
        // アリの時はthisが返る
        assertEquals(true, route.equals(route.PUT(put)));
    },
});

/**
 * POST取得テスト
 */
 Deno.test({
    name: "POST取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        // 引数無しの時は#POSTが返る
        assertEquals(pos, route.POST());
        // アリの時はthisが返る
        assertEquals(true, route.equals(route.POST(pos)));
    },
});

/**
 * DELETE取得テスト
 */
 Deno.test({
    name: "DELETE取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        // 引数無しの時は#DELETEが返る
        assertEquals(del, route.DELETE());
        // アリの時はthisが返る
        assertEquals(true, route.equals(route.DELETE(del)));
    },
});