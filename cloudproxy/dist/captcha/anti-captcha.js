"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function solve({ url, sitekey, apiKey }) {
    try {
        const ac = require("@antiadmin/anticaptchaofficial");
        ac.setAPIKey(apiKey);
        const token = ac.solveHCaptchaProxyless(url, sitekey);
        return token;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
exports.default = solve;
//# sourceMappingURL=anti-captcha.js.map