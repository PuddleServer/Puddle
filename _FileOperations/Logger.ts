import { FileManager } from "../mod.ts";

/**
 * ログのスーパークラス。
 * Log superclass.
 */
export class Log {

    /**
     * ファイル名。
     * File name.
     */
    fileName: string = ".log"

    /**
     * ログファイルのヘッダー。
     * Header of the log file.
     */
    header: string[] = ["Date"];

    /**
     * 記録するデータ。
     * Data to be logged
     */
    data: string[];

    constructor(...data: string[]) {
        this.data = [];
        this.data.push(new Date().toString().replace(/\s\(.*\)/g, ""));
        this.data.push(...data);
    }

    /**
     * ヘッダーの取得。
     * Get the header.
     */
    get headerLine(): string {
        return `${this.header.join(",")}\n`;
    }

    /**
     * データの文字列化。
     * Stringing of data.
     * @returns String data.
     */
    toString(): string {
        return `${this.data.join(",")}\n`;
    }

    /**
     * 記録の実行。
     * Running records.
     */
    async record() {
        await Logger.insert(this.fileName, this.toString(), this.headerLine);
    }
}

/**
 * リクエストログ。
 * Request log.
 */
export class RequestLog extends Log {
    constructor(Path: string, Method: string, URL: string, Address: string) {
        super(Path, Method, URL, Address);
        this.fileName = "request.log";
        this.header = ["Date", "Path", "Method", "URL", "Address"];
        this.record();
    }
}

/**
 * エラーログ。
 * Error log.
 */
export class ErrorLog extends Log {
    constructor(Type: "error" | "warning", Message: string) {
        super(Type, Message);
        this.fileName = "error.log";
        this.header = ["Date", "Type", "Message"];
        this.record();
    }
}

/**
 * 記録を行うクラス。
 * Class to record.
 */
export class Logger {
    
    /**
     * ログファイルを格納するディレクトリーのパス。
     * Path of the directory where the log files are stored.
     */
    static directoryPath: string | undefined = undefined;

    /**
     * ログファイルを格納するディレクトリーのパスを設定する。
     * Set the path of the directory where the log files are stored.
     * @param directoryPath 
     */
    static setDirectoryPath(directoryPath: string) {
        Logger.directoryPath = directoryPath;
    }
    
    /**
     * ログファイルを読み込む。
     * Read the log file.
     * @param fileName File name.
     * @returns Log data.
     */
    static async read(fileName: string): Promise<string> {
        if(!Logger.directoryPath) return "";
        const filePath: string = `${Logger.directoryPath}/${fileName}`;
        const text:string = await FileManager.read(filePath);
        return text;
    }

    /**
     * ログファイルに書き込む。
     * Write to the log file.
     * @param fileName File name.
     * @param text Data to be written.
     */
    static async write(fileName: string, text: string): Promise<void> {
        if(!Logger.directoryPath) return;
        const filePath: string = `${Logger.directoryPath}/${fileName}`;
        await FileManager.write(filePath, text);
    }

    /**
     * ログファイルにデータを挿入する。
     * Insert data into the log file.
     * @param fileName File name.
     * @param text Record to insert.
     * @param header Header of the log file.
     */
    static async insert(fileName: string, text: string, header: string): Promise<void> {
        if(!Logger.directoryPath) return;
        const texts: string = await Logger.read(fileName);
        if(!texts.length) await Logger.write(fileName, header);
        await Logger.write(fileName, texts+text);
    }
}