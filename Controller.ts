/**
 * Response処理を行うクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-07
 */
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts"

export function controll(request: ServerRequest, process: Function, isWebSocket: boolean): void {
    if(isWebSocket) {
        controller(request, process);
    } else {
        webSocketController(request, process);
    }
}

function controller(request: ServerRequest, process: Function) {

}

function webSocketController(request: ServerRequest, process: Function) {

}