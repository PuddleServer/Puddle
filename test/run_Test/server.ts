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

const list1: {[key: string]: string} = {name: "apple", color: "red"};
const list2: {[key: string]: string | number} = {name: "john", age: 23, location: "Osaka"};
const list3: {[key: string]: string | number} = {drink: "fanta"};

// getテスト用
System.createRoute("./assets/index.html").URL("/", "/get");

// postテスト用
System.createRoute("post_test").URL("/post")
.POST(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder = new TextDecoder('utf-8');
    const file_data = decoder.decode(await Deno.readAll(body));
    
    response.setText(file_data);
    response.send();
});

// putテスト用
System.createRoute("put_test").URL("/put")
.PUT(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder: TextDecoder = new TextDecoder('utf-8');
    const file_data: string = decoder.decode(await Deno.readAll(body));
    
    const eles: string[] = file_data.split('&');
    console.log(eles)
    for(let e of eles) {
        let keyOrCon = e.split('=');
        list1[keyOrCon[0]] = keyOrCon[1];
    }
    
    response.setText(JSON.stringify(list1));
    response.send();
});

// deleteテスト用
System.createRoute("delete_test").URL("/delete")
.DELETE(async function (request: SystemRequest, response: SystemResponse) {
    delete list2["location"];
    response.setText(JSON.stringify(list2));
    response.send();
});

System.createRoute("patch_test").URL("/patch")
.PATCH(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.body;
    const decoder: TextDecoder = new TextDecoder('utf-8');
    const file_data: string = decoder.decode(await Deno.readAll(body));
    
    const f_obj = JSON.parse(file_data);
    list3[Object.keys(f_obj)[0]] = f_obj.drink;
    
    response.setText(JSON.stringify(list3));
    response.send();
});

// 認証テスト用
System.createRoute("./assets/auth.html").URL("/auth").AUTH("user", "pwd");

System.listen(8080, (conf: Config)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
});
