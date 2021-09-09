/**
 * HTMLファイル内に埋め込まれた変数をテキストに変換したHTMLを作成する。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-08-27
 */

/**
 * HTMLファイル内に埋め込まれた変数をテキストに変換したHTMLを作成する関数。
 * @param html 変数を含んだhtml形式のテキスト。
 * @param params html内で呼び出される変数名をキーとした連想配列。
 * @returns 変数に代入を行った後のhtmlテキスト。
 */
export function htmlCompile(html: string, params: { [key: string]: ( string | Number ); }): string {
    for(let param in params) {
        const regExp: RegExp = new RegExp(`{{\\s*${param}\\s*}}`,`g`);
        html = html.replace(regExp, String(params[param]));
    }
    return html;
}