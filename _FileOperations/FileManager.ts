import {
    path, ErrorLog
} from "../mod.ts";

/**
 * ファイルの操作を行うクラス。
 * Class for manipulating files.
 */
export class FileManager {
    
    /**
     * 指定したディレクトリーがなければ作成する。
     * If the specified directory does not exist, create it.
     * @param dir Directory path
     */
    static async ensureDir(dir: string) {
        try {
            const fileInfo = await Deno.lstat(dir);
            if (!fileInfo.isDirectory) {
                new ErrorLog("error", `Ensure path exists, expected 'dir', "${dir}"`);
                throw new Error(
                    `Ensure path exists, expected 'dir', "${dir}"`,
                );
            }
        } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                // if dir not exists. then create it.
                await Deno.mkdir(dir, { recursive: true });
                return;
            }
            throw err;
        }
    }

    /**
     * 指定したディレクトリーがなければ作成する。
     * If the specified directory does not exist, create it.
     * @param dir Directory path
     */
    static ensureDirSync(dir: string): void {
        try {
            const fileInfo = Deno.lstatSync(dir);
            if (!fileInfo.isDirectory) {
                new ErrorLog("error", `Ensure path exists, expected 'dir', "${dir}"`);
                throw new Error(
                    `Ensure path exists, expected 'dir', "${dir}"`,
                );
            }
        } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                // if dir not exists. then create it.
                Deno.mkdirSync(dir, { recursive: true });
                return;
            }
            throw err;
        }
    }

    /**
     * 指定したファイルがなければ作成する。
     * If the specified file does not exist, it will be created.
     * @param filePath File path
     */
    static async ensureFile(filePath: string) {
        try {
            // if file exists
            const stat = await Deno.lstat(filePath);
            if (!stat.isFile) {
                new ErrorLog("error", `Ensure path exists, expected 'file', "${filePath}"`);
                throw new Error(
                    `Ensure path exists, expected 'file', "${filePath}"`,
                );
            }
        } catch (err) {
            // if file not exists
            if (err instanceof Deno.errors.NotFound) {
                // ensure dir exists
                await this.ensureDir(path.dirname(filePath));
                // create file
                await Deno.writeFile(filePath, new Uint8Array());
                return;
            }
    
            throw err;
        }
    }

    /**
     * 指定したファイルがなければ作成する。
     * If the specified file does not exist, it will be created.
     * @param filePath File path
     */
    static ensureFileSync(filePath: string): void {
        try {
            // if file exists
            const stat = Deno.lstatSync(filePath);
            if (!stat.isFile) {
                new ErrorLog("error", `Ensure path exists, expected 'file', "${filePath}"`);
                throw new Error(
                    `Ensure path exists, expected 'file', "${filePath}"`,
                );
            }
        } catch (err) {
            // if file not exists
            if (err instanceof Deno.errors.NotFound) {
                // ensure dir exists
                this.ensureDirSync(path.dirname(filePath));
                // create file
                Deno.writeFileSync(filePath, new Uint8Array());
                return;
            }
            throw err;
        }
    }

    /**
     * 指定したファイルのデータを取得します。
     * Retrieves data from the specified file.
     * @param filePath File path.
     * @returns Data in the file.
     */
    static async read(filePath: string): Promise<string> {
        return await Deno.readTextFile(filePath);
    }

    /**
     * 指定したファイルにデータを書き込みます。
     * Writes data to the specified file.
     * @param filePath File path.
     * @param text Data to be written.
     */
    static async write(filePath: string, text: string) {
        await Deno.writeTextFile(filePath, text);
    }

}

/**
 * PuddleJSONで使用されるスキーマです。
 * The schema to be used in PuddleJSON.
 * 
 * ```ts
 * {
 *      id:     ["UNIQUE", "AUTO INCREMENT", "NOT NULL"],
 *      name:   ["NOT NULL"],
 *      age:    []
 * }
 * ```
 */
export type SCHEMA = {[key:string]:("UNIQUE"|"AUTO INCREMENT"|"NOT NULL")[]|string;};

/**
 * PuddleJSONで行を表す型。
 * A type that represents a row in PuddleJSON.
 * 
 * ```ts
 * {id: 1, name: "John", age: 20}
 * ```
 */
export type ROW = {[key: string]: string | number | boolean | null; };

/**
 * PuddleJSONでデータをセレクトするときの条件。
 * Criteria for selecting data for PuddleJSON.
 * 
 * ```ts
 * row => ({ id: Number(row.id) > 10 })
 * ```
 */
export type SelectCriteria = {
    (row: ROW): {[key: string]: boolean; };
}

/**
 * JSONファイルのデータを簡単に操作するためのクラス。
 * A class for easily manipulating data in JSON files.
 */
export class PuddleJSON {

    /**
     * 読み込んだJSONファイルを格納する連想配列。
     * An associative array to store the loaded JSON file.
     */
    static TABLE: {[key: string]: PuddleJSON;} = {};

    /**
     * データを文字列に変換する際にフォーマットを整える。
     * Format the data when converting it to a string.
     * @param data An object in JSON format.
     * @returns Formatted string.
     */
    static stringify(data: {[key:string]: any;}|string): string {
        if(typeof data != "string") data = JSON.stringify(data);
        return data.replace(/(?=\{)|(?<=\}(?!\,))/g, "\n");
    }

    /**
     * データとスキーマを照合する。
     * Collate data and schemas.
     * @param data The data to be collated.
     * @param schema Schema of data.
     */
    static checkSchema(data: ROW[], schema: SCHEMA): ROW[] {
        for(let key in schema) {
            const isUnique = schema[key].includes("UNIQUE");
            const isNotNull = schema[key].includes("NOT NULL");
            if(!isUnique && !isNotNull) continue;
            const rows = data.map(column=>column[key]);
            if(isUnique && new Set(rows).size != rows.length) throw Error(`\n[PuddleJSON]\nSchema error. There is a duplicate element in the "${key}" field.\nスキーマエラーです。"${key}"に重複があります。`);
            if(isNotNull && rows.filter(v=>v).length != rows.length) throw Error(`\n[PuddleJSON]\nSchema error. "${key}" has null object.\nスキーマエラーです。"${key}"はNULLオブジェクトを持っています。`);
        }
        data = data.map(row=>{
            for(let key in schema) if(!row[key]) row[key] = null;
            return row;
        })
        return data;
    }

    /**
     * オートインクリメントを実行する。
     * Execute auto-increment.
     * @param data Data already added.
     * @param KeyAndValue Data to be added
     * @param schema Schema of data.
     * @returns Data for which auto-incrementing was performed.
     */
    static autoIncrement(data: ROW[], KeyAndValue: ROW, schema: SCHEMA): ROW {
        for(let key in schema) {
            const isAutoIncrement = schema[key].includes("AUTO INCREMENT");
            if(!isAutoIncrement) continue;
            let max = 0;
            data.forEach(columns=>{
                if(!Number.isNaN(columns[key]) && max < Number(columns[key])) max = Number(columns[key]);
            });
            KeyAndValue[key] = ++max;
        }
        return KeyAndValue;
    }

    /**
     * JSONファイルの作成。
     * Create a JSON file.
     * @param filePath File path.
     * @param schema Schema of data.
     * @returns PuddleJSON object.
     * 
     * ```ts
     * const USERS = PuddleJSON.CREATE("./users.json", {
     *      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
     *      name:"NOT NULL", 
     *      age:[]
     * });
     * ```
     */
    static CREATE(filePath: string, schema?: SCHEMA): PuddleJSON {
        return PuddleJSON.USE(filePath, schema || {});
    }

    /**
     * JSONファイルの読み込み。
     * Read JSON file.
     * @param filePath File path.
     * @param schema Schema of data.
     * @returns PuddleJSON object.
     * 
     * ```ts
     * const USERS = PuddleJSON.USE("./users.json", {
     *      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
     *      name:"NOT NULL", 
     *      age:[]
     * });
     * ```
     */
    static USE(filePath: string, schema?: SCHEMA): PuddleJSON {
        if(Object.keys(PuddleJSON.TABLE).includes(filePath)) return PuddleJSON.TABLE[filePath];
        return new PuddleJSON(filePath, schema || {});
    }

    /**
     * データのスキーマ。
     * Schema of data.
     */
    #schema: SCHEMA;

    /**
     * データの参照元のファイルパス。
     * The file path from which the data is referenced.
     */
    #filePath: string = "";

    constructor(filePath: string, schema: SCHEMA) {
        FileManager.ensureFileSync(filePath);
        this.#filePath = filePath;
        this.#schema = schema;
        PuddleJSON.checkSchema(this.#parse, schema);
        PuddleJSON.TABLE[filePath] = this;
    }

    /**
     * ファイルからデータを読み込む。
     * Read data from a file.
     */
    get #parse(): ROW[] {
        const file = Deno.readTextFileSync(this.#filePath);
        const data = JSON.parse(file.length?file:"[]");
        if(!Array.isArray(data)) throw Error(`\n[PuddleJSON]\n"${this.#filePath}"はPuddleJSONが扱えるフォーマットではありません。\n"${this.#filePath}" is not a format that PuddleJSON can handle.`);
        return data;
    }

    /**
     * データを挿入する。
     * Insert the data.
     * @param KeyAndValue The data to be inserted.
     * 
     * ```ts
     * const inserted_data = USERS.INSERT({ name: "John", age: 20 });
     * ```
     */
    INSERT(KeyAndValue:  ROW): ROW {
        const data = this.#parse;
        KeyAndValue = PuddleJSON.autoIncrement(data, KeyAndValue, this.#schema);
        data.unshift(KeyAndValue);
        const checkedData = PuddleJSON.checkSchema(data, this.#schema);
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(checkedData));
        return KeyAndValue;
    }

    /**
     * 操作するデータを選択する。
     * Select the data to be manipulated.
     * @param WHERE Selection criteria.
     * @param LIMIT Upper limit of selection.
     * @returns SelectedRows object.
     * 
     * ```ts
     * USERS.SELECT({ id: 1 }, 1).RESULT();
     * ```
     */
    SELECT(WHERE: ROW = {}, LIMIT: number = Infinity): SelectedRows {
        return this.SELECTIF(row=>{
            for(let key in WHERE) {
                if(row[key] !== WHERE[key]) return {result: false};
            };
            return {result: true};
        }, LIMIT);
    }

    /**
     * 操作するデータを選択する。
     * Select the data to be manipulated.
     * @param criteria Selection criteria.
     * @param LIMIT Upper limit of selection.
     * @returns SelectedRows object.
     * 
     * ```ts
     * USERS.SELECTIF(row=>({ age: Number(row.age) >= 18 })).RESULT();
     * ```
     */
    SELECTIF(criteria: SelectCriteria, LIMIT: number = Infinity) {
        let count = 0;
        const rows = this.#parse;
        const list: ROW[] = [];
        for(let row of rows) {
            if(!Object.values(criteria(row)).filter(column=>!column).length) {
                list.push(row);
                if(++count >= LIMIT) break;
            }
        };
        return new SelectedRows(list, this.#filePath, this.#schema);
    }
}

/**
 * PuddleJSONでセレクトされたデータの操作を行うクラス。
 * A class that performs operations on data selected with PuddleJSON.
 */
export class SelectedRows {

    /**
     * データの参照元のファイルパス。
     * The file path from which the data is referenced.
     */
    #filePath: string;

    /**
     * データのスキーマ。
     * Schema of data.
     */
    #schema: SCHEMA;

    /**
     * 選択されているデータ。
     * The data that has been selected.
     */
    list: ROW[];

    constructor(selectedRows: ROW[], filePath: string, schema: SCHEMA) {
        this.list = selectedRows;
        this.#filePath = filePath;
        this.#schema = schema;
    }

    /**
     * データを取得する。
     * Get the data.
     */
    get rows(): ROW[] {
        return this.list;
    }

    /**
     * データを取得する。
     * Get the data.
     * @param keys The column to retrieve. (If not specified, all columns)
     * @returns Selected data.
     * 
     * ```ts
     * const resultFull = USERS.SELECT({ id: 1 }).RESULT();
     * const nameAndAge = USERS.SELECT({ id: 1 }).RESULT("name", "age");
     * ```
     */
    RESULT(...keys: string[]): ROW[] {

        if(!keys.length) return this.list;

        return this.list.map(column=>{
            const result: ROW = {};
            keys.forEach(key=>result[key] = column[key]);
            return result;
        });
    }

    /**
     * データの更新。
     * Update data.
     * @param KeyAndValue New data.
     * @returns Updated data.
     * 
     * ```ts
     * USERS.SELECT({ id: 1 }).UPDATE({ age: 21 });
     * ```
     */
    UPDATE(KeyAndValue: ROW): ROW[] {
        let data = JSON.stringify(JSON.parse(Deno.readTextFileSync(this.#filePath)));
        for(let row of this.list) {
            const updatedRow = {...row};
            Object.keys(KeyAndValue).forEach(key=>updatedRow[key] = KeyAndValue[key]);
            data = data.replace(JSON.stringify(row), JSON.stringify(updatedRow));
        }
        const checkedData = PuddleJSON.checkSchema(JSON.parse(data), this.#schema);
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(checkedData));
        return checkedData;
    }

    /**
     * データの削除。
     * Remove data.
     * @returns Deleted data.
     * 
     * ```ts
     * const removedData = USERS.SELECT({ id: 1 }).REMOVE();
     * ```
     */
    REMOVE(): ROW[] {
        const removedColumn = [];
        let data = JSON.stringify(JSON.parse(Deno.readTextFileSync(this.#filePath)));
        for(let column of this.list) {
            const _data = data.replace(JSON.stringify(column), "");
            if(data.length != _data.length) removedColumn.push(column);
            data = _data;
        }
        data = data.replace(/\,+/g, ",").replace(/\[\,/g, "[").replace(/\,\]/g, "]");
        data = JSON.stringify(PuddleJSON.checkSchema(JSON.parse(data), this.#schema));
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(data));
        return removedColumn;
    }

    /**
     * データの削除。
     * Delete data.
     * @returns Number of data deleted.
     * 
     * ```ts
     * USERS.SELECT({ id: 1 }).DELETE();
     * ```
     */
    DELETE(): number {
        return this.REMOVE().length;
    }
}