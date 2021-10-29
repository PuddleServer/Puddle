/**
 * FileManagerの単体テスト
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-22
 */

import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { FileManager } from "../../mod.ts";

Deno.test({
    name: "ensureDir",
    async fn(): Promise<void> {
        FileManager.ensureDir("../run_Test/assets");
    },
});

Deno.test({
    name: "ensureDirSync",
    fn(): void {
        FileManager.ensureDirSync("../run_Test/assets");
    },
});

Deno.test({
    name: "ensureFile",
    async fn(): Promise<void> {
        FileManager.ensureFile("../run_Test/assets/test.json");
    },
});

Deno.test({
    name: "ensureFileSync",
    fn(): void {
        FileManager.ensureFileSync("../run_Test/assets/test.json");
    },
});

Deno.test({
    name: "read",
    async fn(): Promise<void> {
        const ans = `# 設定
SERVER.HOSTNAME=localhost
SERVER.PORT=8080
SERVER.LOG=./log
SERVER.URI=http://localhost`;
        assertEquals(ans, await FileManager.read("../run_Test/.env"));
    },
});

Deno.test({
    name: "write",
    async fn(): Promise<void> {
        await FileManager.write("../run_Test/writeTestFM", "neko");
        Deno.remove("../run_Test/writeTestFM");
    },
});

Deno.test({
    name: "readAndWrite",
    async fn(): Promise<void> {
        await FileManager.write("../run_Test/writeTestFM", "neko");
        assertEquals("neko", await FileManager.read("../run_Test/writeTestFM"));
        Deno.remove("../run_Test/writeTestFM");
    },
});
