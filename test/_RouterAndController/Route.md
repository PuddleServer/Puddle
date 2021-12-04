
# class Router
## Unit Test

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | PATH | string |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_route1");
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route instanceof Route`
> ```typescript
> true
> ```
> `route.PATH() === "test_route1"`
> ```typescript
> true
> ```
> `JSON.stringify(route.URL()) === JSON.stringify(["/test_route1"])`
> ```typescript
> true
> ```
> `route.GET().toString() === default_get().toString()`  
> ```typescript
> true
> ```
> `route.PUT().toString() === process_404.toString()`  
> ```typescript
> true
> ```
> `route.POST().toString() === process_404.toString()`  
> ```typescript
> true
> ```
> `route.DELETE().toString() === process_404.toString()`  
> ```typescript
> true
> ```
> `route.PATCH().toString() === process_404.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | PATH | string |
> | URL | string[] |
> | GET | null |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_route2", [], null);
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route instanceof Route`
> ```typescript
> true
> ```
> `route.GET().toString() === process_404.toString()`
> ```typescript
> true
> ```
<br>

### PATH()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PATH");
> ```
> 
> Implementation  
> `route.PATH()`
> ```typescript
> "test_PATH"
> ```
<br>

### URL(...urls: string[] | string[][])
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;string[]*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_URL1");
> ```
> 
> Implementation  
> `JSON.stringify(route.URL()) === JSON.stringify(["/test_URL1"])`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string[] |
> 
> **Return**  
> Type  
> *&emsp;string[]*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_URL2");
> const urls = ["/url1", "/url2"];
> route.URL(urls);
> ```
> 
> Implementation  
> `JSON.stringify(route.URL().sort()) === JSON.stringify(urls.sort())`
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> | arguments[1] | string |
> 
> **Return**  
> Type  
> *&emsp;string[]*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_URL3");
> const urls = ["/url3", "/url4"];
> route.URL(urls[0], urls[1]);
> ```
> 
> Implementation  
> `JSON.stringify(route.URL().sort()) === JSON.stringify(urls.sort())`
> ```typescript
> true
> ```
<br>

### GET(process?: HandlerFunction | Response)
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_GET1");
> ```
> 
> Implementation  
> `route.GET().toString() === default_get().toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | HandlerFunction |
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_GET2");
> const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
>    res.setText("Collect!"); 
> }
> route.GET(handler);
> ```
> 
> Implementation  
> `route.GET().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | Response |
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_GET3");
> const process = new Response();
> const handler = ()=>process;
> route.GET(process);
> ```
> 
> Implementation  
> `route.GET().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### PUT(process?: HandlerFunction | Response)
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PUT1");
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route.PUT().toString() === process_404.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | HandlerFunction |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PUT2");
> const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
>    res.setText("Collect!"); 
> }
> route.PUT(handler);
> ```
> 
> Implementation  
> `route.PUT().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | Response |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PUT3");
> const process = new Response();
> const handler = ()=>process;
> route.PUT(process);
> ```
> 
> Implementation  
> `route.PUT().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### POST(process?: HandlerFunction | Response)
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_POST1");
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route.POST().toString() === process_404.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | HandlerFunction |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_POST2");
> const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
>    res.setText("Collect!"); 
> }
> route.POST(handler);
> ```
> 
> Implementation  
> `route.POST().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | Response |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_POST3");
> const process = new Response();
> const handler = ()=>process;
> route.POST(process);
> ```
> 
> Implementation  
> `route.POST().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### DELETE(process?: HandlerFunction | Response)
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_DELETE1");
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route.DELETE().toString() === process_404.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | HandlerFunction |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_DELETE2");
> const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
>    res.setText("Collect!"); 
> }
> route.DELETE(handler);
> ```
> 
> Implementation  
> `route.DELETE().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | Response |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_DELETE3");
> const process = new Response();
> const handler = ()=>process;
> route.DELETE(process);
> ```
> 
> Implementation  
> `route.DELETE().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### PATCH(process?: HandlerFunction | Response)
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;HandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PATCH1");
> const process_404 = default_error(404, `Not Found. 見つかりません。`);
> ```
> 
> Implementation  
> `route.PATCH().toString() === process_404.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | HandlerFunction |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PATCH2");
> const handler: HandlerFunction = (req: SystemRequest, res: SystemResponse) => {
>    res.setText("Collect!"); 
> }
> route.PATCH(handler);
> ```
> 
> Implementation  
> `route.PATCH().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | process | Response |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_PATCH3");
> const process = new Response();
> const handler = ()=>process;
> route.PATCH(process);
> ```
> 
> Implementation  
> `route.PATCH().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### AUTH(...param: ( string | { [key:string]: string; })[] )
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;undefined*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_AUTH1");
> ```
> 
> Implementation  
> `route.AUTH()`  
> ```typescript
> undefined
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | hash | string |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_AUTH2");
> const hash = createHash("md5").update(`user_name:${route.PATH()}:password`).toString();
> route.AUTH(hash);
> ```
> 
> Implementation  
> `route.AUTH() && route.AUTH()[0] === hash`  
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | name | string |
> | password | string |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_AUTH3");
> const hash = createHash("md5").update(`user_name:${route.PATH()}:password`).toString();
> route.AUTH("user_name", "password");
> ```
> 
> Implementation  
> `route.AUTH() && route.AUTH()[0] === hash`   
> ```typescript
> true
> ```
<br>

> #### **Case 4**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> | arguments[1] | string |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const name = "user_name", password = "password";
> const route = new Route("test_AUTH4");
> const hash = createHash("md5").update(`${name}:${route.PATH()}:${password}`).toString();
> route.AUTH({name, password}, {hash});
> ```
> 
> Implementation  
> `route.AUTH() && route.AUTH()[0] === hash`   
> ```typescript
> true
> ```
> `route.AUTH() && route.AUTH()[1] === hash`   
> ```typescript
> true
> ```
<br>

### WebSocket(event?: WebSocketEvent)
> #### **Case 1**
> | name | Type |
> | :- | :- |
> | event | WebSocketEvent |
> 
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_WebSocket1");
> ```
> 
> Implementation  
> `route.WebSocket() instanceof WebSocketRoute`  
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> 
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const handler = (client: WebSocketClient)=>console.log(client);
> const route = new Route("test_WebSocket2");
> const ws = route.WebSocket({onerror: handler});
> ```
> 
> Implementation  
> `ws instanceof WebSocketRoute`  
> ```typescript
> true
> ```
> `ws.onerror().toString() === handler.toString()`  
> ```typescript
> true
> ```
<br>

### getUniqueUrlArray(urls: string[])
> #### **Case 1**
> | name | Type |
> | :- | :- |
> | urls | string[] |
> 
> **Return**  
> Type  
> *&emsp;string[]*  
>
> **Test**  
> Preparation
> ```typescript
> const uniqueUrlArray = ["/url1", "/url2"];
> const route = new Route("test_getUniqueUrlArray");
> route.URL(uniqueUrlArray);
> ```
> 
> Implementation  
> `route.getUniqueUrlArray(uniqueUrlArray)`  
> ```typescript
> []
> ```
<br>

### static isThePathInUse(path: string)
> #### **Case 1**
> | name | Type |
> | :- | :- |
> | path | string |
> 
> **Return**  
> Type  
> *&emsp;boolean*  
>
> **Test**  
> Preparation
> ```typescript
> const path = "test_isThePathInUse1";
> new Route(path);
> ```
> 
> Implementation  
> `Route.isThePathInUse(path)`  
> ```typescript
> true
> ```
> `Route.isThePathInUse("test_isThePathInUse2")`  
> ```typescript
> false
> ```
<br>

### static isTheUrlAlreadyInUse(...urls: string[])
> #### **Case 1**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> 
> **Return**  
> Type  
> *&emsp;boolean*  
>
> **Test**  
> Preparation
> ```typescript
> const url = "/test_isTheUrlAlreadyInUse1";
> new Route(path, [url]);
> ```
> 
> Implementation  
> `Route.isTheUrlAlreadyInUse(url)`  
> ```typescript
> true
> ```
> `Route.isTheUrlAlreadyInUse("/test_isTheUrlAlreadyInUse2")`  
> ```typescript
> false
> ```
<br>