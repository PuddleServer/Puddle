/**
 * Loggerクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-25
 */

import { assertEquals } from "../mod_test.ts";
import { Logger, Log } from "../../mod.ts";


// ログファイルの名前
const fileName: string = "logger_test.log";

// 前回のテストファイルの削除
async function rmLogFile(): Promise<void> {
    try {
        await Deno.remove("../log/"+fileName);
    } catch (e) {
        console.log("No such old log file.");
    }
}

/**
 * setDirectoryPathテスト
 */
Deno.test({
    name: "setDirectoryPathテスト",
    fn(): void {
        assertEquals("./log", Logger.directoryPath);
        Logger.setDirectoryPath("../log");
        assertEquals("../log", Logger.directoryPath);
    }
});

/**
 * writeテスト
 */
Deno.test({
    name: "writeテスト",
    async fn(): Promise<void> {
        await rmLogFile();
        await Logger.write(fileName, "Test1\n").then(async()=>{
            assertEquals("Test1\n", await Deno.readTextFile("../log/"+fileName), "ファイルが指定のパスに存在していない可能性があります");
        });
    },
});

/**
 * readテスト
 */
Deno.test({
    name: "readテスト",
    async fn(): Promise<void> {
        await rmLogFile();
        await Logger.write(fileName, "Test2\n");
        assertEquals("Test2\n", await Logger.read(fileName), "ファイルが存在していないか、読み込み処理部分に不正箇所があります");
    },
});

/**
 * insertテスト
 */
Deno.test({
    name: "insertテスト",
    async fn(): Promise<void> {
        await rmLogFile();
        await Logger.insert(fileName, "Test3\n", "Header1\n");
        await Logger.insert(fileName, "Test4\n", "Header2\n");
        assertEquals("Test3\nTest4\n", await Logger.read(fileName), "ファイルが存在していないか、処理部分に不正があります");
    },
});
