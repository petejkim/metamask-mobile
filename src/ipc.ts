import WKWebView from 'react-native-wkwebview-reborn'

class IPC {
  private background?: WKWebView
  private clients: { [id: string]: WKWebView } = {}

  setBackground (background: WKWebView): void {
    this.background = background
  }

  connect (name: string, id: string, url: string, client: WKWebView): void {
    console.log('connected:', name, id)
    this.clients[id] = client
    console.log(name)
    console.log(id)
    console.log(url)

    const detail = JSON.stringify({
      name,
      id,
      url
    })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:connect', { detail: ${detail} }))
    `)
  }

  disconnect (id: string): void {
    console.log('disconnected:', id)
    if (!this.clients[id]) return
    delete this.clients[id]
    const detail = JSON.stringify({ id })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:disconnect', { detail: ${detail} }))
    `)
  }

  sendToBackground (id: string, data: any): void {
    console.log(`${id} sending message to background:`, data)
    const detail = JSON.stringify({
      id,
      data
    })
    if (!this.background) throw new Error('ipc: background needs to be set')
    this.background.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:message', { detail: ${detail} }))
    `)
  }

  sendToClient (id: string, data: any): void {
    console.log(`background sending message to ${id}:`, data)
    const client = this.clients[id]
    if (!client) return
    const detail = JSON.stringify({
      id,
      data
    })
    client.evaluateJavaScript(`
      window.dispatchEvent(new CustomEvent('port:message', { detail: ${detail} }))
    `)
  }
}

export default IPC
export const sharedIPC = new IPC()
