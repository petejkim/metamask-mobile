import { PortListener, Port, MessageEvent } from './types'

const bootstrapMetaMaskPopup = function (
  window: Window,
  document: Document,
  manifest: {}
) {
  const uint8ArrayToHex = function (arr) {
    const hex = '0123456789abcdef'
    return Array.from(arr)
      .map((v: number) => hex[Math.floor(v / 16)] + hex[v % 16])
      .join('')
  }

  const makePort = function (name, id): Port {
    return {
      name,
      id,

      onDisconnect: {
        addListener (_listener: PortListener): void {}
      },

      onMessage: {
        addListener (listener: PortListener): void {
          window.addEventListener(
            'port:message',
            function (evt: MessageEvent) {
              if (evt.detail.id === id) {
                listener(evt.detail.data)
              }
            },
            false
          )
        }
      },

      postMessage (message: any): void {
        window.webkit.messageHandlers.reactNative.postMessage({
          action: 'message',
          data: message,
          id
        })
      }
    }
  }

  window.browser = {
    runtime: {
      connect ({ name }: { name: string }): Port {
        const id = uint8ArrayToHex(
          window.crypto.getRandomValues(new Uint8Array(8))
        )

        window.setTimeout(function () {
          window.webkit.messageHandlers.reactNative.postMessage({
            action: 'connect',
            url: location.href,
            name,
            id
          })
          window.addEventListener(
            'pagehide',
            function () {
              window.webkit.messageHandlers.reactNative.postMessage({
                action: 'disconnect',
                id
              })
            },
            false
          )
        }, 1)

        return makePort(name, id)
      },

      getManifest (): {} {
        return manifest
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/popup.js'
  script.onload = function () {
    if (this && this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
  if (document.body) {
    document.body.appendChild(script)
  }
}

export default bootstrapMetaMaskPopup
