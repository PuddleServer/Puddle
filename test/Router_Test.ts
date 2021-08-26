/**
 * Router.tsのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-24
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route }            from "../Router.ts";

// Routeオブジェクトに必要なもの
const path: String   = "index.html";
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
        const route: Route = new Route(path, urls, get, put, pos, del);

    },
});

/**
 * PATH取得テスト
 */
Deno.test({
    name: "PATH取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        assertEquals(path, route.PATH());
    },
});

/**
 * URL取得テスト
 */
Deno.test({
    name: "URL取得テスト",
    fn(): void {
        const route: Route = new Route(path, urls, get, put, pos, del);

        // 引数無しの時は#URLが返る
        assertEquals(urls, route.URL());
        // アリの時はthisが返る
        assertEquals(route, route.URL("/", "/top", "/Top", "/トップ"));
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
        assertEquals(route, route.GET(get));
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
        assertEquals(get, route.PUT());
        // アリの時はthisが返る
        assertEquals(route, route.PUT(put));
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
        assertEquals(get, route.POST());
        // アリの時はthisが返る
        assertEquals(route, route.POST(pos));
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
        assertEquals(get, route.DELETE());
        // アリの時はthisが返る
        assertEquals(route, route.DELETE(del));
    },
});