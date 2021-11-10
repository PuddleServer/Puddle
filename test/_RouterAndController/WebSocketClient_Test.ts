/**
 * WebSocketRouter.tsのWebSocketRouteクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-01
 */

import { assertEquals, assertNotEquals }        from "../mod_test.ts";
import { WebSocketClient, WebSocket } from "../../mod.ts";

Deno.test({
    name: "testing example",
    fn(): void {
        let wsc = new WebSocketClient(WebSocket, ["tag"]);
    },
});
