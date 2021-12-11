# class SystemRequest

## Unit Test

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | request | Request |
> | variables | {[key:string]:string;} |
> 
> **Return**  
> Type  
> *&emsp;SystemRequest*  
>
> **Test**  
> Preparation
> ```typescript
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `sRequest instanceof SystemRequest`
> ```typescript
> true
> ```
<br>

---

### request()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;Request*  
>
> **Test**  
> Preparation
> ```typescript
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `JSON.stringify(sRequest.request()) === JSON.stringify(request)`
> ```typescript
> true
> ```
<br>

---

### url()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const request = new Request("http://example.com/index.html");
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `JSON.stringify(sRequest.url())`
> ```typescript
> "http://example.com/index.html"
> ```
<br>

---

### getURL()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;DecodedURL*  
>
> **Test**  
> Preparation
> ```typescript
> const request = new Request("http://example.com/index.html");
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `JSON.stringify(sRequest.getURL())`
> ```typescript
> "http://example.com/index.html"
> ```
<br>

---

### getCookies()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;Record&lt;string, string&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> Deno.test({
>     name: "getCookies()",
>     fn(): void {
>         const headers = new Headers();
>         headers.append('Content-Type', 'text/html');
>         headers.set('Cookie', 'name=HatsuneMiku;age=16;like=leek');
>         const initData = {
>             method: `POST`,
>             headers: headers,
>             body: `Hello World`,
>         }
>         const request = new Request("http://example.com/index.html", initData);
>         const sRequest = new SystemRequest(request, { key: `value` });
>         const cookies = sRequest.getCookies();
>     }
> });
> ```
> 
> Implementation  
> `cookies["name"]`
> ```typescript
> "HatsuneMiku"
> ```
> `cookies["age"]`
> ```typescript
> "16"
> ```
> `cookies["like"]`
> ```typescript
> "leek"
> ```
<br>

---

### getCookie()
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | key | string |
>
> **Return**  
> Type  
> *&emsp;string | undefined*  
>
> **Test**  
> Preparation
> ```typescript
> Deno.test({
>     name: "getCookies()",
>     fn(): void {
>         const headers = new Headers();
>         headers.append('Content-Type', 'text/html');
>         headers.set('Cookie', 'name=HatsuneMiku;age=16;like=leek');
>         const initData = {
>             method: `POST`,
>             headers: headers,
>             body: `Hello World`,
>         }
>         const request = new Request("http://example.com/index.html", initData);
>         const sRequest = new SystemRequest(request, { key: `value` });
>     }
> });
> ```
> 
> Implementation  
> `sRequest.getCokkie("name")`
> ```typescript
> "HatsuneMiku"
> ```
> `sRequest.getCokkie("age")`
> ```typescript
> "16"
> ```
> `sRequest.getCokkie("like")`
> ```typescript
> "leek"
> ```
<br>

---

### method()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `sRequest.method`
> ```typescript
> "POST"
> ```
<br>

---

### headers()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> ```
> 
> Implementation  
> `JSON.stringify(sRequest.headers) === JSON.stringify(headers)`
> ```typescript
> true
> ```
<br>

---

### body()
> #### **Case 1**
>
> **Return**  
> Type  
> *&emsp;ReadableStream&lt;Uint8Array&gt; | null*  
>
> **Test**  
> Preparation
> ```typescript
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> const reader = sRequest.body!.getReader();
> reader.read().then(({ value }) => {
>     const body: string = new TextDecoder().decode(value);
> });
> ```
> 
> Implementation  
> `body`
> ```typescript
> "Hello World"
> ```
<br>

---

### readBody()
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | decodeURI | boolean=true |
>
> **Return**  
> Type  
> *&emsp;Promise&lt;string&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> Deno.test({
>     name: "readBody",
>     async fn(): Promise<void> {
>         const headers = new Headers();
>         headers.append('Content-Type', 'text/html');
>         const initData = {
>             method: `POST`,
>             headers: headers,
>             body: `%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF`,
>         }
>         const request = new Request("http://example.com/index.html", initData);
>         const sRequest = new SystemRequest(request, { key: `value` });
>         const body = await sRequest.readBody();
>     }
> });
> ```
> 
> Implementation  
> `body`
> ```typescript
> "初音ミク"
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | decodeURI | boolean=true |
>
> **Return**  
> Type  
> *&emsp;Promise&lt;string&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> Deno.test({
>     name: "readBody",
>     async fn(): Promise<void> {
>         const headers = new Headers();
>         headers.append('Content-Type', 'text/html');
>         const initData = {
>             method: `POST`,
>             headers: headers,
>             body: `%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF`,
>         }
>         const request = new Request("http://example.com/index.html", initData);
>         const sRequest = new SystemRequest(request, { key: `value` });
>         const body = await sRequest.readBody(false);
>     }
> });
> ```
> 
> Implementation  
> `body`
> ```typescript
> "%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF"
> ```
<br>

---