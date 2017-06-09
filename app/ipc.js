// @flow
import type WKWebView from 'react-native-wkwebview-reborn'

class IPC {
  background: ?WKWebView
  clients: { [string]: WKWebView }

  constructor () {
    this.background = undefined
    this.clients = {}
  }

  setBackground (background: WKWebView): void {
    this.background = background
  }

  connect (name: string, url: string, client: WKWebView): void {
    console.log('connected:', name)
    this.clients[name] = client
    const detail = JSON.stringify({
      name,
      url
    })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:connect', { detail: ${detail} }))
    `)
  }

  disconnect (name: string): void {
    console.log('disconnected:', name)
    if (!this.clients[name]) return
    delete this.clients[name]
    const detail = JSON.stringify({
      name
    })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:disconnect', { detail: ${detail} }))
    `)
  }

  sendToBackground (from: string, data: any): void {
    console.log(`${from} sending message to background:`, data)
    const detail = JSON.stringify({
      from,
      data
    })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:message', { detail: ${detail} }))
    `)
  }

  sendToClient (to: string, data: any): void {
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
