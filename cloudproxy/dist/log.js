"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let requests = 0;
const LOG_HTML = false;
exports.default = Object.assign({ incRequests: () => { requests++; }, html(html) {
        if (LOG_HTML)
            this.debug(html);
    } }, require('console-log-level')({
    level: 'info',
    prefix(level) {
        return `${new Date().toISOString()} ${level.toUpperCase()} REQ-${requests}`;
    }
}));
//# sourceMappingURL=log.js.map