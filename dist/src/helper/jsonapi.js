"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
;
var JsonAPI = /** @class */ (function () {
    function JsonAPI() {
        this.error_instance = {};
    }
    JsonAPI.prototype.setErrorMessageInstance = function (instance) {
        this.error_instance = instance;
    };
    JsonAPI.prototype.findErrorMessageByCode = function (codes) {
        var errors = this.error_instance.getMessages().filter(function (error_message) { return codes.includes(error_message.code); });
        errors.map(function (error) { error.id = uuid_1.v4(); });
        return errors;
    };
    JsonAPI.prototype.result = function (data, error_codes) {
        return {
            data: data,
            error: this.findErrorMessageByCode(error_codes),
            meta: {
                "copyright": "Copyright Web-Glasses",
                "authors": [
                    "Kevin Saiger <saigerkevin4@gmail.com>"
                ]
            }
        };
    };
    JsonAPI.prototype.error = function () {
        var error_code = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            error_code[_i] = arguments[_i];
        }
        return this.result(null, error_code);
    };
    JsonAPI.prototype.data = function (data) {
        return this.result(data, []);
    };
    return JsonAPI;
}());
var ErrorMessages = /** @class */ (function () {
    function ErrorMessages() {
        this.messages = [];
    }
    ErrorMessages.prototype.addMessage = function (code, title, description) {
        var error = {};
        error.id = '';
        error.code = code;
        error.title = title;
        error.description = description || "";
        this.messages.push(error);
    };
    ErrorMessages.prototype.getMessages = function () {
        return this.messages;
    };
    return ErrorMessages;
}());
exports.ErrorMessages = ErrorMessages;
exports.default = JsonAPI;
