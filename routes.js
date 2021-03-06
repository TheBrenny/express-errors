const errors = require("./generic").errors;

let isProd = true;

const modExports = {};

module.exports = (setIsProd) => {
    isProd = setIsProd;
    return modExports;
};

// Forward export the error objects
module.exports.errors = modExports.errors = errors;

// 404
module.exports.notFound = modExports.notFound = ((req, res, _) => {
    throw errors.notFound.fromReq(req);
});

// Catches errors
module.exports.handler = modExports.handler = ((err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : err.code || 500;
    res.status(statusCode);

    let e = {
        code: statusCode,
        name: err.name || "Error",
        message: err.message
    };

    // don't send the stack because of security risk!
    if(!isProd) {
        e.stack = err.stack;
    }

    console.error(e);

    if(res.headersSent) {
        return next(err);
    }

    res.format({
        "json": () => res.json(e),
        "html": () => {
            if(!!e.stack) {
                e.stack = e.stack.split("\n").map((line, i) => {
                    let isNodeInternal = line.indexOf("node_modules") !== -1 || line.indexOf("internal/") !== -1 || line.indexOf("node:internal") !== -1;
                    if(i === 0 || !isNodeInternal) line = `<span class="highlight">${line}</span>`;
                    return line;
                }).join("\n");
            }
            res.render("error", {
                "error": e
            });
        },
        "default": () => res.send(JSON.stringify(e)).end()
    });
});
