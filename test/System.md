
# class System
## Unit Test

### static get JSON()
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;typeof PuddleJSON*  
>
> **Test**  
> Implementation  
> `System.JSON === PuddleJSON`
> ```typescript
> true
> ```
<br>

### static getModule(key: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | key | string |
> 
> **Return**  
> Type  
> *&emsp;any*  
>
> **Test**  
> Preparation
> ```typescript 
> const module = { result: "OK" };
> System.modules.set("test", module);
> ```
> 
> Implementation  
> `System.getModule("test") === module`
> ```typescript
> true
> ```
> `{result: "OK"} === module`  
> ```typescript
> false
> ```
<br>

### static setModule(key: string, value: any)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | key | string |
> | value | any |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript 
> const module = { result: "OK" };
> System.setModule("test", module);
> ```
> 
> Implementation  
> `System.modules.get("test") === module`
> ```typescript
> true
> ```
<br>

### static setModules(modules: { [key: string]: any; })
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | modules | { [key: string]: any; } |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript 
> const modules = { module1: { result: 1 }, module2: { result: 2 } };
> System.setModules(modules);
> ```
> 
> Implementation  
> `System.modules.get("module1") === modules.module1`
> ```typescript
> true
> ```
> `System.modules.get("module2") === modules.module2`
> ```typescript
> true
> ```
<br>

### static deleteModule(...key: string[])
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | key | string |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript 
> const module1 = { result: 1 };
> System.modules.set("module1", module1)
> .set("module2", { result: 2 })
> .set("module3", { result: 3 });
> 
> System.deleteModule("module2", "module3");
> ```
> 
> Implementation  
> `System.modules.get("module1") === module1`
> ```typescript
> true
> ```
> 
> `System.modules.get("module2") === undefined`
> ```typescript
> true
> ```
> 
> `System.modules.get("module3") === undefined`
> ```typescript
> true
> ```
<br>

### static createRoute(pathOrRouteOption: string | RouteOption)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | pathOrRouteOption | string |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const test_route = System.createRoute("test_route1");
> ```
> 
> Implementation  
> `test_route instanceof Route`
> ```typescript
> true
> ```
> `test_route.URL()`
> ```typescript
> ["/test_route1"]
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | pathOrRouteOption | RouteOption |
> 
> **Return**  
> Type  
> *&emsp;Route*  
>
> **Test**  
> Preparation
> ```typescript
> const test_route = System.createRoute({PATH: "test_route2"});
> ```
> 
> Implementation  
> `test_route instanceof Route`
> ```typescript
> true
> ```
> `test_route.URL()`
> ```typescript
> ["/test_route2"]
> ```
<br>

### static createRoutes(...pathsOrRouteOptions: (string | RouteOption)[])
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> | arguments[1] | RouteOption |
> 
> **Return**  
> Type  
> *&emsp;System*  
>
> **Test**  
> Preparation
> ```typescript
> System.createRoutes("test_route3.test", {PATH: "test_route4"});
> const path_list = Route.list.map(route=>route.PATH());
> ```
> 
> Implementation  
> `path_list.includes("test_route3.test")`
> ```typescript
> true
> ```
> `path_list.includes("test_route4")`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> 
> **Return**  
> Type  
> *&emsp;System*  
>
> **Test**  
> Preparation
> ```typescript
> System.createRoutes("./testdata/assets/*");
> const path_list = Route.list.map(route=>route.PATH());
> ```
> 
> Implementation  
> `path_list.includes("./system_test/assets/script.js")`
> ```typescript
> true
> ```
> `path_list.includes("./system_test/assets/style.css")`
> ```typescript
> true
> ```
<br>

### static deleteRoute(...path: string[])
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript
> new Route("test_route_tmp");
> System.deleteRoute("test_route_tmp")
> const path_list = Route.list.map(route=>route.PATH());
> ```
> 
> Implementation  
> `path_list.includes("test_route_tmp")`
> ```typescript
> false
> ```
<br>

### static deleteRoutes(paths: string[])
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | paths | string[] |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript
> const tmp_list = ["test_route_tmp1", "test_route_tmp2"];
> new Route(tmp_list[0]);
> new Route(tmp_list[1]);
> System.deleteRoutes(tmp_list)
> const path_list = Route.list.map(route=>route.PATH());
> ```
> 
> Implementation  
> `path_list.includes(tmp_list[0])`
> ```typescript
> false
> ```
> `path_list.includes(tmp_list[1])`
> ```typescript
> false
> ```
<br>

### static Route(path: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | path | string |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript
> const route = new Route("test_route5");
> ```
> 
> Implementation  
> `System.Route("test_route5") === route`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | path | string |
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript
> const route = System.Route("test_route6")
> ```
> 
> Implementation  
> `route instanceof Route`
> ```typescript
> true
> ```
> `route.PATH()`
> ```typescript
> "test_route6"
> ```
<br>

### static get AUTH()
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;AuthType*  
>
> **Test**  
> Preparation
> ```typescript
> const auth = System.AUTH;
> ```
> 
> Implementation  
> `"GOOGLE" in auth && typeof auth.GOOGLE === "function"`
> ```typescript
> true
> ```
<br>

### static async listen(option: number | string | Deno.ListenOptions, startFunction?: Function)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | option | number |
> 
> **Return**  
> Type  
> *&emsp;Promise<void>*  
>
> **Test**  
> Preparation
> ```typescript
> let error, host;
> try {
>     await System.listen(8080, (conf: Config)=>host=`${conf.hostname}:${conf.port}`);
>     System.server.close();
> } catch (e) {
>     error = e;
> }
> ```
> 
> Implementation  
> `Boolean(error)`
> ```typescript
> false
> ```
> `host`
> ```typescript
> "localhost:8080"
> ```
<br>

### static async listenTLS(option: string | Deno.ListenTlsOptions, startFunction?: Function)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | option | Deno.ListenOptions |
> 
> **Return**  
> Type  
> *&emsp;Promise<void>*  
>
> **Test**  
> Preparation
> ```typescript
> const option = {
>   port:       8080,
>   certFile:   "./testdata/tls/localhost.crt",
>   keyFile:    "./testdata/tls/localhost.key"
> }
> let error, host;
> try {
>     await System.listenTLS(option, (conf: Config)=>host=`${conf.hostname}:${conf.port}`);
>     System.server.close();
> } catch (e) {
>     error = e;
> }
> ```
> 
> Implementation  
> `Boolean(error)`
> ```typescript
> false
> ```
> `host`
> ```typescript
> "localhost:8080"
> ```
<br>

### static close()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;void*  
>
> **Test**  
> Preparation
> ```typescript
> const handler = () => new Response();
> System.server = new Server({ handler });
> let check_before: null | boolean = null;
> let check_after: null | boolean = null;
> try {
>   check_before = System.server.closed;
> } finally {
>   System.close();
>   check_after = System.server.closed;
> }
> ```
> 
> Implementation  
> `check_before`
> ```typescript
> false
> ```
> `check_after`
> ```typescript
> true
> ```
<br>