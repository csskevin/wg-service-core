import * as fs from "fs";
import Core from "wg-core";
const body_parser = require("body-parser");

Core.Driver.register({
    method: "get",
    path: "/",
    handler: function (req, res) {
        const app = Core.Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return }
        const file_entry = app.entry || "index.html";
        res.redirect("/" + file_entry);
    }
});

Core.Driver.register({
    method: "get",
    path: "/*",
    handler: function (req, res) {
        const app = Core.Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        const filepath = req.params[0] || "index.html";
        const app_fullpath = Core.Workfolder.app_path + "/" + app.package_name + "/" + app.entry + "/" + filepath;
        if (fs.existsSync(app_fullpath)) {
            const realpath_app_fullpath = fs.realpathSync(app_fullpath);
            res.sendFile(realpath_app_fullpath);
        }
        else {
            res.send("Could not find file!");
        }
    }
});

Core.Driver.register({
    method: "post",
    path: "/api/install_app",
    parser: body_parser.json,
    handler: function (req, res) {
        const app = Core.Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Core.Permission.hasSpecificPermission(app.id, "apps_control")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const path = request_body?.path;
                if (path) {
                    Core.Apps.installApp(path).then(() => {
                        res.json({ error: 0, message: "App installed." });
                    }).catch((err) => {
                        res.json({ error: 1, message: err });
                    });
                } else {
                    res.json({ error: 1, message: "Invalid filepath." });
                }
            } else {
                res.json({ error: 1, message: "Invalid body." });
            }
        } else {
            res.json({ error: 1, message: "No permissions." });
        }
    }
});

Core.Driver.register({
    method: "post",
    path: "/api/uninstall_app",
    parser: body_parser.json,
    handler: function (req, res) {
        const app = Core.Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Core.Permission.hasSpecificPermission(app.id, "apps_control")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const app_name = request_body?.app_name;
                if (app_name) {
                    if(Core.Apps.uninstallApp(app_name)) {
                        res.json({ error: 0, message: "App uninstalled." });
                    } else {
                        res.json({ error: 1, message: "App could not be uninstalled." });
                    }
                } else {
                    res.json({ error: 1, message: "Invalid filepath." });
                }
            } else {
                res.json({ error: 1, message: "Invalid body." });
            }
        } else {
            res.json({ error: 1, message: "No permissions." });
        }
    }
});

export default Core.Driver.export();