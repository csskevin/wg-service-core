import { Files, Driver, Verification } from "wg-core";
import { raw } from "body-parser";
import JsonAPI from "./helper/jsonapi";
import ErrorMessages from "./helper/messages";

const jsonapi = new JsonAPI();
jsonapi.setErrorMessageInstance(ErrorMessages);

Driver.register({
    method: "post",
    path: "/api/core/files/write",
    parser: raw({type: "text/plain"}),
    handler: function (req, res) {
        const app = Verification.getAppBySubdomain(req);
        if (app.id) {
            const body: Buffer = req.body;
            const path: string = req.query?.path;
            if (path) {
                if(Files.writeFile(app.package_name, path, body.toString())) {
                    res.json(jsonapi.data({ written: body.length }))
                } else {
                    res.json(jsonapi.error("api_core_app_error_performing_action"));
                }
            }
            else
            {
                res.json(jsonapi.error("api_core_app_too_few_parameters"));
            }
        }
        else {
            res.json(jsonapi.error("api_core_app_invalid_app"));
        }
    }
});

function file_modifications(type: string, req: any, res: any) {
    const app = Verification.getAppBySubdomain(req);
    if (app.id) {
        const path: string = req.query?.path;
        if (path) {
            let is_succeeded: any = false;
            switch(type) {
                case "mkdir":
                    is_succeeded = Files.mkdir(app.package_name, path);
                    break;
                case "rmdir":
                    is_succeeded = Files.rmdir(app.package_name, path);
                    break;
                case "unlink":
                    is_succeeded = Files.unlinkFile(app.package_name, path);
                    break;
                case "read":
                    is_succeeded = Files.readFile(app.package_name, path);
                    break;
            }
            if(is_succeeded) {
                res.json(jsonapi.data({ response: is_succeeded }))
            } else {
                res.json(jsonapi.error("api_core_app_error_performing_action"));
            }
        }
        else
        {
            res.json(jsonapi.error("api_core_app_too_few_parameters"));
        }
    }
    else {
        res.json(jsonapi.error("api_core_app_invalid_app"));
    }
}

["mkdir", "rmdir", "unlink", "read"].forEach(action => {
    Driver.register({
        method: "post",
        path: "/api/core/files/" + action,
        handler: file_modifications.bind(false, action)
    });
})

export default Driver.export();