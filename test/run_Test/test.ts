import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
//const stream = await Deno.readFile("./assets/PuddleLogo.png")
console.log(import.meta.url)
const resp = await fetch("file:///D:/workspace/Puddle-1/Puddle-1/test/run_Test/assets/PuddleLogo.png");
    console.log("========")
    console.log("=>",resp.body)
serve(async(_req) => {
    const resp = await fetch("file:///D:/workspace/Puddle-1/Puddle-1/test/run_Test/assets/PuddleLogo.png");
    console.log("========")
    console.log("=>",resp.body)
    return new Response(resp.body, {
      headers: { "content-type": "image/png; charset=utf-8" },
    });
  });
console.log("http://localhost:8000/");