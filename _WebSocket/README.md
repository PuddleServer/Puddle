# How to use WebSocket

## Configuring Web Socket Events
Configure the processing for each event of the web socket.
```typescript
import { System, SystemRequest, WebSocketClient } from "https://github.com/PuddleServer/Puddle/raw/v1.1.0-beta/mod.ts";
System.createRoute("/ws").WebSocket()
.onopen((ws: WebSocketClient) => {
    console.log("Opening new connection.");
})
.onmessage((ws: WebSocketClient) => {
    ws.sendAll(ws.message);
})
.onclose((ws: WebSocketClient) => {
    console.log("Connection closed.");
});
```


## About the WebSocketClient class methods

`ws: WebSocketClient`
- `ws.id: number`  
Client ID.
- `ws.webSocket: WebSocket`  
Connected client.
- `ws.url: string`  
The URL when the connection is opened.
- `ws.message: : string | ArrayBufferLike | Blob | ArrayBufferView`  
A message sent by a client.
- `ws.concurrentConnections: number`  
Number of clients currently connected.
- `ws.getURL(): DecodedURL`  
Get the decoded URL object.
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
- `ws.getClientsByAttribute(...attributes: {[key:string]:any;}[]): WebSocketClient[]`  
Retrieve a client that contains all of the specified tags.
- `ws.reply(message: string | ArrayBufferLike | Blob | ArrayBufferView)`  
Reply to the client who sent it.
- `ws.send(clients: WebSocketClient[], message: string)`  
Send the message.
- `ws.sendAll(message: string, isNotMyself?: boolean)`  
Send the message to all connected clients.
