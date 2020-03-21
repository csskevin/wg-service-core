import { Service } from "wg-core";

import AppHandler from "./src/apphandler";
import FileHandler from "./src/filehandler";
import PermissionHandler from "./src/permissionhandler";

const services: Array<Service> = [];

export default services.concat(FileHandler, PermissionHandler, AppHandler);