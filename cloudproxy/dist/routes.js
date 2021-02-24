"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const uuid_1 = require("uuid");
const session_1 = require("./session");
const log_1 = require("./log");
const Errors_1 = require("puppeteer/Errors");
const captcha_1 = require("./captcha");
const CHALLENGE_SELECTORS = ['#trk_jschal_js', '.ray_id', '.attack-box'];
const TOKEN_INPUT_NAMES = ['g-recaptcha-response', 'h-captcha-response'];
async function interceptResponse(page, callback) {
    const client = await page.target().createCDPSession();
    await client.send('Fetch.enable', {
        patterns: [
            {
                urlPattern: '*',
                resourceType: 'Document',
                requestStage: 'Response',
            },
        ],
    });
    client.on('Fetch.requestPaused', async (e) => {
        log_1.default.debug('Fetch.requestPaused. Checking if the response has valid cookies');
        let headers = e.responseHeaders || [];
        let cookies = await page.cookies();
        log_1.default.debug(cookies);
        if (cookies.filter((c) => c.name === 'cf_clearance').length > 0) {
            log_1.default.debug('Aborting request and return cookies. valid cookies found');
            await client.send('Fetch.failRequest', { requestId: e.requestId, errorReason: 'Aborted' });
            let status = 'ok';
            let message = '';
            const payload = {
                status,
                message,
                result: {
                    url: page.url(),
                    status: e.status,
                    headers: headers.reduce((a, x) => (Object.assign(Object.assign({}, a), { [x.name]: x.value })), {}),
                    response: null,
                    cookies: cookies,
                    userAgent: ''
                }
            };
            callback(payload);
        }
        else {
            log_1.default.debug('Continuing request. no valid cookies found');
            await client.send('Fetch.continueRequest', { requestId: e.requestId });
        }
    });
}
async function resolveChallenge(ctx, { url, userAgent, maxTimeout, proxy, download, returnOnlyCookies, apiKey, sitekey }, page) {
    maxTimeout = maxTimeout || 60000;
    let status = 'ok';
    let message = '';
    if (proxy) {
        log_1.default.debug("Apply proxy");
    }
    log_1.default.debug(`Navigating to... ${url}`);
    let response = await page.goto(url, { waitUntil: 'domcontentloaded' });
    if (response.headers().server.startsWith('cloudflare')) {
        log_1.default.info('Cloudflare detected');
        if (await page.$('.cf-error-code')) {
            await page.close();
            return ctx.errorResponse('Cloudflare has blocked this request (Code 1020 Detected).');
        }
        if (response.status() > 400) {
            for (const selector of CHALLENGE_SELECTORS) {
                const cfChallengeElem = await page.$(selector);
                if (cfChallengeElem) {
                    log_1.default.html(await page.content());
                    log_1.default.debug('Waiting for Cloudflare challenge...');
                    let interceptingResult;
                    if (returnOnlyCookies) {
                        await interceptResponse(page, async function (payload) {
                            interceptingResult = payload;
                        });
                    }
                    while (Date.now() - ctx.startTimestamp < maxTimeout) {
                        await page.waitFor(1000);
                        try {
                            response = await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 });
                        }
                        catch (error) { }
                        if (returnOnlyCookies && interceptingResult) {
                            await page.close();
                            return interceptingResult;
                        }
                        try {
                            const cfChallengeElem = await page.$(selector);
                            if (!cfChallengeElem || await page.$('input[name="cf_captcha_kind"]')) {
                                break;
                            }
                            log_1.default.debug('Found challenge element again...');
                        }
                        catch (error) { }
                        response = await page.reload({ waitUntil: 'domcontentloaded' });
                        log_1.default.debug('Reloaded page...');
                    }
                    if (Date.now() - ctx.startTimestamp >= maxTimeout) {
                        ctx.errorResponse(`Maximum timeout reached. maxTimeout=${maxTimeout} (ms)`);
                        return;
                    }
                    log_1.default.debug('Validating HTML code...');
                    break;
                }
                else {
                    log_1.default.debug(`No '${selector}' challenge element detected.`);
                }
            }
        }
        if (await page.$('input[name="cf_captcha_kind"]')) {
            const captchaSolver = captcha_1.default();
            if (captchaSolver) {
                const captchaStartTimestamp = Date.now();
                const challengeForm = await page.$('#challenge-form');
                if (challengeForm) {
                    log_1.default.html(await page.content());
                    const captchaTypeElm = await page.$('input[name="cf_captcha_kind"]');
                    const cfCaptchaType = await captchaTypeElm.evaluate((e) => e.value);
                    const captchaType = captcha_1.CaptchaType[cfCaptchaType];
                    if (!captchaType) {
                        return ctx.errorResponse('Unknown captcha type!');
                    }
                    log_1.default.info('Waiting to receive captcha token to bypass challenge...');
                    const token = await captchaSolver({
                        url,
                        sitekey,
                        apiKey,
                        type: captchaType
                    });
                    if (!token) {
                        await page.close();
                        return ctx.errorResponse('Token solver failed to return a token.');
                    }
                    for (const name of TOKEN_INPUT_NAMES) {
                        const input = await page.$(`textarea[name="${name}"]`);
                        if (input) {
                            await input.evaluate((e, token) => { e.value = token; }, token);
                        }
                    }
                    await page.evaluate(() => {
                        window.addEventListener('submit', (e) => { event.stopPropagation(); }, true);
                    });
                    try {
                        await page.waitForSelector('#challenge-form', { timeout: 10000 });
                    }
                    catch (err) {
                        if (err instanceof Errors_1.TimeoutError) {
                            log_1.default.debug(`No '#challenge-form' element detected.`);
                        }
                    }
                    const captchaSolveTotalTime = Date.now() - captchaStartTimestamp;
                    const randomWaitTime = (Math.floor(Math.random() * 20) + 10) * 1000;
                    const timeLeft = randomWaitTime - captchaSolveTotalTime;
                    if (timeLeft > 0) {
                        await page.waitFor(timeLeft);
                    }
                    let interceptingResult;
                    if (returnOnlyCookies) {
                        await interceptResponse(page, async function (payload) {
                            interceptingResult = payload;
                        });
                    }
                    challengeForm.evaluate((e) => e.submit());
                    response = await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                    if (returnOnlyCookies && interceptingResult) {
                        await page.close();
                        return interceptingResult;
                    }
                }
            }
            else {
                status = 'warning';
                message = 'Captcha detected but no automatic solver is configured.';
            }
        }
    }
    const payload = {
        status,
        message,
        result: {
            url: page.url(),
            status: response.status(),
            headers: response.headers(),
            response: null,
            cookies: await page.cookies(),
            userAgent: await page.evaluate(() => navigator.userAgent)
        }
    };
    if (download) {
        response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        payload.result.response = (await response.buffer()).toString('base64');
    }
    else {
        payload.result.response = await page.content();
    }
    await page.close();
    return payload;
}
function mergeSessionWithParams({ defaults }, params) {
    const copy = Object.assign(Object.assign({}, defaults), params);
    copy.headers = Object.assign(Object.assign({}, defaults.headers || {}), params.headers || {}) || null;
    return copy;
}
async function setupPage(ctx, params, browser) {
    const page = await browser.newPage();
    const { method, postData, userAgent, headers, cookies, proxy } = params;
    let overrideResolvers = {};
    if (method !== 'GET') {
        log_1.default.debug(`Setting method to ${method}`);
        overrideResolvers.method = request => method;
    }
    if (postData) {
        log_1.default.debug(`Setting body data to ${postData}`);
        overrideResolvers.postData = request => postData;
    }
    if (userAgent) {
        log_1.default.debug(`Using custom UA: ${userAgent}`);
        await page.setUserAgent(userAgent);
    }
    if (headers) {
        log_1.default.debug(`Adding custom headers: ${JSON.stringify(headers, null, 2)}`);
        overrideResolvers.headers = request => Object.assign(request.headers(), headers);
    }
    if (cookies) {
        log_1.default.debug(`Setting custom cookies: ${JSON.stringify(cookies, null, 2)}`);
        await page.setCookie(...cookies);
    }
    if (Object.keys(overrideResolvers).length > 0) {
        log_1.default.debug(overrideResolvers);
        let callbackRunOnce = false;
        const callback = (request) => {
            if (callbackRunOnce || !request.isNavigationRequest()) {
                request.continue();
                return;
            }
            callbackRunOnce = true;
            const overrides = {};
            Object.keys(overrideResolvers).forEach((key) => {
                overrides[key] = overrideResolvers[key](request);
            });
            log_1.default.debug(overrides);
            request.continue(overrides);
        };
        await page.setRequestInterception(true);
        page.on('request', callback);
    }
    return page;
}
const browserRequest = async (ctx, params) => {
    const oneTimeSession = params.session === undefined;
    const sessionId = params.session || uuid_1.v1();
    const session = oneTimeSession
        ? await session_1.default.create(sessionId, {
            userAgent: params.userAgent,
            proxy: params.proxy,
            oneTimeSession
        })
        : session_1.default.get(sessionId);
    if (session === false) {
        return ctx.errorResponse('This session does not exist. Use \'list_sessions\' to see all the existing sessions.');
    }
    params = mergeSessionWithParams(session, params);
    try {
        const page = await setupPage(ctx, params, session.browser);
        page.on('dialog', async (dialog) => {
            await dialog.dismiss();
        });
        const data = await resolveChallenge(ctx, params, page);
        if (data) {
            const { status } = data;
            delete data.status;
            ctx.successResponse(data.message, Object.assign(Object.assign(Object.assign({}, (oneTimeSession ? {} : { session: sessionId })), (status ? { status } : {})), { solution: data.result }));
        }
    }
    catch (error) {
        log_1.default.error(error);
        return ctx.errorResponse("Unable to process browser request");
    }
    finally {
        if (oneTimeSession) {
            session_1.default.destroy(sessionId);
        }
    }
};
exports.routes = {
    'sessions.create': async (ctx, _a) => {
        var { session } = _a, options = __rest(_a, ["session"]);
        session = session || uuid_1.v1();
        const { browser } = await session_1.default.create(session, options);
        if (browser) {
            ctx.successResponse('Session created successfully.', { session });
        }
    },
    'sessions.list': (ctx) => {
        ctx.successResponse(null, { sessions: session_1.default.list() });
    },
    'sessions.destroy': async (ctx, { session }) => {
        if (await session_1.default.destroy(session)) {
            return ctx.successResponse('The session has been removed.');
        }
        ctx.errorResponse('This session does not exist.');
    },
    'request.get': async (ctx, params) => {
        params.method = 'GET';
        if (params.postData) {
            return ctx.errorResponse('Cannot use "postBody" when sending a GET request.');
        }
        await browserRequest(ctx, params);
    },
    'request.post': async (ctx, params) => {
        params.method = 'POST';
        if (!params.postData) {
            return ctx.errorResponse('Must send param "postBody" when sending a POST request.');
        }
        await browserRequest(ctx, params);
    },
    'request.cookies': async (ctx, params) => {
        params.returnOnlyCookies = true;
        params.method = 'GET';
        if (params.postData) {
            return ctx.errorResponse('Cannot use "postBody" when sending a GET request.');
        }
        await browserRequest(ctx, params);
    },
};
async function Router(ctx, params) {
    const route = exports.routes[params.cmd];
    if (route) {
        return await route(ctx, params);
    }
    return ctx.errorResponse(`The command '${params.cmd}' is invalid.`);
}
exports.default = Router;
//# sourceMappingURL=routes.js.map