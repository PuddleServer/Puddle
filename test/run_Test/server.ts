import { System, Config, default_get, default_error, redirect } from "../../mod.ts"

System.createRoute("./assets/index.html").URL("/", "/get").GET(redirect("http://localhost:8080/post"));
System.createRoute("./assets/post.html").URL("/post")

System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
