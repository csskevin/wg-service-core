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
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/files/write",
    parser: body_parser_1.raw({ type: "text/plain" }),
    handler: function (req, res) {
        var _a;
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id) {
            var body = req.body;
            var path = (_a = req.query) === null || _a === void 0 ? void 0 : _a.path;
            if (path) {
                if (wg_core_1.Files.writeFile(app.package_name, path, body.toString())) {
                    res.json(jsonapi.data({ written: body.length }));
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
            res.json(jsonapi.error("api_core_app_invalid_app"));
        }
    }
});
function file_modifications(type, req, res) {
    var _a;
    var app = wg_core_1.Verification.getAppBySubdomain(req);
    if (app.id) {
        var path = (_a = req.query) === null || _a === void 0 ? void 0 : _a.path;
        if (path) {
            var is_succeeded = false;
            switch (type) {
                case "mkdir":
                    is_succeeded = wg_core_1.Files.mkdir(app.package_name, path);
                    break;
                case "rmdir":
                    is_succeeded = wg_core_1.Files.rmdir(app.package_name, path);
                    break;
                case "unlink":
                    is_succeeded = wg_core_1.Files.unlinkFile(app.package_name, path);
                    break;
                case "read":
                    is_succeeded = wg_core_1.Files.readFile(app.package_name, path);
                    break;
            }
            if (is_succeeded) {
                res.json(jsonapi.data({ response: is_succeeded }));
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
        res.json(jsonapi.error("api_core_app_invalid_app"));
    }
}
["mkdir", "rmdir", "unlink", "read"].forEach(function (action) {
    wg_core_1.Driver.register({
        method: "post",
        path: "/api/core/files/" + action,
        handler: file_modifications.bind(false, action)
    });
});
exports.default = wg_core_1.Driver.export();
