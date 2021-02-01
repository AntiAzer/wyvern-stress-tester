import { SolverOptions } from '.'

export default async function solve({ url, sitekey, apiKey }: SolverOptions): Promise<string> {
    try {
        const ac = require("@antiadmin/anticaptchaofficial")
        ac.setAPIKey(apiKey)
        const token = ac.solveHCaptchaProxyless(url, sitekey)
        return token    
    } catch (e) {
        console.error(e)
        return null
    }
}
