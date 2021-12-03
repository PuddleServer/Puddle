
# class Router
## Unit Test

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | - | - |
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