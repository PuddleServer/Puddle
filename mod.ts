export const version = "develop";

export { serve, serveTLS, Server, ServerRequest } from "https://deno.land/std@0.106.0/http/server.ts";
export type { Response , HTTPOptions, HTTPSOptions} from "https://deno.land/std@0.106.0/http/server.ts";
export { getCookies, setCookie } from "https://deno.land/std@0.106.0/http/cookie.ts";
export type { Cookie } from "https://deno.land/std@0.106.0/http/cookie.ts";
export {
    acceptWebSocket,
    isWebSocketCloseEvent,
    acceptable
} from "https://deno.land/std@0.106.0/ws/mod.ts";
export type { WebSocket } from "https://deno.land/std@0.106.0/ws/mod.ts";
export { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts";
export * as path from "https://deno.land/std@0.106.0/path/mod.ts";
export * from "https://deno.land/std@0.106.0/hash/mod.ts";
export * from "https://deno.land/std@0.106.0/fs/walk.ts";

export * from "./_FileOperations/FileManager.ts";
export * from "./System.ts";
export * from "./_RequestAndResponse/SystemRequest.ts";
export * from "./_RequestAndResponse/SystemResponse.ts";
export * from "./_RouterAndController/Router.ts";
export * from "./_RouterAndController/WebSocketRouter.ts";
export * from "./_RouterAndController/Controller.ts";
export * from "./_View/HtmlCompiler.ts";
export * from "./_FileOperations/Config.ts";
export * from "./_FileOperations/Logger.ts";
export * from "./_Authentication/GoogleOAuth2.ts";
export * from "./_Authentication/AuthDigest.ts";

export * from "./default/default_errorFile.ts";
export * from "./default/default_controller.ts";