
# class SystemResponse

## Unit Test

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | request | Request |
> 
> **Return**  
> Type  
> *&emsp;DecodedURL*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> ```
> 
> Implementation  
> `sResponse instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.status`  
> ```typescript
> 500
> ```
> `sResponse.isForceDownload`  
> ```typescript
> false
> ```
<br>

---

### get responded()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;boolean*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> let before, after;
> try {
>     before = sResponse.responded;
> } finally {
>     sResponse.send();
>     after = sResponse.responded;
> }
> ```
> 
> Implementation  
> `before`
> ```typescript
> false
> ```
> `after`  
> ```typescript
> true
> ```
<br>

---

### get response()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;Response*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> ```
> 
> Implementation  
> `sResponse.response instanceof Response`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> 
> **Return**  
> Type  
> *&emsp;Response*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const response  = new Response();
> sResponse.send(response);
> ```
> 
> Implementation  
> `sResponse.response instanceof Response`
> ```typescript
> true
> ```
> `sResponse.response === response`
> ```typescript
> true
> ```
<br>

---

### setType(type: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | type | string |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.setType("text/html");
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.headers.get('Content-Type')`
> ```typescript
> "text/html"
> ```
<br>

---

### setText(text: string | ReadableStream<Uint8Array> | Uint8Array, status: number = 200, filePath?: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | text | string |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.setText("Test");
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.body`
> ```typescript
> "Test"
> ```
> `sResponse.status`
> ```typescript
> 200
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | text | Uint8Array |
> | status | number |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const unit8     = new Uint8Array(10, 404);
> sResponse.setText(unit8);
> ```
> 
> Implementation  
> `sResponse.body === unit8`
> ```typescript
> true
> ```
> `sResponse.status`
> ```typescript
> 404
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | text | ReadableStream<Uint8Array> |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const unit8     = new Uint8Array(10);
> const RS_unit8  = new ReadableStream({
>     start(controller) {
>       controller.enqueue(unit8);
>       controller.close();
>     }
> });
> sResponse.setText(RS_unit8);
> ```
> 
> Implementation  
> `sResponse.body === RS_unit8`
> ```typescript
> true
> ```
<br>

---

### async setFile(filePath: string, status?: number)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> 
> **Return**  
> Type  
> *&emsp;Promise&lt;SystemResponse&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.setFile("../testdata/assets/index.html", 404);
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.body`
> ```typescript
> "<h1>Hello world!</h1>"
> ```
> `sResponse.status`
> ```typescript
> 404
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> 
> **Return**  
> Type  
> *&emsp;Promise&lt;SystemResponse&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const filePath = "../testdata/assets/PuddleLogo.png";
> const result    = sResponse.setFile(filePath);
> const RS_unit8  = (await fetch(filePath)).body;
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.body === RS_unit8`
> ```typescript
> true
> ```
> `sResponse.status`
> ```typescript
> 200
> ```
<br>

---

### preset(object: { [key: string]: any; })
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | object | { [key: string]: any; } |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.preset({test: "Hello world!"});
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `assignToVariables("{{test}}", this.#preset)`
> ```typescript
> "Hello world!"
> ```
<br>

---

### setCookie(cookie: Cookie)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | object | { [key: string]: any; } |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.setCookie({ name: "Space", value: "Cat" });
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `sResponse.headers.get("Set-Cookie")`
> ```typescript
> "Space=Cat"
> ```
<br>

---

### deleteCookie(name: string, attributes?: { path?: string; domain?: string } )
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | name | string |
> 
> **Return**  
> Type  
> *&emsp;SystemResponse*  
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const result    = sResponse.deleteCookie("Puddle");
> ```
> 
> Implementation  
> `result instanceof SystemResponse`
> ```typescript
> true
> ```
> `headers.get("Set-Cookie")`
> ```typescript
> "Puddle=; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
> ```
<br>

---

### send(response?: string | Response)
> #### **Case 1**
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> let before, after;
> try {
>   before = sResponse.responded;
> } finally {
>   sResponse.send();
>   after = sResponse.responded;
> }
> ```
> 
> Implementation  
> `before`
> ```typescript
> false
> ```
> `after`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | response | string |
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> let before, after;
> try {
>   before = sResponse.responded;
> } finally {
>   sResponse.send("Hello world!");
>   after = sResponse.responded;
> }
> ```
> 
> Implementation  
> `before`
> ```typescript
> false
> ```
> `after`
> ```typescript
> true
> ```
> `sResponse.body`
> ```typescript
> "Hello world!"
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | response | Response |
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> const response = new Response("Hello world!", { "status" : 200 });
> let before, after;
> try {
>   before = sResponse.responded;
> } finally {
>   sResponse.send(response);
>   after = sResponse.responded;
> }
> ```
> 
> Implementation  
> `before`
> ```typescript
> false
> ```
> `after`
> ```typescript
> true
> ```
> `sResponse.response === response`
> ```typescript
> true
> ```
<br>

---

### redirect(url: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | url | string |
>
> **Test**  
> Preparation
> ```typescript
> const request   = new Request("http://example.com");
> const sResponse = new SystemResponse(request);
> sResponse.redirect("http://example.com/test");
> ```
> 
> Implementation  
> `sResponse.status`
> ```typescript
> 302
> ```
> `sResponse.headers.get('Location')`
> ```typescript
> "http://example.com/test"
> ```
<br>