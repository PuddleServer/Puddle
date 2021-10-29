/**
 * WebSocketRouter.tsのWebSocketRouteクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-01
 */

import { assertEquals, assertNotEquals }        from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { WebSocketRoute, default_onopen, default_onmessage } from "../../mod.ts";

let wsr: WebSocketRoute;
let wsr2: WebSocketRoute;

Deno.test({
    name: "wsRoute生成",
    fn(): void {
        wsr = new WebSocketRoute({
            onopen: function (): string {
                return "open";
            },
            onclose: function (): string {
                return "close";
            },
            onmessage: function (): string {
                return "message"
            },
        });

        wsr2 = new WebSocketRoute();

    },
});

Deno.test({
    name: "onopenテスト",
    fn(): void {
        assertEquals("open", wsr.onopen()());
        assertEquals(default_onopen.toString(), wsr2.onopen().toString());
    },
});

Deno.test({
    name: "oncloseテスト",
    fn(): void {
        assertEquals("close", wsr.onclose()());
        assertEquals("function () { }", wsr2.onclose().toString())
    },
});

Deno.test({
    name: "onmessageテスト",
    fn(): void {
        assertEquals("message", wsr.onmessage()());
        assertEquals(default_onmessage.toString(), wsr2.onmessage().toString());
    },
});

