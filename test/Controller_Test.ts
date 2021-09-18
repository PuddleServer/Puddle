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

const get= await runCommand("curl localhost:8080/");

Deno.test({
    name: "getテスト",
    fn():void {
        assertEquals(true, get.includes("./index.html を表示させるテスト。"), (get.includes("404"))? "ページが見つかりません。ルーティング関係を見直してください。" : "./run_test/server.tsを起動していますか?");
    }
});