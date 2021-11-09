import { SystemRequest, SystemResponse } from "../../../mod.ts";

export function getController(req: SystemRequest, res: SystemResponse) {
    res.setText("Collect!");
}