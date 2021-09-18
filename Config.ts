import { Config } from "./mod.ts"

export class ConfigReader {

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

    static decodeEnv(file_data: string): Config {
        const result: object = {};
        const data: string[][] = file_data.replace(/\s+#.*(?=\r?\n?)/g, "").split(/\r?\n/).map(data=>{
            if(data[0] == '#') return [];
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