import { FileManager, path } from "./mod.ts";

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
        await FileManager.ensureFile(filePath)
        const text:string = await Deno.readTextFile(filePath);
        return text;
    }

    static async write(fileName: string, text: string): Promise<void> {
        const filePath: string = `${Logger.directoryPath}/${fileName}`;
        await FileManager.ensureFile(filePath)
        await Deno.writeTextFile(filePath, text)
    }

    static async insert(fileName: string, text: string, header: string): Promise<void> {
        const texts: string = await Logger.read(fileName);
        if(!texts.length) await Logger.write(fileName, header);
        await Logger.write(fileName, texts+text);
    }
}