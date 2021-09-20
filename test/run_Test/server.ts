import { 
    System, Config, default_get, 
    default_error, redirect, ServerRequest, 
    SystemResponse
} from "../../mod.ts"

System.createRoute("./assets/index.html").URL("/", "/get");

System.createRoute("./assets/post.html").URL("/post")
.POST(async function (request: ServerRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder = new TextDecoder('utf-8');
    const file_data = decoder.decode(await Deno.readAll(body));
    
    response.setText(file_data);
    response.send();
});

System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
