import { System, Config } from "../../mod.ts";

System.listen("./config.json", (conf: Config) => {
    console.log(`The server running on http://${conf.SERVER.HOSTNAME}:${conf.SERVER.PORT}`);
})