/**
 * Response処理を行うクラス。
 * @author Daruo(KINGVOXY)
 * @author AO2324(AO2324-00)
 * @Date   2021-09-07
 */
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts"

export function controll(riquest: ServerRequest, process: Function, isWebSocket: boolean): void {
    if(isWebSocket) {
        controller(riquest, process);
    } else {
        webSocketController(riquest, process);
    }
}

function controller(riquest: ServerRequest, process: Function) {

}

function webSocketController(riquest: ServerRequest, process: Function) {

}