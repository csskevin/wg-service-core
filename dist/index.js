"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apphandler_1 = __importDefault(require("./src/apphandler"));
var services = [];
exports.default = services.concat(apphandler_1.default);
