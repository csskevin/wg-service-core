import * as fs from "fs";
import { Driver, Verification, Workfolder, Apps, Permission } from "wg-core";
import { json } from "body-parser";
import JsonAPI from "./helper/jsonapi";
import ErrorMessages from "./helper/messages";

const jsonapi = new JsonAPI();

jsonapi.setErrorMessageInstance(ErrorMessages);

Driver.register({
    method: "post",
    path: "/api/core/apps/install",
    parser: json(),
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send(jsonapi.error("api_core_app_invalid_app")); return; }
        if (Permission.isSpecialApp(app.id, "modify_apps")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const path = request_body?.path;
                if (path) {
                    Apps.installApp(path).then((app_id) => {
                        res.json(jsonapi.data({ "app_id": app_id }));
                    }).catch(() => {
                        res.json(jsonapi.error("api_unknown_error"));
                    });
                } else {
                    res.json(jsonapi.error("api_core_app_invalid_file"));
                }
            } else {
                res.json(jsonapi.error("api_core_app_invalid_body"));
            }
        } else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    }
});

Driver.register({
    method: "post",
    path: "/api/core/apps/uninstall",
    parser: json(),
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Permission.isSpecialApp(app.id, "modify_apps")) {
            const request_body = req.body;
            if (typeof request_body === 'object') {
                const app_name = request_body?.app_name;
                if (app_name === app.package_name) { res.send("Cannot uninstall own app"); return; }
                if (app_name) {
                    if (Apps.uninstallApp(app_name)) {
                        res.json(jsonapi.data({ "app_name": app_name }));
                    } else {
                        res.json(jsonapi.error());
                    }
                } else {
                    res.json(jsonapi.error("api_core_app_invalid_file"));
                }
            } else {
                res.json(jsonapi.error("api_core_app_invalid_body"));
            }
        } else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    }
});

Driver.register({
    method: "get",
    path: "/api/core/apps/all",
    handler: (req, res) => {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        if (Permission.isSpecialApp(app.id, "modify_apps")) {
            res.json(jsonapi.data(Apps.getApps()));
        } else {
            res.json(jsonapi.error("api_core_app_insufficient_permission"));
        }
    }
})

Driver.register({
    method: "get",
    path: "/api/core/apps/own",
    handler: (req, res) => {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send("Could not find app!"); return; }
        res.json(jsonapi.data(Apps.getAppByProperty("id", app.id)));
    }
})

Driver.register({
    method: "get",
    path: "/*",
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send(jsonapi.error("api_core_app_invalid_app")); return; }
        const filepath = req.params[0] || "index.html";
        const app_fullpath = Workfolder.app_path + "/" + app.package_name + "/" + app.entry + "/" + filepath;
        if (fs.existsSync(app_fullpath)) {
            const realpath_app_fullpath = fs.realpathSync(app_fullpath);
            res.sendFile(realpath_app_fullpath);
        }
        else {
            res.send(jsonapi.error("api_core_app_invalid_file")); return;
        }
    }
});

Driver.register({
    method: "get",
    path: "/",
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id === false) { res.send(jsonapi.error("api_core_app_invalid_app")); return }
        const file_entry = app.entry || "index.html";
        res.redirect("/" + file_entry);
    }
});

export default Driver.export();