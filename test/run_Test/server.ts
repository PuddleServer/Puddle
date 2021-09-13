import { System, StartupConfig } from "../../System.ts"

System.createRoute("./assets/index.html").URL("/", "/トップ");
System.listen((conf: StartupConfig)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
