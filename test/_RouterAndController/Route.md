
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