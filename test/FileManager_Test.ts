/**
 * FileManagerの単体テスト
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-22
 */

import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { FileManager } from "../mod.ts";

Deno.test({
    name: "ensureDir",
    async fn(): Promise<void> {
        FileManager.ensureDir("run_test/assets");
    },
});

Deno.test({
    name: "ensureDirSync",
    fn(): void {
        FileManager.ensureDirSync("run_test/assets");
    },
});

Deno.test({
    name: "ensureFile",
    async fn(): Promise<void> {
        FileManager.ensureFile("run_test/assets/test.json");
    },
});

Deno.test({
    name: "ensureFileSync",
    fn(): void {
        FileManager.ensureFileSync("run_test/assets/test.json");
    },
});

Deno.test({
    name: "read",
    async fn(): Promise<void> {
        const ans = `# サーバー設定
SERVER.HOSTNAME=localhost #ローカルホスト
SERVER.PORT=8080 #ポート番号`;
        assertEquals(ans, await FileManager.read("run_test/.env"));
    },
});

Deno.test({
    name: "write",
    async fn(): Promise<void> {
        await FileManager.write("run_test/writeTestFM", "neko");
        Deno.remove("run_test/writeTestFM");
    },
});

Deno.test({
    name: "readAndWrite",
    async fn(): Promise<void> {
        await FileManager.write("run_test/writeTestFM", "neko");
        assertEquals("neko", await FileManager.read("run_test/writeTestFM"));
        Deno.remove("run_test/writeTestFM");
    },
});
