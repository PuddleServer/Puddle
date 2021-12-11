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

### get request()
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
> `JSON.stringify(sRequest.request) === JSON.stringify(request)`
> ```typescript
> true
> ```
> `sRequest.request instanceof Request`
> ```typescript
> true
> ```
<br>

---

### get url()
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
> `sRequest.url`
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
> `sRequest.getURL().toString()`
> ```typescript
> "http://example.com/index.html"
> ```
> `sRequest.getURL().valiable`
> ```typescript
> "value"
> ```
> `sRequest.getURL() instanceof DecodedURL`
> ```typescript
> "true"
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
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> headers.set('Cookie', 'name=HatsuneMiku;age=16;like=leek');
> const initData = {
>     method: `POST`,
>     headers: headers,
>     body: `Hello World`,
> }
> const request = new Request("http://example.com/index.html", initData);
> const sRequest = new SystemRequest(request, { key: `value` });
> const cookies = sRequest.getCookies();
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

### getCookie(key: string)
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
> const headers = new Headers();
> headers.append('Content-Type', 'text/html');
> headers.set('Cookie', 'name=HatsuneMiku;age=16;like=leek');
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

### get method()
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

### get headers()
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

### get body()
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

### async readBody(decodeURI: boolean)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | decodeURI | boolean |
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
>     }
> });
> ```
> 
> Implementation  
> `await sRequest.readBody()`
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
>     }
> });
> ```
> 
> Implementation
> `await sRequest.readBody(false)`
> ```typescript
> "%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF"
> ```
<br>

---