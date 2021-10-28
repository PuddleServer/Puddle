# SystemRequest and SystemResponse
Description of the SystemRequest and SystemResponse objects.
```typescript
System.createRoute("ExampleRoute").URL("/example")
.GET(async (req: SystemRequest, res: SystemResponse) => {
    const url: DecodedURL = req.getURL();
    await res.setFile("./example.html");
})
.POST(async (req: SystemRequest, res: SystemResponse) => {
    const body: string = await req.readBody();
    res.setText(`Collect.\n${body}`);
});
```
You can return a response without using SystemRequest and SystemResponse.
```typescript
const response: Response = { 200, new Headers(), "Collect." };

System.createRoute("ExampleRoute1").URL("/example1")
.GET(response);

System.createRoute("ExampleRoute2").URL("/example2")
.GET(async (req: SystemRequest) => {
    return response;
});
```

## SystemRequest
An object for retrieving data contained in a request from a client.
### Methods
`req: SystemRequest`
- `req.request: Request`  
The standard Request object.
- `req.headers: Headers`  
Headers object.
    - `.get(name: string)`
- `req.url: string`  
The URL that was accessed.
- `req.variables`  
The variable name and its value included in the pathname of the URL.  
( Variables are defined by prefixing them with a colon. `/user/:id/info` )
- `req.getURL(): DecodedURL`  
Decoded URL object
    - `.hash`
    - `.host`
    - `.hostname`
    - `.href`
    - `.origin`
    - `.pathname`
    - `.protocol`
    - `.search`
    - `.searchParams`
    - `.variable` Get the name of the variable included in pathname and its value.  
    (Variables are defined by prefixing them with a colon.)
- `await req.readBody(): string`  
Data sent by the client via POST request, etc.
- `req.getCookie(key: string): string | undefined`  
The cookie given to the client
## SystemResponse
An object to set the response to be returned to the client.
### Methods
`res: SystemResponse`
- `res.headers: Headers`  
Headers object.
    - `.append(name: string, value: string)`
    - `.set(name: string, value: string)`
- `res.isForceDownload: boolean`  
Whether to let the client download the Response text or file.  
Default setting is `false`.
- `res.setType(type: string)`  
Set the MIME type.
- `res.setText(text: string, status?: number, statusText?: string)`  
Set the response body to a string.
- `await res.setFile(filePath: string, status?: number, statusText?: string)`  
Set the file in the response.
- `res.preset(object: { key: any })`  
Set the text to be set in the response and the content to be assigned to the variables described in the file in an associative array format.
- `res.setCookie(cookie: Cookie)`  
Give the client a cookie.
- `res.deleteCookie(key: string)`  
Delete the client's cookies.
- `res.send()`  
Send the response to the client.  
`return` does the same thing.
- `res.redirect(url: string)`  
Redirect the client.