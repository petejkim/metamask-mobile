// @flow
class IPC {
  constructor () {
    this.background = undefined
    this.clients = {}
  }

  setBackground (background) {
    this.background = background
  }

  connect (name, client) {
    console.log('connected:', name)
    this.clients[name] = client
    const detail = JSON.stringify({
      name
    })
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:connect', { detail: ${detail} }))
    `)
  }

  disconnect (name) {
    console.log('disconnected:', name)
    if (!this.clients[name]) return
    this.clients[name] = undefined
    const detail = JSON.stringify({
      name
    })
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:disconnect', { detail: ${detail} }))
    `)
  }

  sendToBackground (from, data) {
    console.log(`${from} sending message to background:`, data)
    const detail = JSON.stringify({
      from,
      data
    })
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:message', { detail: ${detail} }))
    `)
  }

  sendToClient (to, data) {
    console.log(`background sending message to ${to}:`, data)
    const client = this.clients[to]
    if (!client) return
    const detail = JSON.stringify({
      to,
      data
    })
    client.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:message', { detail: ${detail} }))
    `)
  }
}

export default IPC
export const sharedIPC = new IPC()
