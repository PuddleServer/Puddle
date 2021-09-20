/**
 * run_Testを使用してcontrolの動作が正しくされているか見るファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-17
 */

 import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";

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
const post   :string = await runCommand(`curl -X POST -H "Content-Type:application/json" -d {"Name":"deno_taro"} localhost:8080/post`);
// const put    :string = await runCommand();
// const delete :string = await runCommand();
// const patch  :string = await runCommand();

Deno.test({
    name: "getテスト",
    fn(): void {
        assertEquals(true, get.includes("./index.html を表示させるテスト。"), (get.includes("404"))? "ページが見つかりません。ルーティング関係を見直してください。" : "./run_test/server.tsを起動していますか?");
    }
});


Deno.test({
    name: "postテスト",
    fn(): void {
        assertEquals("deno_taro", JSON.parse(post).Name, "postしたデータが不正であるか、正しい処理がされていません。")
    }
});