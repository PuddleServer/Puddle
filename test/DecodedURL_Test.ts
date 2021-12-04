import { assertEquals } from "./mod_test.ts";
import { DecodedURL } from "../System.ts";

/**
 * constructor(case1)
 */
Deno.test({
    name: "constructor1",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
        
        assertEquals(url.toJSON(), `http://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB?%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80#hash`);
        assertEquals(url.toString(), `http://example.com/サンプル?параметр#hash`);
    },
});

/**
 * constructor(case2)
 */
Deno.test({
    name: "constructor2",
    fn(): void {
        const url = new DecodedURL("/サンプル?параметр#hash", "http://example.com");

        assertEquals(url.toJSON(), `http://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB?%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80#hash`);
        assertEquals(url.toString(), `http://example.com/サンプル?параметр#hash`);
    },
});

/**
 * hash
 */
Deno.test({
    name: "hash",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");

        assertEquals(url.hash, `#hash`)
    },
});

/**
 * host(case1)
 */
Deno.test({
    name: "host1",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");

        assertEquals(url.host, `example.com`);
    },
});

/**
 * host(case2)
 */
Deno.test({
    name: "host2",
    fn(): void {
        const url = new DecodedURL("http://example.com:4097/サンプル?параметр#hash");

        assertEquals(url.host, `example.com:4097`);
    },
});


/**
 * href
 */
Deno.test({
    name: "href",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
        
        assertEquals(url.href, `http://example.com/サンプル?параметр#hash`);
    },
});

/**
 * origin
 */
Deno.test({
    name: "origin",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.origin, `http://example.com`);
    },
});

/**
 * password
 */
Deno.test({
    name: "password",
    fn(): void {
        const url = new DecodedURL("http://ユーザー:パスワード@example.com/サンプル?параметр#hash");
  
        assertEquals(url.password, `パスワード`);
    },
});

/**
 * pathname
 */
Deno.test({
    name: "pathname",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.pathname, `/サンプル`);
    },
});

/**
 * port(case1)
 */
Deno.test({
    name: "port1",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.port, ``);
    },
});

/**
 * port(case2)
 */
Deno.test({
    name: "port2",
    fn(): void {
        const url = new DecodedURL("http://example.com:4097/サンプル?параметр#hash");
  
        assertEquals(url.port, `4097`);
    },
});

/**
 * protocol
 */
Deno.test({
    name: "protocol",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");

        assertEquals(url.protocol, `http:`);
    },
});

/**
 * search
 */
Deno.test({
    name: "search",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.search, `?параметр`);
    },
});

/**
 * searchParams
 */
Deno.test({
    name: "searchParams",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?名前=太郎&年齢=20");
  
        assertEquals(url.searchParams.toString(), `%E5%90%8D%E5%89%8D=%E5%A4%AA%E9%83%8E&%E5%B9%B4%E9%BD%A2=20`);
        assertEquals(url.searchParams.get("名前"), `太郎`);
        assertEquals(url.searchParams.has("年齢"), true)
    },
});

/**
 * username
 */
Deno.test({
    name: "username",
    fn(): void {
        const url = new DecodedURL("http://ユーザー:パスワード@example.com/サンプル?параметр#hash");
  
        assertEquals(url.username, `ユーザー`);
    },
});

/**
 * toString
 */
Deno.test({
    name: "toString",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.toString(), `http://example.com/サンプル?параметр#hash`);
    },
});

/**
 * toJSON
 */
Deno.test({
    name: "toJSON",
    fn(): void {
        const url = new DecodedURL("http://example.com/サンプル?параметр#hash");
  
        assertEquals(url.toJSON(), `http://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB?%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80#hash`);
    },
});
