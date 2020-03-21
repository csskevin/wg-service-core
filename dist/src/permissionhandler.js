"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wg_core_1 = require("wg-core");
var body_parser_1 = require("body-parser");
var jsonapi_1 = __importDefault(require("./helper/jsonapi"));
var messages_1 = __importDefault(require("./helper/messages"));
var jsonapi = new jsonapi_1.default();
jsonapi.setErrorMessageInstance(messages_1.default);
function modifyPermission(type, req, res) {
    var _a, _b;
    var app = wg_core_1.Verification.getAppBySubdomain(req);
    if (app.id) {
        if (wg_core_1.Permission.isSpecialApp(app.id, "modify_permissions")) {
            if (req.body === "object") {
                var app_id = (_a = req.body) === null || _a === void 0 ? void 0 : _a.app_id;
                var permission = (_b = req.body) === null || _b === void 0 ? void 0 : _b.permission;
                if (app_id && permission) {
                    var change = false;
                    switch (type) {
                        case "grant":
                            change = wg_core_1.Permission.grantPermission(app_id, permission);
                            break;
                        case "grant_special":
                            change = wg_core_1.Permission.grantSpecialPermission(app_id, permission);
                            break;
                        case "revoke":
                            change = wg_core_1.Permission.revokePermission(app_id, permission);
                            break;
                        case "revoke_special":
                            change = wg_core_1.Permission.grantSpecialPermission(false, permission);
                            break;
                    }
                    if (change) {
                        res.json(jsonapi.data({ response: change }));
                    }
                    else {
                        res.json(jsonapi.error("api_core_app_error_performing_action"));
                    }
                }
                else {
                    res.json(jsonapi.error("api_core_app_too_few_parameters"));
                }
            }
            else {
                res.json(jsonapi.error("api_core_app_invalid_body"));
            }
        }
        else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    }
    else {
        res.json(jsonapi.error("api_core_app_invalid_app"));
    }
}
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/permission/grant",
    parser: body_parser_1.json(),
    handler: modifyPermission.bind(false, "grant")
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/permission/revoke",
    parser: body_parser_1.json(),
    handler: modifyPermission.bind(false, "revoke")
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/permission/special/grant",
    parser: body_parser_1.json(),
    handler: modifyPermission.bind(false, "grant_special")
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/permission/special/revoke",
    parser: body_parser_1.json(),
    handler: modifyPermission.bind(false, "revoke_special")
});
exports.default = wg_core_1.Driver.export();
