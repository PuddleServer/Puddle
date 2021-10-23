/**
 * PuddleJsonの単体テスト
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-22
 */

import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { PuddleJSON } from "../mod.ts";

let USERS: PuddleJSON[] = [];

try {
    await Deno.remove("./run_Test/assets/test.json");
} catch (e) {
}


Deno.test({
    name: "USE",
    fn(): void {
        const users = PuddleJSON.USE("./run_test/assets/test.json", {
            id: ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
            name: ["NOT NULL"],
            age: []
        });

        USERS.push(users);
    },
});

Deno.test({
    name: "INNSERT",
    async fn(): Promise<void> {
        USERS[0].INSERT({ name: "Steve", age: 20 });
        const ans = `[
{"name":"Steve","age":20,"id":1}
]`

        assertEquals(ans, await Deno.readTextFile("./run_Test/assets/test.json"))

    },
});
