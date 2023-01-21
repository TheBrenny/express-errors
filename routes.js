const errors = require("./generic").errors;

let isProd = true;

const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
    dim: {
        sim: "\x1b[2m",
        red: "\x1b[31;2m",
        green: "\x1b[32;2m",
        yellow: "\x1b[33;2m",
        blue: "\x1b[34;2m",
        magenta: "\x1b[35;2m",
        cyan: "\x1b[36;2m",
        white: "\x1b[37;2m",
        reset: "\x1b[22m"
    }
};

module.exports = (setIsProd) => {
    isProd = setIsProd;
    return module.exports;
};

// Forward export the error objects
module.exports.errors = errors;

// 404
module.exports.notFound = ((req, res, _) => {
    throw errors.notFound.fromReq(req);
});

// Catches errors
module.exports.handler = ((err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : (err.status ?? (isNaN(err.code) ? 500 : err.code));
    res.status(statusCode);

    let e = {
        code: statusCode,
        name: err.name || "Error",
        message: err.message
    };

    // if debugging, add stack trace
    if(!isProd) {
        e.stack = err.stack;

        console.error(`${colors.red}--- Error! ---`);
        console.error(`Code: ${colors.yellow}${e.code}${colors.red}`);
        console.error(`Name: ${colors.yellow}${e.name}${colors.red}`);
        console.error(`Message: ${colors.yellow}${e.message}${colors.red}`);
        console.error(`Stack:${colors.dim.yellow}`);
        console.error(e.stack.split("\n").slice(1).map((line, i) => {
            let isNodeInternal = line.indexOf("node_modules") !== -1 || line.indexOf("internal/") !== -1 || line.indexOf("node:internal") !== -1;
            if(!isNodeInternal) line = `${colors.dim.reset + line + colors.dim.sim}`;
            return line;
        }).join("\n"));
        console.error(`${colors.dim.reset + colors.red}--- Error! ---${colors.reset}`);
    }

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
            };

            res.render("error", {
                "error": e
            });
        },
        "default": () => res.send(JSON.stringify(e)).end()
    });
});
