import {System} from "../../mod.ts";

System.listen(8080);

System.createRoute("/").GET(async(req,res)=>{
  await res.setFile("./assets/PuddleLogo.png");
});

const watcher = Deno.watchFs("./");
console.log(Deno.mainModule)
for await (const event of watcher) {
   console.log(">>>> event", event);
   // { kind: "create", paths: [ "/foo.txt" ] }
}