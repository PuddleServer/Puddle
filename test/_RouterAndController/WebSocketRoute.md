# class WebSocketRoute

## Unit Test

### constructor
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const websocketRoute = new WebSocketRoute();
> ```
> 
> Implementation  
> `websocketRoute instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onopen()) === JSON.stringify(default_onopen)`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onmessage()) === JSON.stringify(default_onmessage)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
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
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute({
>   onopen:     event,
>   onclose:    event,
>   onmessage:  event,
>   onerror:    event    
> });
> ```
> 
> Implementation  
> `websocketRoute instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onopen()) === JSON.stringify(event)`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onclose()) === JSON.stringify(event)`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onmessage()) === JSON.stringify(event)`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onerror()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

---

### onopen(process?: WebSocketHandlerFunction)
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;WebSocketHandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute({onope: event});
> ```
> 
> Implementation  
> `JSON.stringify(websocketRoute.onopen()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | event | WebSocketHandlerFunction |
>
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute();
> websocketRoute.onopen(event);
> ```
> 
> Implementation  
> `websocketRoute.onopen(event) instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onopen()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

---

### onclose(process?: WebSocketHandlerFunction)
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;WebSocketHandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute({onope: event});
> ```
> 
> Implementation  
> `JSON.stringify(websocketRoute.onclose()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | event | WebSocketHandlerFunction |
>
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute();
> websocketRoute.onclose(event);
> ```
> 
> Implementation  
> `websocketRoute.onclose(event) instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onclose()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

---

### onmessage(process?: WebSocketHandlerFunction)
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;WebSocketHandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute({onope: event});
> ```
> 
> Implementation  
> `JSON.stringify(websocketRoute.onmessage()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | event | WebSocketHandlerFunction |
>
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute();
> websocketRoute.onmessage(event);
> ```
> 
> Implementation  
> `websocketRoute.onmessage(event) instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onmessage()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

---

### onerror(process?: WebSocketHandlerFunction)
> #### **Case 1**
> **Return**  
> Type  
> *&emsp;WebSocketHandlerFunction*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute({onope: event});
> ```
> 
> Implementation  
> `JSON.stringify(websocketRoute.onerror()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | event | WebSocketHandlerFunction |
>
> **Return**  
> Type  
> *&emsp;WebSocketRoute*  
>
> **Test**  
> Preparation
> ```typescript
> const event = (client: WebSocketClient)=>console.log(client);
> const websocketRoute = new WebSocketRoute();
> websocketRoute.onerror(event);
> ```
> 
> Implementation  
> `websocketRoute.onerror(event) instanceof WebSocketRoute`
> ```typescript
> true
> ```
> `JSON.stringify(websocketRoute.onerror()) === JSON.stringify(event)`
> ```typescript
> true
> ```
<br>