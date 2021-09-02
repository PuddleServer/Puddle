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
        // write here
    },
});

/**
 * sizeテスト
 */
Deno.test({
    name: "sizeテスト",
    fn(): void {
        // write here
    },
});

/**
 * putテスト
 */
Deno.test({
    name: "putテスト",
    fn(): void {
        // write here
    },
});

/**
 * deleteテスト
 */
Deno.test({
    name: "deleteテスト",
    fn(): void {
        // write here
    },
});