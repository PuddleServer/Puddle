import {
    path, ErrorLog
} from "./mod.ts";

export class FileManager {
    
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

    static async read(filePath: string): Promise<string> {
        await FileManager.ensureFile(filePath);
        return await Deno.readTextFile(filePath);
    }

    static async write(filePath: string, text: string) {
        await FileManager.ensureFile(filePath);
        await Deno.writeTextFile(filePath, text);
    }

}

export type SCHEMA = {[key:string]:("UNIQUE"|"AUTO INCREMENT"|"NOT NULL")[]|string;};

export type ROW = {[key: string]: string | number | boolean | null; };

export type SelectCriteria = {
    (row: ROW): {[key: string]: boolean; };
}

export class PuddleJSON {

    static TABLE: {[key: string]: PuddleJSON;} = {};

    static stringify(data: {[key:string]: any;}|string): string {
        if(typeof data != "string") data = JSON.stringify(data);
        return data.replace(/(?=\{)|(?<=\}(?!\,))/g, "\n");
    }

    static checkSchema(data: ROW[], SCHEMA: SCHEMA): ROW[] {
        for(let key in SCHEMA) {
            const isUnique = SCHEMA[key].includes("UNIQUE");
            const isNotNull = SCHEMA[key].includes("NOT NULL");
            if(!isUnique && !isNotNull) continue;
            const rows = data.map(column=>column[key]);
            if(isUnique && new Set(rows).size != rows.length) throw Error(`\n[PuddleJSON]\nSchema error. There is a duplicate element in the "${key}" field.\nスキーマエラーです。"${key}"に重複があります。`);
            if(isNotNull && rows.filter(v=>v).length != rows.length) throw Error(`\n[PuddleJSON]\nSchema error. "${key}" has null object.\nスキーマエラーです。"${key}"はNULLオブジェクトを持っています。`);
        }
        data = data.map(row=>{
            for(let key in SCHEMA) if(!row[key]) row[key] = null;
            return row;
        })
        return data;
    }

    static autoIncrement(data: ROW[], KeyAndValue: ROW, SCHEMA: SCHEMA): ROW {
        for(let key in SCHEMA) {
            const isAutoIncrement = SCHEMA[key].includes("AUTO INCREMENT");
            if(!isAutoIncrement) continue;
            let max = 0;
            data.map(columns=>columns[key]).forEach(column=>{
                if(!Number.isNaN(column) && max < Number(column)) max = Number(column);
            });
            KeyAndValue[key] = ++max;
        }
        return KeyAndValue;
    }

    static CREATE(filePath: string, SCHEMA?: SCHEMA): PuddleJSON {
        return PuddleJSON.USE(filePath, SCHEMA || {});
    }

    static USE(filePath: string, SCHEMA?: SCHEMA): PuddleJSON {
        if(Object.keys(PuddleJSON.TABLE).includes(filePath)) return PuddleJSON.TABLE[filePath];
        return new PuddleJSON(filePath, SCHEMA || {});
    }

    #SCHEMA: SCHEMA;

    #filePath: string = "";

    constructor(filePath: string, SCHEMA: SCHEMA) {
        FileManager.ensureFileSync(filePath);
        this.#filePath = filePath;
        this.#SCHEMA = SCHEMA;
        PuddleJSON.checkSchema(this.#parse, SCHEMA);
        PuddleJSON.TABLE[filePath] = this;
    }

    get #parse(): ROW[] {
        const file = Deno.readTextFileSync(this.#filePath);
        const data = JSON.parse(file.length?file:"[]");
        if(!Array.isArray(data)) throw Error(`\n[PuddleJSON]\n"${this.#filePath}"はPuddleJSONが扱えるフォーマットではありません。\n"${this.#filePath}" is not a format that PuddleJSON can handle.`);
        return data;
    }

    INSERT(KeyAndValue:  ROW): ROW {
        const data = this.#parse;
        KeyAndValue = PuddleJSON.autoIncrement(data, KeyAndValue, this.#SCHEMA);
        data.unshift(KeyAndValue);
        const checkedData = PuddleJSON.checkSchema(data, this.#SCHEMA);
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(checkedData));
        return KeyAndValue;
    }

    SELECT(WHERE: ROW = {}, LIMIT: number = Infinity): ResultOfPuddleJSON {
        return this.SELECTIF(row=>{
            for(let key in WHERE) {
                if(row[key] !== WHERE[key]) return {result: false};
            };
            return {result: true};
        }, LIMIT);
    }

    SELECTIF(criteria: SelectCriteria, LIMIT: number = Infinity) {
        let count = 0;
        const rows = this.#parse;
        const selectedRows: ROW[] = [];
        for(let row of rows) {
            if(!Object.values(criteria(row)).filter(column=>!column).length) selectedRows.push(row);
            if(++count >= LIMIT) break;
        };
        return new ResultOfPuddleJSON(selectedRows, this.#filePath, this.#SCHEMA);
    }
}

export class ResultOfPuddleJSON {

    #filePath: string;

    #SCHEMA: SCHEMA;

    selectedRows: ROW[];

    constructor(selectedRows: ROW[], filePath: string, SCHEMA: SCHEMA) {
        this.selectedRows = selectedRows;
        this.#filePath = filePath;
        this.#SCHEMA = SCHEMA;
    }

    RESULT(...keys: string[]): ROW[] {

        if(!keys.length) return this.selectedRows;

        return this.selectedRows.map(column=>{
            const result: ROW = {};
            keys.forEach(key=>result[key] = column[key]);
            return result;
        });
    }

    UPDATE(KeyAndValue: ROW): ROW[] {
        let data = JSON.stringify(JSON.parse(Deno.readTextFileSync(this.#filePath)));
        for(let row of this.selectedRows) {
            const updatedRow = {...row};
            Object.keys(KeyAndValue).forEach(key=>updatedRow[key] = KeyAndValue[key]);
            data = data.replace(JSON.stringify(row), JSON.stringify(updatedRow));
        }
        const checkedData = PuddleJSON.checkSchema(JSON.parse(data), this.#SCHEMA);
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(checkedData));
        return checkedData;
    }

    REMOVE(): ROW[] {
        const removedColumn = [];
        let data = JSON.stringify(JSON.parse(Deno.readTextFileSync(this.#filePath)));
        for(let column of this.selectedRows) {
            const _data = data.replace(JSON.stringify(column), "");
            if(data.length != _data.length) removedColumn.push(column);
            data = _data;
        }
        data = data.replace(/\,+/g, ",").replace(/\[\,/g, "[").replace(/\,\]/g, "]");
        data = JSON.stringify(PuddleJSON.checkSchema(JSON.parse(data), this.#SCHEMA));
        Deno.writeTextFileSync(this.#filePath, PuddleJSON.stringify(data));
        return removedColumn;
    }

    DELETE(): number {
        return this.REMOVE().length;
    }
}

const USERS = PuddleJSON.USE("./users.json", {
    id:     ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
    name:   ["NOT NULL"],
    age:    []
});

USERS.INSERT({name: "Steve", age: 20});
USERS.INSERT({name: "Alex"});

console.log(USERS.SELECT().RESULT());
console.log(USERS.SELECT({id:1}).RESULT("name", "age"));
console.log(USERS.SELECTIF(row=>({id:Number(row.id) > 3})).RESULT());