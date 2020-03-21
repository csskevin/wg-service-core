"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var wg_core_1 = require("wg-core");
var body_parser_1 = require("body-parser");
var jsonapi_1 = __importDefault(require("./helper/jsonapi"));
var messages_1 = __importDefault(require("./helper/messages"));
var jsonapi = new jsonapi_1.default();
jsonapi.setErrorMessageInstance(messages_1.default);
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/apps/install",
    parser: body_parser_1.json(),
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send(jsonapi.error("api_core_app_invalid_app"));
            return;
        }
        if (wg_core_1.Permission.isSpecialApp(app.id, "modify_apps")) {
            var request_body = req.body;
            if (typeof request_body === 'object') {
                var path = request_body === null || request_body === void 0 ? void 0 : request_body.path;
                if (path) {
                    wg_core_1.Apps.installApp(path).then(function (app_id) {
                        res.json(jsonapi.data({ "app_id": app_id }));
                    }).catch(function () {
                        res.json(jsonapi.error("api_unknown_error"));
                    });
                }
                else {
                    res.json(jsonapi.error("api_core_app_invalid_file"));
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
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/core/apps/uninstall",
    parser: body_parser_1.json(),
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        if (wg_core_1.Permission.isSpecialApp(app.id, "modify_apps")) {
            var request_body = req.body;
            if (typeof request_body === 'object') {
                var app_name = request_body === null || request_body === void 0 ? void 0 : request_body.app_name;
                if (app_name === app.package_name) {
                    res.send("Cannot uninstall own app");
                    return;
                }
                if (app_name) {
                    if (wg_core_1.Apps.uninstallApp(app_name)) {
                        res.json(jsonapi.data({ "app_name": app_name }));
                    }
                    else {
                        res.json(jsonapi.error());
                    }
                }
                else {
                    res.json(jsonapi.error("api_core_app_invalid_file"));
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
});
wg_core_1.Driver.register({
    method: "get",
    path: "/api/core/apps/all",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        if (wg_core_1.Permission.isSpecialApp(app.id, "modify_apps")) {
            res.json(jsonapi.data(wg_core_1.Apps.getApps()));
        }
        else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    }
});
wg_core_1.Driver.register({
    method: "get",
    path: "/api/core/apps/own",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        res.json(jsonapi.data(wg_core_1.Apps.getAppByProperty("id", app.id)));
    }
});
wg_core_1.Driver.register({
    method: "get",
    path: "/*",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send(jsonapi.error("api_core_app_invalid_app"));
            return;
        }
        var filepath = req.params[0] || "index.html";
        var app_fullpath = wg_core_1.Workfolder.app_path + "/" + app.package_name + "/" + app.entry + "/" + filepath;
        if (fs.existsSync(app_fullpath)) {
            var realpath_app_fullpath = fs.realpathSync(app_fullpath);
            res.sendFile(realpath_app_fullpath);
        }
        else {
            res.send(jsonapi.error("api_core_app_invalid_file"));
            return;
        }
    }
});
wg_core_1.Driver.register({
    method: "get",
    path: "/",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send(jsonapi.error("api_core_app_invalid_app"));
            return;
        }
        var file_entry = app.entry || "index.html";
        res.redirect("/" + file_entry);
    }
});
exports.default = wg_core_1.Driver.export();
