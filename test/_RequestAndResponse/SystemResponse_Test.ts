import {
    assertEquals,
    assertStrictEquals
} from "../mod_test.ts";
import {
    SystemRequest,
    SystemResponse,
    DecodedURL,
    assignToVariables
} from "../../mod.ts";

Deno.test({
    name: "constructor",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);

        assertEquals(sResponse instanceof SystemResponse, true);
        assertEquals(sResponse.status, 500);
        assertEquals(sResponse.isForceDownload, false);
    },
});

Deno.test({
    name: "responded",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        let before, after;
        try {
            before = sResponse.responded;
        } finally {
            sResponse.send();
            after = sResponse.responded;
        }

        assertEquals(before, false);
        assertEquals(after, true);
    },
});

Deno.test({
    name: "response1",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);

        assertEquals(sResponse.response instanceof Response, true);
    },
});

Deno.test({
    name: "response2",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const response  = new Response();
        sResponse.send(response);

        assertEquals(sResponse.response instanceof Response, true);
        assertStrictEquals(sResponse.response, response);
    },
});

Deno.test({
    name: "setType",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = sResponse.setType("text/html");

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.headers.get('Content-Type'), "text/html");
    },
});

Deno.test({
    name: "setText1",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = sResponse.setText("Test");

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.body, "Test");
        assertEquals(sResponse.status, 200);
    },
});

Deno.test({
    name: "setText2",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const unit8     = new Uint8Array(10);
        sResponse.setText(unit8, 404);

        assertEquals(sResponse.body, unit8);
        assertEquals(sResponse.status, 404);
    },
});

Deno.test({
    name: "setText3",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const unit8     = new Uint8Array(10);
        const RS_unit8  = new ReadableStream({
            start(controller) {
            controller.enqueue(unit8);
            controller.close();
            }
        });
        sResponse.setText(RS_unit8);

        assertEquals(sResponse.body, RS_unit8);
    },
});

Deno.test({
    name: "setFile1",
    async fn(): Promise<void> {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = await sResponse.setFile("../testdata/assets/index.html", 404);

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.body, "<h1>Hello world!</h1>");
        assertEquals(sResponse.status, 404);
    },
});

Deno.test({
    name: "preset",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = sResponse.preset({test: "Hello world!"});
        sResponse.setText("{{test}}");

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.body, "Hello world!");
    },
});

Deno.test({
    name: "setCookie",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = sResponse.setCookie({ name: "Space", value: "Cat" });

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.headers.get("Set-Cookie"), "Space=Cat");
    },
});

Deno.test({
    name: "deleteCookie",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const result    = sResponse.deleteCookie("Puddle");

        assertEquals(result instanceof SystemResponse, true);
        assertEquals(sResponse.headers.get("Set-Cookie"), "Puddle=; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    },
});

Deno.test({
    name: "send1",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        let before, after;
        try {
            before = sResponse.responded;
        } finally {
            sResponse.send();
            after = sResponse.responded;
        }

        assertEquals(before, false);
        assertEquals(after, true);
    },
});

Deno.test({
    name: "send2",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        let before, after;
        try {
            before = sResponse.responded;
        } finally {
            sResponse.send("Hello world!");
            after = sResponse.responded;
        }

        assertEquals(before, false);
        assertEquals(after, true);
        assertEquals(sResponse.body, "Hello world!");
    },
});

Deno.test({
    name: "send3",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        const response = new Response("Hello world!", { "status" : 200 });
        let before, after;
        try {
            before = sResponse.responded;
        } finally {
            sResponse.send(response);
            after = sResponse.responded;
        }

        assertEquals(before, false);
        assertEquals(after, true);
        assertStrictEquals(sResponse.response, response);
    },
});

Deno.test({
    name: "redirect",
    fn(): void {
        const request   = new Request("http://example.com");
        const sResponse = new SystemResponse(request);
        sResponse.redirect("http://example.com/test");

        assertEquals(sResponse.status, 302);
        assertEquals(sResponse.headers.get('Location'), "http://example.com/test");
    },
});
