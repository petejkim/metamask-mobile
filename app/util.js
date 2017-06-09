// @flow
import url from 'url'

export const normalizeUrl = function (urlString: string): string {
  const u = url.parse(urlString)

  const host = u.host
  if (u.protocol && !['http:', 'https:'].includes(u.protocol) &&
    !u.slashes && !u.port && !Number.isNaN(parseInt(host))) {
    u.port = host
    u.hostname = u.protocol.slice(0, -1)
    if (u.hostname && u.port) {
      u.host = `${u.hostname}:${u.port}`
    }
    u.protocol = 'http:'
    if (!u.pathname) {
      u.pathname = '/'
      u.path = undefined
    }
  } else if (!u.protocol) {
    u.host = undefined
    u.protocol = 'http:'

    const pathname = u.pathname
    if (pathname) {
      const slashIndex = pathname.indexOf('/')
      if (slashIndex !== -1) {
        u.host = pathname.slice(0, slashIndex)
        u.pathname = pathname.slice(slashIndex)
      } else {
        u.host = pathname
        u.pathname = '/'
      }
      u.path = undefined
    }
  }

  if (!u.slashes && u.protocol !== 'about:') {
    u.slashes = true
  }

  return url.format(u)
}
