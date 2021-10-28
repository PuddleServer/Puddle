# How to Configure Routing
In the Puddle framework, a Route is created for each request, and the URL array to access it and the processing for each request method are set.

## How to create a Route
### Basic Specifications
`System.createRoute(routeName: string): Route`
```typescript
import { System, Route } from "https://github.com/PuddleServer/Puddle/raw/develop/mod.ts";

// The most basic method.
System.createRoute("example1");

// Create multiple Routes at once.
System.createRoutes("example2a", "example2b");

// Create an instance of the Route class.
new Route("example3");
```

### Create routes for static pages
You can create a route for a static page without specifying a controller by specifying the file path in the Route name.
```typescript
// It can be accessed at "http://localhost:8080/index.html".
System.createRoute("./index.html");
```
Also, by specifying a directory as the Route name, you can create a root for all the files under the directory.
```typescript
System.createRoute("./images/");

System.createRoutes("./styles/", "./scripts/");
```

### Delete a Route
`.deleteRoute(...routeName: string[])`
```typescript
System.createRoute("testRoute");

System.deleteRoute("testRoute");
```

## Configuring URLs to access the Route
You can set the URL by connecting the URL method to the created Route object.  
`.URL(...pathname: string[]): Route`
```typescript
System.createRoute("./index.html").URL("/", "/Top", "/top");

System.Route("./about.html").URL(["/About", "/about"]);

// In the Route method, you can call the Route you created.
System.Route("./works.html").URL("/Works", "/works");
```

## Set up processing for each request method
By connecting the request method to the Route object you have created, you can set up the process.
```typescript
import { System, redirect, SystemRequest, SystemResponse } from "https://github.com/PuddleServer/Puddle/raw/develop/mod.ts";

System.createRoute("login")
.POST((req: SystemRequest, res: SystemResponse) => {
    const body = req.readBody();

    // Login Authentication.

    res.redirect("http://localhost:8080/user_page");
});
```
You can also specify the response object directly.
```typescript
System.createRoute("HelloWorld!").URL("/greeting")
.GET({
    status: 200,
    headers: new Headers(),
    body: "Hello world !"
});
```
---

## How to create a Websocket Route
By connecting the WebSocket method to the Route you have created, you can perform Web socket communication.
```typescript
// Client: new WebSocket(`ws://localhost:8080/ws`);
System.createRoute("/ws").WebSocket();

System.Route("/ws").isWebSocket; // true
```
## Configuring Web Socket Events
Configure the processing for each event of the web socket.
```typescript
import { System, SystemRequest, WebSocketClient } from "https://github.com/PuddleServer/Puddle/raw/develop/mod.ts";
System.createRoute("/ws").WebSocket()
.onopen((req: SystemRequest, ws: WebSocketClient) => {
    console.log("Opening new connection.");
})
.onmessage((req: SystemRequest, ws: WebSocketClient, msg: string) => {
    ws.sendAll(msg);
})
.onclose((req: SystemRequest, ws: WebSocketClient) => {
    console.log("Connection closed.");
});
```

### About the WebSocketClient class methods

`ws: WebSocketClient`
- `ws.id: number`  
Client ID.
- `ws.author: WebSocket`  
Connected client.
- `ws.getTags(): string[]`  
Getter for tags tied to clients.
- `ws.setTags(...tags: string[])`  
Getter for tags tied to clients.
- `ws.removeTag(...tags: string[]): string[]`  
Removes the specified tag from the client.
- `ws.getAttribute(key: string): any`  
Getter of client attributes.
- `ws.setAttribute(key: string, value: any)`  
Setter of client attributes.
- `ws.removeAttribute(key: string): any`  
Removes the specified attribute from the client.
- `ws.getClientById(id: number): WebSocketClient`  
Get the client by client ID.
- `ws.getAllClients(): WebSocketClient[]`  
Get all connected clients.
- `ws.getClientsByTagName(...tags: string[]): WebSocketClient[]`  
Retrieve a client that contains all of the specified tags.
- `ws.send(message: string, clients?: WebSocketClient[])`  
 Send the message; If the second argument is not specified, it will be sent only to itself.
- `ws.sendAll(message: string, isNotMyself?: boolean)`  
Send the message to all connected clients; If true is specified for the second argument, it will not be sent to itself.