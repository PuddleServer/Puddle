import {
    path
} from "./mod.ts";

async function ensureDir(dir: string) {
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

async function ensureFile(filePath: string) {
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
            await ensureDir(path.dirname(filePath));
            // create file
            await Deno.writeFile(filePath, new Uint8Array());
            return;
        }

        throw err;
    }
}

export class Log {

    fileName: string = ".log"
    header: string[] = ["Date"];
    data: string[];

    constructor(...data: string[]) {
        this.data = [];
        this.data.push(new Date().toString().replace(/\s\(.*\)/g, ""));
        this.data.push(...data);
    }

    get headerLine(): string {
        return `${this.header.join(",")}\n`;
    }

    toString(): string {
        return `${this.data.join(",")}\n`;
    }

    async record() {
        await Logger.insert(this.fileName, this.toString(), this.headerLine);
    }
}

export class RequestLog extends Log {
    constructor(Path: string, Method: string, URL: string, Address: string) {
        super(Path, Method, URL, Address);
        this.fileName = "request.log";
        this.header = ["Date", "Path", "Method", "URL", "Address"];
        this.record();
    }
}

export class ErrorLog extends Log {
    constructor(Type: "error" | "warning", Message: string) {
        super(Type, Message);
        this.fileName = "error.log";
        this.header = ["Date", "Type", "Message"];
        this.record();
    }
}

export class Logger {
    
    static directoryPath: string = "./log";

    static setDirectoryPath(directoryPath: string) {
        Logger.directoryPath = directoryPath;
    }
    
    static async read(fileName: string): Promise<string> {
        const filePath: string = `${Logger.directoryPath}/${fileName}`;
        await ensureFile(filePath)
        const text:string = await Deno.readTextFile(filePath);
        return text;
    }

    static async write(fileName: string, text: string): Promise<void> {
        const filePath: string = `${Logger.directoryPath}/${fileName}`;
        await ensureFile(filePath)
        await Deno.writeTextFile(filePath, text)
    }

    static async insert(fileName: string, text: string, header: string): Promise<void> {
        const texts: string = await Logger.read(fileName);
        if(!texts.length) await Logger.write(fileName, header);
        await Logger.write(fileName, texts+text);
    }
}