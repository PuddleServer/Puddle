import {
    assertEquals,
    assertStrictEquals
} from "../mod_test.ts";
import {
    SystemRequest,
    DecodedURL
} from "../../mod.ts";

Deno.test({
    name: "constructor",
    fn(): void {

        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(sRequest instanceof SystemRequest, true);
    }
});

Deno.test({
    name: "request",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });

        assertStrictEquals(JSON.stringify(sRequest.request), JSON.stringify(request));
        assertEquals(sRequest.request instanceof Request, true);
    }
});

Deno.test({
    name: "url",
    fn(): void {
        const request = new Request("http://example.com/index.html");
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(sRequest.url, "http://example.com/index.html");
    }
});

Deno.test({
    name: "getURL",
    fn(): void {
        const request = new Request("http://example.com/index.html");
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(sRequest.getURL().toString(), "http://example.com/index.html");
        assertEquals(sRequest.getURL().valiable["key"], "value");
        assertEquals(sRequest.getURL() instanceof DecodedURL, true);
    }
});

Deno.test({
    name: "method",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(sRequest.method, "POST");
    }
});

Deno.test({
    name: "getCookies()",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        headers.set('Cookie', 'name=HatsuneMiku;age=16;like=leek');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });
        const cookies = sRequest.getCookies();
        
        assertEquals(cookies["name"], "HatsuneMiku");
        assertEquals(cookies["age"], "16");
        assertEquals(cookies["like"], "leek");
    }
});

Deno.test({
    name: "method",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(sRequest.method, "POST");
    }
});

Deno.test({
    name: "headers",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });
        assertEquals(JSON.stringify(sRequest.headers), JSON.stringify(headers));
    }
});

Deno.test({
    name: "body",
    fn(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `Hello World`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });
        const reader = sRequest.body!.getReader();
        reader.read().then(({ value }) => {
            const body: string = new TextDecoder().decode(value);
            
            assertEquals(body, "Hello World");
        });
    }
});

Deno.test({
    name: "readBody1",
    async fn(): Promise<void> {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });
        
        assertEquals(await sRequest.readBody(), "初音ミク");
    }
});

Deno.test({
    name: "readBody2",
    async fn(): Promise<void> {
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        const initData = {
            method: `POST`,
            headers: headers,
            body: `%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF`,
        }
        const request = new Request("http://example.com/index.html", initData);
        const sRequest = new SystemRequest(request, { key: `value` });

        assertEquals(await sRequest.readBody(false), "%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF");
    }
});