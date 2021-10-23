/**
 * PuddleJsonの単体テスト
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-10-22
 */

import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { PuddleJSON } from "../mod.ts";

let PJ: PuddleJSON[] = [];

// テスト用のファイルが以前に作成されていたら消す
try {
    await Deno.remove("./run_Test/assets/test.json");
    await Deno.remove("./run_Test/assets/test2.json");
} catch (e) {
}


Deno.test({
    name: "USE",
    fn(): void {
        const users = PuddleJSON.USE("./run_Test/assets/test.json", {
            id: ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
            name: ["NOT NULL"],
            age: [],
            psy: ["UNIQUE"]
        });

        const visualArts = PuddleJSON.USE("./run_Test/assets/test2.json", {
            id: ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
            name: ["NOT NULL"],
            game: [],
        });
        
        PJ.push(users);
        PJ.push(visualArts);
    },
});

Deno.test({
    name: "INNSERT",
    async fn(): Promise<void> {
        PJ[0].INSERT({ name: "Steve", age: 20, psy: "ironbody" });
        const ans = 
`[
{"name":"Steve","age":20,"psy":"ironbody","id":1}
]`
        
        assertEquals(ans, await Deno.readTextFile("./run_Test/assets/test.json"), "データ挿入は正常ですか？");
        
        assertThrows((): void => { // UNIQUE
            PJ[0].INSERT({ name: "taro", psy: "ironbody" });

        },
            Error,
            `\n[PuddleJSON]\nSchema error. There is a duplicate element in the "psy" field.\nスキーマエラーです。"psy"に重複があります。`,
        );
        
        assertThrows((): void => { // NOT NULL
            PJ[0].INSERT({ age: 20 });

        },
            Error,
            `\n[PuddleJSON]\nSchema error. "name" has null object.\nスキーマエラーです。"name"はNULLオブジェクトを持っています。`,
        );

        PJ[1].INSERT({ name: "Yukito Kunisaki", game: "Air"   });
        PJ[1].INSERT({ name: "Misuzu Kamio",    game: "Air"   });
        PJ[1].INSERT({ name: "Kano Kirishima",  game: "Air"   });
        PJ[1].INSERT({ name: "Minagi Tono",     game: "Air"   });
        PJ[1].INSERT({ name: "Yuichi Aizawa",   game: "Kanon" });
        PJ[1].INSERT({ name: "Nayuki Minase",   game: "Kanon" });
        PJ[1].INSERT({ name: "Makoto Sawatari", game: "Kanon" });
        PJ[1].INSERT({ name: "Shiori Misaka",   game: "Kanon" });
        PJ[1].INSERT({ name: "Ayu Tsukimiya",   game: "Kanon" });
        PJ[1].INSERT({ name: "Mai Kawasumi",    game: "Kanon" });
    },
});

Deno.test({
    name: "SELECT",
    fn(): void {
        const res = PJ[1].SELECT().RESULT();
        assertEquals(10, res.length)

        const res2 = PJ[1].SELECT({ id: 1 }, 1).RESULT();
        assertEquals("Yukito Kunisaki", res2[0].name);
        assertEquals("Air", res2[0].game);
        
        const res3 = PJ[1].SELECT({ game: "Air" }, 5).RESULT();
        assertEquals("Minagi Tono",     res3[0].name);
        assertEquals("Kano Kirishima",  res3[1].name);
        assertEquals("Misuzu Kamio",    res3[2].name);
        assertEquals("Yukito Kunisaki", res3[3].name);
        assertEquals(undefined,         res3[4]);
        
        const res4 = PJ[1].SELECT({ game: "Air" }, 2).RESULT();
        assertEquals("Minagi Tono",     res4[0].name);
        assertEquals("Kano Kirishima",  res4[1].name);
        assertEquals(undefined,         res4[2]);

        const res5 = PJ[1].SELECT({ name: "Minagi Tono" }, 1).RESULT();
        assertEquals("Minagi Tono", res5[0].name);
        assertEquals(undefined,     res5[1]);
        
        const res6 = PJ[1].SELECT({ id: 100 }, 1).RESULT();
        assertEquals(undefined, res6[0]);
    }
});

