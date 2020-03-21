"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apphandler_1 = __importDefault(require("./src/apphandler"));
var filehandler_1 = __importDefault(require("./src/filehandler"));
var permissionhandler_1 = __importDefault(require("./src/permissionhandler"));
var services = [];
exports.default = services.concat(filehandler_1.default, permissionhandler_1.default, apphandler_1.default);
