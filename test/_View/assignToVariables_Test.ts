/**
 * assignToVariables.tsのassignToVariables関数テストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-31
 */

import { assertEquals }     from "../mod_test.ts";
import { assignToVariables , Route}            from "../../mod.ts";

const html_before: string = `
<html>{{ header }}</html>
<html>{{ contents }}</html>
<html>{{header}}</html>
<html>{{contents}}</html>
{{{header}}}
{contents}
\${header}
{{contents}abc}
(header)
<contents>
<a href="{{createPath(./nekoneko)}}">neko</a>
`;

const answer: string = `
<html>タイトル</html>
<html>本文</html>
<html>タイトル</html>
<html>本文</html>
{タイトル}
{contents}
\${header}
{{contents}abc}
(header)
<contents>
<a href="/assets/nekoneko">neko</a>
`;

/**
 * assignToVariables関数テスト
 */
Deno.test({
    name: "assignToVariables関数テスト1",
    fn(): void {
        const html_after: string = assignToVariables(html_before, {header: "タイトル",contents: "本文"}, "./assets/");
        // console.log(html_after)
        assertEquals(true, html_after == answer)
        // Route.list.forEach(e => {
        //     console.log("PATH: ",e.PATH());
        //     console.log("URL : ", e.URL());
        // });
    },
});

Deno.test({
    name: "assignToVariables関数テスト2",
    fn(): void {
        const html_after: string = assignToVariables(html_before, {header: "タイトル",contents: "本文"}, "/assets/");
        // console.log(html_after)
        assertEquals(true, html_after == answer)
        // Route.list.forEach(e => {
        //     console.log("PATH: ",e.PATH());
        //     console.log("URL : ", e.URL());
        // });
    },
});