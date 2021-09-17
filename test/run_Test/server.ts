import { System, Config } from "../../System.ts"

System.createRoute("./assets/index.html").URL("/", "/トップ");
System.listen("./.env", (conf: Config)=>{
    console.log(`The server running on http://${conf.SERVER.HOSTNAME}:${conf.SERVER.PORT}`);
});
