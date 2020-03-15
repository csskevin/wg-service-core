"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var wg_core_1 = require("wg-core");
var body_parser = require("body-parser");
wg_core_1.Driver.register({
    method: "get",
    path: "/",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        var file_entry = app.entry || "index.html";
        res.redirect("/" + file_entry);
    }
});
wg_core_1.Driver.register({
    method: "get",
    path: "/*",
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        var filepath = req.params[0] || "index.html";
        var app_fullpath = wg_core_1.Workfolder.app_path + "/" + app.package_name + "/" + app.entry + "/" + filepath;
        if (fs.existsSync(app_fullpath)) {
            var realpath_app_fullpath = fs.realpathSync(app_fullpath);
            res.sendFile(realpath_app_fullpath);
        }
        else {
            res.send("Could not find file!");
        }
    }
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/install_app",
    parser: body_parser.json,
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        if (wg_core_1.Permission.hasSpecificPermission(app.id, "apps_control")) {
            var request_body = req.body;
            if (typeof request_body === 'object') {
                var path = request_body === null || request_body === void 0 ? void 0 : request_body.path;
                if (path) {
                    wg_core_1.Apps.installApp(path).then(function () {
                        res.json({ error: 0, message: "App installed." });
                    }).catch(function (err) {
                        res.json({ error: 1, message: err });
                    });
                }
                else {
                    res.json({ error: 1, message: "Invalid filepath." });
                }
            }
            else {
                res.json({ error: 1, message: "Invalid body." });
            }
        }
        else {
            res.json({ error: 1, message: "No permissions." });
        }
    }
});
wg_core_1.Driver.register({
    method: "post",
    path: "/api/uninstall_app",
    parser: body_parser.json,
    handler: function (req, res) {
        var app = wg_core_1.Verification.getAppBySubdomain(req);
        if (app.id === false) {
            res.send("Could not find app!");
            return;
        }
        if (wg_core_1.Permission.hasSpecificPermission(app.id, "apps_control")) {
            var request_body = req.body;
            if (typeof request_body === 'object') {
                var app_name = request_body === null || request_body === void 0 ? void 0 : request_body.app_name;
                if (app_name) {
                    if (wg_core_1.Apps.uninstallApp(app_name)) {
                        res.json({ error: 0, message: "App uninstalled." });
                    }
                    else {
                        res.json({ error: 1, message: "App could not be uninstalled." });
                    }
                }
                else {
                    res.json({ error: 1, message: "Invalid filepath." });
                }
            }
            else {
                res.json({ error: 1, message: "Invalid body." });
            }
        }
        else {
            res.json({ error: 1, message: "No permissions." });
        }
    }
});
exports.default = wg_core_1.Driver.export();
