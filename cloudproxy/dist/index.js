"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const http_1 = require("http");
const routes_1 = require("./routes");
const version = require('../package.json').version;
const serverPort = 8082;
const serverHost = 'localhost';
function errorResponse(errorMsg, res, startTimestamp) {
    log_1.default.error(errorMsg);
    const response = {
        status: 'error',
        message: errorMsg,
        startTimestamp,
        endTimestamp: Date.now(),
        version
    };
    res.writeHead(500, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(response));
    res.end();
}
function successResponse(successMsg, extendedProperties, res, startTimestamp) {
    const endTimestamp = Date.now();
    log_1.default.info(`Successful response in ${(endTimestamp - startTimestamp) / 1000} s`);
    if (successMsg) {
        log_1.default.info(successMsg);
    }
    const response = Object.assign({
        status: 'ok',
        message: successMsg || '',
        startTimestamp,
        endTimestamp,
        version
    }, extendedProperties || {});
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(response));
    res.end();
}
function validateIncomingRequest(ctx, params) {
    log_1.default.info(`Params: ${JSON.stringify(params)}`);
    if (ctx.req.method !== 'POST') {
        ctx.errorResponse('Only the POST method is allowed');
        return false;
    }
    if (ctx.req.url !== '/v1') {
        ctx.errorResponse('Only /v1 endpoint is allowed');
        return false;
    }
    if (!params.cmd) {
        ctx.errorResponse("Parameter 'cmd' is mandatory");
        return false;
    }
    return true;
}
http_1.createServer((req, res) => {
    log_1.default.incRequests();
    const startTimestamp = Date.now();
    log_1.default.info(`Incoming request: ${req.method} ${req.url}`);
    const bodyParts = [];
    req.on('data', chunk => {
        bodyParts.push(chunk);
    }).on('end', () => {
        const body = Buffer.concat(bodyParts).toString();
        let params = null;
        try {
            params = JSON.parse(body);
        }
        catch (err) {
            errorResponse('Body must be in JSON format', res, startTimestamp);
            return;
        }
        const ctx = {
            req,
            res,
            startTimestamp,
            errorResponse: (msg) => errorResponse(msg, res, startTimestamp),
            successResponse: (msg, extendedProperties) => successResponse(msg, extendedProperties, res, startTimestamp)
        };
        if (!validateIncomingRequest(ctx, params)) {
            return;
        }
        routes_1.default(ctx, params).catch(e => {
            console.error(e);
            ctx.errorResponse(e.message);
        });
    });
}).listen(serverPort, serverHost, () => {
    log_1.default.info(`CloudProxy v${version} listening on http://${serverHost}:${serverPort}`);
});
//# sourceMappingURL=index.js.map