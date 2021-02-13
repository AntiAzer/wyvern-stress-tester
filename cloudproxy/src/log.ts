let requests = 0

const LOG_HTML: boolean = false

export default {
  incRequests: () => { requests++ },
  html(html: string) {
    if (LOG_HTML)
      this.debug(html)
  },
  ...require('console-log-level')(
    {
      level: 'info',
      prefix(level: string) {
        return `${new Date().toISOString()} ${level.toUpperCase()} REQ-${requests}`
      }
    }
  )
}