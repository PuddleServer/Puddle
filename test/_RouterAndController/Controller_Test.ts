/**
 * run_Testを使用してcontrolの動作が正しくされているか見るファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-08
 */

 import { assertEquals }     from "../mod_test.ts";

/**
 * シェル操作関数
 * @param c コマンド
 * @returns 標準出力
 */
async function runCommand(c: string):Promise<string> {
    const command: string[] = c.split(" ");
    // console.log(command)
    const cmd = Deno.run({
        cmd: command,
        stdout: "piped",
        stderr: "piped"
    });
    const output = await cmd.output();
    const outStr = new TextDecoder().decode(output);
    
    cmd.close();
    return outStr;
}

const get    :string = await runCommand("curl localhost:8080/");
const post   :string = await runCommand(`curl -X POST -H "Content-Type:application/json" -d {"Name":"${encodeURIComponent("デノ太郎")}"} localhost:8080/post`);
const put    :string = await runCommand(`curl -X PUT -d color=${encodeURIComponent("みどり")}&location=${encodeURIComponent("日本")} localhost:8080/put`);
const del    :string = await runCommand("curl -X DELETE localhost:8080/delete");
const patch  :string = await runCommand(`curl -X PATCH "Content-Type:application/json" -d {"drink":"${encodeURIComponent("コーラ")}"} localhost:8080/patch`);
const auth   :string = await runCommand(`curl --anyauth --user user:pwd localhost:8080/auth`);

Deno.test({
    name: "getテスト",
    fn(): void {
        assertEquals(true, get.includes("./index.html を表示させるテスト。"), (get.includes("404"))? "ページが見つかりません。ルーティング関係を見直してください。" : "./run_test/testServer.tsを起動していますか?");
    }
});

Deno.test({
    name: "postテスト",
    fn(): void {
        assertEquals("デノ太郎", JSON.parse(post).Name, "postしたデータが不正であるか、正しい処理がされていません。");
    }
});

Deno.test({
    name: "putテスト",
    fn(): void {
        assertEquals({name: "りんご", color: "みどり", location: "日本"}, JSON.parse(put.replace(/'/g,"")), "putしたデータが不正であるか、正しい処理がされていません。");
    }
});

Deno.test({
    name: "deleteテスト",
    fn(): void {
        assertEquals({"name":"john","age":23}, JSON.parse(del.replace(/'/g,"")), "deleteしたデータが不正であるか、正しい処理がされていません。");
    }
});

Deno.test({
    name: "patchテスト",
    fn(): void {
        assertEquals("コーラ", JSON.parse(patch).drink, "patchしたデータが不正であるか、正しい処理がされていません。" );
    }
});

/**
 * 認証テスト
 */
Deno.test({
    name: "authテスト",
    fn(): void {
        assertEquals(true, auth.includes("認証成功"), "認証処理に問題があるか、ユーザ名・パスワードが変更されています。");
    }
});
