export const version = "develop";

export * from "https://deno.land/std@0.113.0/http/cookie.ts";
export { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts";
export * as path from "https://deno.land/std@0.113.0/path/mod.ts";
export * from "https://deno.land/std@0.113.0/hash/mod.ts";
export * from "https://deno.land/std@0.113.0/fs/walk.ts";

export * from "./_FileOperations/FileManager.ts";
export * from "./System.ts";
export * from "./_RequestAndResponse/SystemRequest.ts";
export * from "./_RequestAndResponse/SystemResponse.ts";
export * from "./_RouterAndController/Router.ts";
export * from "./_RouterAndController/WebSocketRouter.ts";
export * from "./_RouterAndController/Controller.ts";
export * from "./_View/AssignToVariables.ts";
export * from "./_FileOperations/Config.ts";
export * from "./_FileOperations/Logger.ts";
export * from "./_Authentication/GoogleOAuth2.ts";
export * from "./_Authentication/AuthDigest.ts";

export * from "./default/default_errorFile.ts";
export * from "./default/default_controller.ts";