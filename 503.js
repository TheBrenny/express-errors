const ErrorGeneric = require("./generic");

const reasons = {
    MAINTENANCE: "down for maintenance",
    OVERLOADED: "overloaded"
}

class Error503 extends ErrorGeneric {
    constructor(method, url, reason = reasons.MAINTENANCE) {
        super(503, "Service Unavailable", `${method.toUpperCase()} ${url} is currently ${reason}`);
    }
}

module.exports = Error503;
module.exports.reason = reason;