/**
 * HtmlCompiler.tsのhtmlCompile関数テストファイル
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-31
 */

import { assertEquals }     from "https://deno.land/std@0.88.0/testing/asserts.ts";
import { htmlCompile }            from "../../mod.ts";

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
`;

/**
 * htmlCompile関数テスト
 */
Deno.test({
    name: "htmlCompile関数テスト",
    fn(): void {
        const html_after: string = htmlCompile(html_before, {header: "タイトル",contents: "本文"});
        assertEquals(true, html_after == answer)

    },
});