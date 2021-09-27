/**
 * runテスト用のファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-23
 */
import { 
    System, Config, default_get, 
    default_error, redirect, SystemRequest, 
    SystemResponse
} from "../../mod.ts"

const defaultList: {[key: string]: string;} = {name: "apple", color: "red"}

// getテスト用
System.createRoute("./assets/index.html").URL("/", "/get")

// postテスト用
System.createRoute("./assets/post.html").URL("/post")
.POST(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder = new TextDecoder('utf-8');
    const file_data = decoder.decode(await Deno.readAll(body));
    
    response.setText(file_data);
    response.send();
});

// putテスト用
System.createRoute("./assets/put.html").URL("/put")
.PUT(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder: TextDecoder = new TextDecoder('utf-8');
    const file_data: string = decoder.decode(await Deno.readAll(body));
    
    const eles: string[] = file_data.split('&');
    for(let e of eles) {
        let keyOrCon = e.split('=');
        defaultList[keyOrCon[0]] = keyOrCon[1];
    }
    
    response.setText(JSON.stringify(defaultList));
    response.send();
});

// 認証テスト用
System.createRoute("./assets/auth.html").URL("/auth").AUTH("user", "pwd");

System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
