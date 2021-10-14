import { Config } from "./mod.ts";

/**
 * コンフィグファイルを読み込むためのクラス。
 * Class for loading the configuration file.
 */
export class ConfigReader {

    /**
     * JSONかENV形式のファイルを読み込んで、連想配列データに変換する。
     * Reads JSON or ENV format files and converts them to associative array data.
     * @param filePath Path of the file to read.
     * @returns Config object. {[key:string]: any; }
     */
    static async read(filePath: string): Promise<Config> {
        const ext: string = filePath.split(/\./g).pop()||"";
        const file = await Deno.open(filePath);
        const file_data: string = new TextDecoder('utf-8').decode(await Deno.readAll(file));
        switch (ext) {
            case "json":
            case "JSON":
                return JSON.parse(file_data);
            case "env":
            case "ENV":
                return ConfigReader.decodeEnv(file_data);
            default:
                return {};
        }
    }

    /**
     * ENV形式のデータを連想配列に変換する。
     * Convert data in ENV format to an associative array.
     * @param file_data A string in ENV format.
     * @returns Config object. {[key:string]: any; }
     */
    static decodeEnv(file_data: string): Config {
        const result: object = {};
        const data: string[][] = file_data.replace(/\s+#.*(?=\r?\n?)/g, "").split(/\r?\n/).map(data=>{
            if(!data || data[0] == '#') return [];
            const index: number = data.indexOf("=");
            return [data.slice(0, index), data.slice(index+1)];
        }).filter(v=>v.length == 2);
        for(let column of data) {
            const key: string[] = column[0].split(/\.|_/g);
            let value: any = result;
            for(let i in key) {
                if(!value[key[i]]) value[key[i]] = {};
                if(Number(i) == key.length-1) {
                    if(["true","false"].includes(column[1].toLowerCase())) {
                        value[key[i]] = column[1].toLowerCase() == "true";
                    } else value[key[i]] = (Number.isNaN(Number(column[1])))? column[1] : Number(column[1]);
                    break;
                }
                value = value[key[i]];
            }
        }
        return result;
    }
}