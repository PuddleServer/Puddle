/**
 * runテスト用のファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-23
 */
import { 
    System, Config, default_get, 
    default_error, redirect, SystemRequest, 
    SystemResponse, Route
} from "../../mod.ts"

const list1: {[key: string]: string} = {name: "りんご", color: "あか"};
const list2: {[key: string]: string | number} = {name: "john", age: 23, location: "Osaka"};
const list3: {[key: string]: string | number} = {drink: "fanta"};

// getテスト用
System.createRoute("./assets/default.css");
System.createRoute("./assets/index.html").URL("/", "/get","/🐈");

// postテスト用
System.createRoute("post_test").URL("/post")
.POST(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.readBody();

    response.setText(body);
    response.send();
});

// putテスト用
System.createRoute("put_test").URL("/put")
.PUT(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.readBody();
    
    const eles: string[] = body.split('&');
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

// patchテスト用
System.createRoute("patch_test").URL("/patch")
.PATCH(async function (request: SystemRequest, response: SystemResponse) {
    const body = await request.readBody();
    
    const f_obj = JSON.parse(body);
    list3[Object.keys(f_obj)[0]] = f_obj.drink;
    
    response.setText(JSON.stringify(list3));
    response.send();
});

// 認証テスト用
System.createRoute("./assets/auth.html").URL("/auth").AUTH("user", "pwd");

System.listen("./.env", (conf: Config)=>{
    console.log(`The server running on http://${conf.SERVER.HOSTNAME}:${conf.SERVER.PORT}`);
});
// System.listen("./config.json", (conf: Config)=>{
//     console.log(`The server running on http://${conf.SERVER.HOSTNAME}:${conf.SERVER.PORT}`);
// });