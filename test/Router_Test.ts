/**
 * Router.tsのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-24
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { Route } from "../Router.ts";

/**
 * Route生成テスト
 */
Deno.test({
    name: "Route生成テスト",
    fn(): void {
        let func = function() {  }
        let route = new Route("PATH", ["URL1", "URL2"], func, func, func, func);

    },
});