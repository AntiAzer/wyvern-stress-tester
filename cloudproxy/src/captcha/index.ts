export enum CaptchaType {
  re = 'reCaptcha',
  h = 'hCaptcha'
}

export interface SolverOptions {
  url: string
  sitekey: string
  apiKey: string
  type: CaptchaType
}

export type Solver = (options: SolverOptions) => Promise<string>

var captchaSolvers: Solver = null;

export default (): Solver => {
  try {
    captchaSolvers = require('./anti-captcha').default as Solver
  } catch (e) {
    console.error(e)
    throw Error(`An error occured loading the solver.`)
  }
  return captchaSolvers
}