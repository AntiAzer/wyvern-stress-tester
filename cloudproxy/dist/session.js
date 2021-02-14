"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const fs = require("fs");
const puppeteer_extra_1 = require("puppeteer-extra");
const log_1 = require("./log");
const utils_1 = require("./utils");
const sessionCache = {};
puppeteer_extra_1.default.use(require('puppeteer-extra-plugin-stealth')());
function userDataDirFromId(id) {
    return path.join(os.tmpdir(), `/puppeteer_chrome_profile_${id}`);
}
function prepareBrowserProfile(id) {
    const userDataDir = userDataDirFromId(id);
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
    }
    return userDataDir;
}
exports.default = {
    create: async (id, { proxy, cookies, oneTimeSession, userAgent, headers, maxTimeout }) => {
        let args = ['--no-sandbox', '--disable-setuid-sandbox'];
        if (proxy) {
            log_1.default.debug(proxy);
            args.push(`--proxy-server=${proxy}`);
        }
        const puppeteerOptions = {
            product: 'chrome',
            headless: true,
            args
        };
        if (!oneTimeSession) {
            log_1.default.debug('Creating userDataDir for session.');
            puppeteerOptions.userDataDir = prepareBrowserProfile(id);
        }
        log_1.default.debug('Launching headless browser...');
        let launchTries = 3;
        let browser;
        while (0 <= launchTries--) {
            try {
                browser = await puppeteer_extra_1.default.launch(puppeteerOptions);
                break;
            }
            catch (e) {
                if (e.message !== 'Failed to launch the browser process!')
                    throw e;
                log_1.default.warn('Failed to open browser, trying again...');
            }
        }
        if (!browser) {
            throw Error(`Failed to lanch browser 3 times in a row.`);
        }
        if (cookies) {
            const page = await browser.newPage();
            await page.setCookie(...cookies);
        }
        sessionCache[id] = {
            browser,
            userDataDir: puppeteerOptions.userDataDir,
            defaults: utils_1.removeEmptyFields({
                userAgent,
                headers,
                maxTimeout
            })
        };
        return sessionCache[id];
    },
    list: () => Object.keys(sessionCache),
    destroy: async (id) => {
        const { browser, userDataDir } = sessionCache[id];
        if (browser) {
            await browser.close();
            delete sessionCache[id];
            if (userDataDir) {
                const userDataDirPath = userDataDirFromId(id);
                try {
                    await utils_1.sleep(5000);
                    utils_1.deleteFolderRecursive(userDataDirPath);
                }
                catch (e) {
                    console.error(e);
                    throw Error(`Error deleting browser session folder. ${e.message}`);
                }
            }
            return true;
        }
        return false;
    },
    get: (id) => sessionCache[id] && sessionCache[id] || false
};
//# sourceMappingURL=session.js.map