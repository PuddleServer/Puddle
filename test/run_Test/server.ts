import { System, StartupConfig } from "../../System.ts"

System.createRoute("./assets/index.html").URL("/", "/トップ");
System.listen(8080, (conf: StartupConfig)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
