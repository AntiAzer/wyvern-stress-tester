"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaType = void 0;
var CaptchaType;
(function (CaptchaType) {
    CaptchaType["re"] = "reCaptcha";
    CaptchaType["h"] = "hCaptcha";
})(CaptchaType = exports.CaptchaType || (exports.CaptchaType = {}));
var captchaSolvers = null;
exports.default = () => {
    try {
        captchaSolvers = require('./anti-captcha').default;
    }
    catch (e) {
        console.error(e);
        throw Error(`An error occured loading the solver.`);
    }
    return captchaSolvers;
};
//# sourceMappingURL=index.js.map