import { System, Config, default_get, Route } from "../../mod.ts";

const ws = System.createRoute("./assets/webSocket.html").URL("/", "/トップ", "/ws");
ws.WebSocket();
Route.list.forEach(route => {
    console.log(route.PATH(), route.URL())
});
System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
