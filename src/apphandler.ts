import * as fs from "fs";
import { Driver, Verification, Workfolder, Apps, Permission } from "wg-core";
const body_parser = require("body-parser");

Driver.register({
    method: "get",
    path: "/",
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return }
        const file_entry = app.entry || "index.html";
        res.redirect("/" + file_entry);
    }
});

Driver.register({
    method: "get",
    path: "/*",
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        const filepath = req.params[0] || "index.html";
        const app_fullpath = Workfolder.app_path + "/" + app.package_name + "/" + app.entry + "/" + filepath;
        if (fs.existsSync(app_fullpath)) {
            const realpath_app_fullpath = fs.realpathSync(app_fullpath);
            res.sendFile(realpath_app_fullpath);
        }
        else {
            res.send("Could not find file!");
        }
    }
});

Driver.register({
    method: "post",
    path: "/api/install_app",
    parser: body_parser.json,
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Permission.hasSpecificPermission(app.id, "apps_control")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const path = request_body?.path;
                if (path) {
                    Apps.installApp(path).then(() => {
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

Driver.register({
    method: "post",
    path: "/api/uninstall_app",
    parser: body_parser.json,
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Permission.hasSpecificPermission(app.id, "apps_control")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const app_name = request_body?.app_name;
                if (app_name) {
                    if(Apps.uninstallApp(app_name)) {
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

export default Driver.export();