/**
 * HTMLファイル内に埋め込まれた変数にテキストを挿入してHTMLを作成する関数。
 * Function to create HTML by inserting text into variables embedded in an HTML file.
 * @param html Text in html format that contains variables.
 * @param params An associative array with variable names as keys, called in html.
 * @returns The html after inserting text into the variable.
 */
export function htmlCompile(html: string, params: { [key: string]: ( string | Number ); }): string {
    for(let param in params) {
        const regExp: RegExp = new RegExp(`{{\\s*${param}\\s*}}`,`g`);
        html = html.replace(regExp, String(params[param]));
    }
    return html;
}