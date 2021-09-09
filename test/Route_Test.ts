/**
 * Router.ts Routeクラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-09
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route }            from "../mod.ts";


// Routeオブジェクトに必要なもの
const urls: string[] = ["/", "/top", "/Top", "/トップ"];
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
        const path1: string   = "/index.html";
        const path2: string   = "/index2.html";
        const urls1: string[] = ["/NEWtest", "/NEWtest2"];
        const route1: Route = new Route(path1, urls1, get, put, pos, del);
        const route2: Route = new Route(path2);
        
    },
});

/**
 * PATH取得テスト
 */
Deno.test({
    name: "PATH取得テスト",
    fn(): void {
        const path: string   = "/about.html";
        const route: Route = new Route(path);

        assertEquals(path, route.PATH(), "取得したpathに不正な変更があります．");
    },
});

/**
 * URL取得テスト
 */
Deno.test({
    name: "URL取得テスト",
    fn(): void {
        const path: string   = "/contact.html";
        const route: Route = new Route(path, urls, get, put, pos, del);
        
        // 引数無しの時は#URLが返る
        assertEquals(["/", "/top", "/Top", "/トップ", "/contact.html"], route.URL(), "取得したurlに不正な変更があります．");
        // アリの時はthisが返る
        assertEquals(["/URLtest"], route.URL("/URLtest").URL(), "オブジェクトを取得できていないか，取得したurlに不正な変更があります．");

    },
});

/**
 * GET取得テスト
 */
Deno.test({
    name: "GET取得テスト",
    fn(): void {
        const path: string   = "/get.html";
        const route: Route = new Route(path, ["/GETtest"], get, put, pos, del);

        // 引数無しの時は#GETが返る
        assertEquals(get, route.GET(), "取得したgetに不正な変更があります．");
        // アリの時はthisが返る
        assertEquals(get, route.GET(get).GET(), "オブジェクトを取得できていないか，取得したgetに不正な変更があります．");
    },
});

/**
 * PUT取得テスト
 */
Deno.test({
    name: "PUT取得テスト",
    fn(): void {
        const path: string   = "/put.html";
        const route: Route = new Route(path, ["/PUTtest"], get, put, pos, del);

        // 引数無しの時は#PUTが返る
        assertEquals(put, route.PUT(), "取得したputに不正な変更があります．");
        // アリの時はthisが返る
        assertEquals(put, route.PUT(put).PUT(), "オブジェクトを取得できていないか，取得したputに不正な変更があります．");
    },
});

/**
 * POST取得テスト
 */
Deno.test({
    name: "POST取得テスト",
    fn(): void {
        const path: string   = "/post.html";
        const route: Route = new Route(path, ["/POSTtest"], get, put, pos, del);

        // 引数無しの時は#POSTが返る
        assertEquals(pos, route.POST(), "取得したpostに不正な変更があります．");
        // アリの時はthisが返る
        assertEquals(pos, route.POST(pos).POST(), "オブジェクトを取得できていないか，取得したpostに不正な変更があります．");
    },
});

/**
 * DELETE取得テスト
 */
Deno.test({
    name: "DELETE取得テスト",
    fn(): void {
        const path: string   = "/delete.html";
        const route: Route = new Route(path, ["/DELETEtest"], get, put, pos, del);

        // 引数無しの時は#DELETEが返る
        assertEquals(del, route.DELETE(), "取得したdeleteに不正な変更があります．");
        // アリの時はthisが返る
        assertEquals(del, route.DELETE(del).DELETE(), "オブジェクトを取得できていないか，取得したdeleteに不正な変更があります．");
    },
});

/**
 * getUniqueUrlArrayテスト
 */
Deno.test({
    name: "getUniqueUrlArrayテスト",
    fn(): void {
        const path1: string   = "/unique1.html";
        const path2: string   = "/unique2.html";

        const route1: Route = new Route(path1, ["/UNIQUEtest1", "/UNIQUEtest2"], get, put, pos, del);
        assertEquals(["/UNIQUEtest1", "/UNIQUEtest2", "/unique1.html"], route1.URL());
        
        const route2: Route = new Route(path2, ["/UNIQUEtest1", "/UNIQUEtest3"], get, put, pos, del);
        assertEquals(["/UNIQUEtest3", "/unique2.html"], route2.URL());

    },
});
