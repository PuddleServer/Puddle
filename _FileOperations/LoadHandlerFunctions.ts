import { walkSync, System, ConfigReader, Config, handlerFunction, Route } from "../mod.ts";

export async function getHandlerFunctions(directoryPath: string): Promise<{ [key: string]: any; }> {

    const handlerFunctions: { [key: string]: any; } = {};

    if(directoryPath.includes("../")) return handlerFunctions;

    if(directoryPath?.toLowerCase().match(/\.js$|\.ts$/)) {
        await importControllerFile(directoryPath, handlerFunctions);
        return handlerFunctions;
    }

    for(const entry of walkSync(directoryPath.replace(/\*/g, ""))) {
        const path = entry.path.replace(/\\/g, "/");
        if(!path?.toLowerCase().match(/\.js$|\.ts$/)) continue;
        await importControllerFile(path, handlerFunctions);
    }
    return handlerFunctions;
}

async function importControllerFile(filePath: string, handlerFunctions: { [key: string]: any; }) {
    const mainPath = Deno.mainModule.split("/");
    mainPath.pop();
    if(filePath.match(/$\.\//)) filePath.replace("./", "");
    const module = await import(`${mainPath.join("/")}/${filePath.replace(".TS", ".ts").replace(".JS", ".js")}`);
    for(let name in module) {
        handlerFunctions[name] = module[name];
    }
}

export async function loadRoutingFiles(directoryPath: string, handlerFunctions: { [key: string]: any; }): Promise<void> {

    if(directoryPath.includes("../")) return;

    if(directoryPath?.toLowerCase().match(/\.json$|\.env$/)) {
        const config: Config = await ConfigReader.read(`./${directoryPath}`);
        createRoutes(config, handlerFunctions);
        return;
    }
    
    for(const entry of walkSync(directoryPath.replace(/\*/g, ""))) {
        const path = entry.path.replace(/\\/g, "/");
        if(!path?.toLowerCase().match(/\.json$|\.env$/)) continue;
        const config: Config = await ConfigReader.read(`./${path}`);
        createRoutes(config, handlerFunctions);
    }
}

function createRoutes(config: Config, handlerFunctions: { [key: string]: any; }): void {
    for(let PATH in config) {
        const route: Config = config[PATH];
        if(Array.isArray(route)) {
            System.createRoutes(...route);
            continue;
        }
        const newRoute: Route = System.createRoute({PATH});
        setRouteOption(route, newRoute, handlerFunctions);
    }
}

function setRouteOption(route: Config, newRoute: Route, handlerFunctions: { [key: string]: any; }) {
    Object.keys(route).forEach( key => {
        switch (key) {
            case "URL":
                newRoute.URL(route[key]);
                break;
            case "GET":
            case "POST":
            case "PUT":
            case "DELETE":
            case "PATCH":
                if(typeof route[key] == "string") {
                    const handler: handlerFunction | undefined = handlerFunctions[route[key]];
                    if(handler) newRoute[key](handler);
                } else {
                    const nameOfController: string | undefined = route[key].ACTION;
                    if(!nameOfController) break;
                    const handler: handlerFunction | undefined = handlerFunctions[nameOfController];
                    if(handler) newRoute[key](handler);
                }
                break;
            default:
                break;
        }
    });
}