import { Driver, Permission, Verification } from "wg-core";
import { json } from "body-parser";

import JsonAPI from "./helper/jsonapi";
import ErrorMessages from "./helper/messages";

const jsonapi = new JsonAPI();
jsonapi.setErrorMessageInstance(ErrorMessages);

function modifyPermission(type: string, req: any, res: any) {
    const app = Verification.getAppBySubdomain(req);
    if (app.id) {
        if(Permission.isSpecialApp(app.id, "modify_permissions")) {
            if (req.body === "object") {
                const app_id = req.body?.app_id;
                const permission = req.body?.permission;
                if(app_id && permission) {
                    let change: any = false;
                    switch(type) {
                        case "grant":
                            change = Permission.grantPermission(app_id, permission);
                            break;
                        case "grant_special":
                            change = Permission.grantSpecialPermission(app_id, permission);
                            break;
                        case "revoke":
                            change = Permission.revokePermission(app_id, permission);
                            break;
                        case "revoke_special":
                            change = Permission.grantSpecialPermission(false, permission);
                            break;
                    }
                    if(change) {
                        res.json(jsonapi.data({response: change}));
                    } else {
                        res.json(jsonapi.error("api_core_app_error_performing_action"));
                    }
                } else {
                    res.json(jsonapi.error("api_core_app_too_few_parameters"));
                }
            } else {
                res.json(jsonapi.error("api_core_app_invalid_body"));
            }    
        } else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    } else {
        res.json(jsonapi.error("api_core_app_invalid_app"));
    }
}

Driver.register({
    method: "post",
    path: "/api/core/permission/grant",
    parser: json(),
    handler: modifyPermission.bind(false, "grant")
});

Driver.register({
    method: "post",
    path: "/api/core/permission/revoke",
    parser: json(),
    handler: modifyPermission.bind(false, "revoke")
});

Driver.register({
    method: "post",
    path: "/api/core/permission/special/grant",
    parser: json(),
    handler: modifyPermission.bind(false, "grant_special")
});

Driver.register({
    method: "post",
    path: "/api/core/permission/special/revoke",
    parser: json(),
    handler: modifyPermission.bind(false, "revoke_special")
});

export default Driver.export();