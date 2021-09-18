import { System, StartupConfig } from "../../System.ts"
import { Client } from "https://deno.land/x/mysql/mod.ts";

System.setModule("mySQL", await new Client());
System.createRoute("./assets/index.html").URL("/", "/トップ");
System.listen(8080, (conf: StartupConfig)=>{
    console.log(`The server running on http://${conf.hostname}:${conf.port}`);
    System.getModule("mySQL").connect({
        hostname: conf.mySQL.hostname,
        username: "root",
        db: "dbname",
        password: "password",
    });
});

System.getModule("mySQL")
    .execute(`INSERT INTO users(name) values(?)`, [
        "manyuanrong",
    ]);
System.mySQL.execute