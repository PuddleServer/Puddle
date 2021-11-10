import { walkSync, System, ConfigReader, Config, HandlerFunction, Route } from "../mod.ts";

export async function getHandlerFunctions(directoryPath: string): Promise<{ [key: string]: any; }> {

    console.log(">> Import controller files...");
    const handlerFunctions: { [key: string]: any; } = {};

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
    const mainPath = Deno.mainModule.split("/").slice(0, -1).join("/");
    if(filePath.match(/$\.\//)) filePath.replace("./", "");
    //console.log(` - ${mainPath}/${filePath}`);
    const module = await import(`${mainPath}/${filePath.replace(".TS", ".ts").replace(".JS", ".js")}`);
    for(let name in module) {
        handlerFunctions[name] = module[name];
    }
}

export async function loadRoutingFiles(directoryPath: string, handlerFunctions: { [key: string]: any; }): Promise<void> {

    try {
        console.log(">> Load routing files...");

        if(directoryPath?.toLowerCase().match(/\.json$|\.env$/)) {
            console.log(` - ./${directoryPath}`);
            const config: Config = await ConfigReader.read(`./${directoryPath}`);
            createRoutes(config, handlerFunctions);
            return;
        }
        
        for(const entry of walkSync(directoryPath.replace(/\*/g, ""))) {
            const path = entry.path.replace(/\\/g, "/");
            if(!path?.toLowerCase().match(/\.json$|\.env$/)) continue;
            console.log(` - ./${path}`);
            const config: Config = await ConfigReader.read(`./${path}`);
            createRoutes(config, handlerFunctions);
        }
    } finally {
        console.log(`>> The following ${Route.list.length} routes have been created.`)
        console.log(" ", Route.list.map(route=>route.PATH()));
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
                    const handler: HandlerFunction | undefined = handlerFunctions[route[key]];
                    if(handler) newRoute[key](handler);
                } else {
                    const nameOfController: string | undefined = route[key].ACTION;
                    if(!nameOfController) break;
                    const handler: HandlerFunction | undefined = handlerFunctions[nameOfController];
                    if(handler) newRoute[key](handler);
                }
                break;
            default:
                break;
        }
    });
}