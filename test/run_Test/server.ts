import { System, Config, default_get, default_error, redirect } from "../../mod.ts"

System.createRoute("./assets/index.html").URL("/", "/get").GET(default_get);

System.listen((conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
