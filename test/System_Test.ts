/**
 * System.tsのSystemクラステストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-31
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { System }           from "../System.ts";

class Apple {

    #variety: string;
    #prise: number;

    constructor(variety: string, prise: number) {
        this.#variety = variety;
        this.#prise = prise;
    }

    getVariety(): string {
        return this.#variety;
    }

    getPrise(): number {
        return this.#prise;
    }
}

/**
 * テスト
 */

Deno.test({
    name: "生成テスト",
    fn(): void {
        const apple = new Apple("Fuji", 100);
        
        const system1 = new System();
        const system2 = new System(apple);

    },
});