/**
 * WebSocketRouter.tsのWebSocketRouteクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-12-09
 */

 import {
    assertEquals,
    assertStrictEquals
} from "../mod_test.ts";
import {
    WebSocketRoute,
    WebSocketClient,
    default_onopen,
    default_onmessage
} from "../../mod.ts";

Deno.test({
    name: "constructor1",
    fn(): void {
        const websocketRoute = new WebSocketRoute();

        assertEquals(websocketRoute instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onopen()), JSON.stringify(default_onopen));
        assertStrictEquals(JSON.stringify(websocketRoute.onmessage()), JSON.stringify(default_onmessage));
    },
});

Deno.test({
    name: "constructor2",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute({
            onopen:     event,
            onclose:    event,
            onmessage:  event,
            onerror:    event    
        });

        assertEquals(websocketRoute instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onopen()), JSON.stringify(event));
        assertStrictEquals(JSON.stringify(websocketRoute.onclose()), JSON.stringify(event));
        assertStrictEquals(JSON.stringify(websocketRoute.onmessage()), JSON.stringify(event));
        assertStrictEquals(JSON.stringify(websocketRoute.onerror()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onopen1",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute({onopen: event});

        assertStrictEquals(JSON.stringify(websocketRoute.onopen()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onopen2",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute();
        websocketRoute.onopen(event);

        assertEquals(websocketRoute.onopen(event) instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onopen()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onclose1",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute({onclose: event});

        assertStrictEquals(JSON.stringify(websocketRoute.onclose()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onclose2",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute();
        websocketRoute.onclose(event);        

        assertEquals(websocketRoute.onclose(event) instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onclose()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onmessage1",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute({onmessage: event}); 

        assertStrictEquals(JSON.stringify(websocketRoute.onmessage()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onmessage2",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute();
        websocketRoute.onmessage(event);

        assertEquals(websocketRoute.onmessage(event) instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onmessage()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onerror1",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute({onerror: event});        

        assertStrictEquals(JSON.stringify(websocketRoute.onerror()), JSON.stringify(event));
    },
});

Deno.test({
    name: "onerror2",
    fn(): void {
        const event = (client: WebSocketClient)=>console.log(client);
        const websocketRoute = new WebSocketRoute();
        websocketRoute.onerror(event);     

        assertEquals(websocketRoute.onerror(event) instanceof WebSocketRoute, true);
        assertStrictEquals(JSON.stringify(websocketRoute.onerror()), JSON.stringify(event));
    },
});
