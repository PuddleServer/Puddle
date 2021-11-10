/**
 * Logクラスと子クラスのテストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-25
 */

import { assertEquals } from "../mod_test.ts";
import { Log, RequestLog, ErrorLog, Logger } from "../../mod.ts";

Logger.setDirectoryPath("../log");
const log:      Log = new Log("Data1", "Data2");
const req_log:  Log = new RequestLog("Path1", "Method1", "/URL1", "Address1");
const err_log:  Log = new ErrorLog("error", "errMessage");
const war_log:  Log = new ErrorLog("warning", "warMessage");

/**
 * headerLineテスト
 */
Deno.test({
    name: "headerLineテスト",
    fn(): void {
        assertEquals("Date\n", log.headerLine, "Logのheaderを見直してください");
        assertEquals("Date,Path,Method,URL,Address\n", req_log.headerLine, "RequestLogのheaderを見直してください");
        assertEquals("Date,Type,Message\n", err_log.headerLine, "ErrorLogのTypeの指定とheaderを見直してください");
        assertEquals("Date,Type,Message\n", war_log.headerLine, "ErrorLogのTypeの指定とheaderを見直してください");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

/**
 * toStringテスト
 */
Deno.test({
    name: "toStringテスト",
    fn(): void {
        assertEquals(true, log.toString().includes("Data1,Data2"), "dataの記述を見直してください");
        assertEquals(true, req_log.toString().includes("Path1,Method1,/URL1,Address1"), "dataの記述を見直してください");
        assertEquals(true, err_log.toString().includes("error,errMessage"), "dataの記述を見直してください");
        assertEquals(true, war_log.toString().includes("warning,warMessage"), "dataの記述を見直してください");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "recordテスト",
    async fn() {
        await log.record();
        await req_log.record();
        await err_log.record();
        await war_log.record();
    },
    sanitizeResources: false,
    sanitizeOps: false,
});