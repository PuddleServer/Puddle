/**
 * ConfigReaderの単体テスト
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2022-01-07
 */

import { ConfigReader } from "../../mod.ts";

import {
    assertEquals,
    assertStrictEquals
} from "../mod_test.ts";

Deno.test({
    name: "read1",
    async fn(): Promise<void> {
        const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
        const conf = await ConfigReader.read("../testdata/assets/conf.json");

        assertStrictEquals(JSON.stringify(conf), JSON.stringify(temp));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "read2",
    async fn(): Promise<void> {
        const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
        const conf = await ConfigReader.read("../testdata/assets/conf.env");

        assertStrictEquals(JSON.stringify(conf), JSON.stringify(temp));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "decodeEnv",
    fn(): void {
        const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
        const data = `SERVER.HOST=localhost\nSERVER.PORT=8080`;

        assertStrictEquals(JSON.stringify(ConfigReader.decodeEnv(data)), JSON.stringify(temp));
    },
});
