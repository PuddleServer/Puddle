import {System} from "../../mod.ts";

System.listen(8080);

System.createRoute("/").GET(async(req,res)=>{
  await res.setFile("./assets/PuddleLogo.png");
});