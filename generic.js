class ErrorGeneric extends Error {
    constructor(code, name, message) {
        super(message);
        this.code = code;
        this.status = code;
        this.name = name;
    }

    static fromReq(req, ...args) {
        let e = new(this.prototype.constructor)(req.method, req.url, ...args);
        let stack = e.stack.split("\n");
        stack.splice(1, 2);
        e.stack = stack.join("\n");
        return e;
    }
}

module.exports = ErrorGeneric;

const badRequest = require("./400");
const forbidden = require("./403");
const notFound = require("./404");
const conflict = require("./409");
const internalServerError = require("./500");
const notImplemented = require("./501");
const serviceUnavailable = require("./503");

module.exports.errors = {
    400: badRequest,
    403: forbidden,
    404: notFound,
    409: conflict,
    500: internalServerError,
    501: notImplemented,
    503: serviceUnavailable,
    badRequest,
    forbidden,
    notFound,
    conflict,
    internalServerError,
    notImplemented,
    serviceUnavailable,
};