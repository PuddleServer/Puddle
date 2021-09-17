import { System, Config } from "../../System.ts"

System.createRoute("./assets/webSocket.html").URL("/", "/トップ");
System.createRoute("/ws").WebSocket();
System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
