// @flow
import type { Window } from '../types'

type PortListener = any => void

const bootstrapMetaMaskBackground = function (window: Window, document: Document) {
  const makePort = function (name: string) {
    let disconnectListeners: PortListener[] = []
    let messageListeners: PortListener[] = []

    const messageHandler = function (evt: CustomEvent): void {
      if (evt.detail.from === name) {
        messageListeners.forEach(function (listener) {
          listener(evt.detail.data)
        })
      }
    }

    const disconnectHandler = function (evt: CustomEvent): void {
      if (evt.detail.name === name) {
        disconnectListeners.forEach(function (listener) {
          listener(evt.detail.data)
        })
        window.removeEventListener('port:disconnect', disconnectHandler, false)
        window.removeEventListener('port:message', messageHandler, false)
        disconnectListeners = []
        messageListeners = []
      }
    }

    window.addEventListener('port:disconnect', disconnectHandler, false)
    window.addEventListener('port:message', messageHandler, false)

    return {
      name,

      onDisconnect: {
        addListener (listener: PortListener): void {
          disconnectListeners.push(listener)
        }
      },

      onMessage: {
        addListener (listener: PortListener): void {
          messageListeners.push(listener)
        }
      },

      postMessage (message: any): void {
        window.webkit.messageHandlers.reactNative.postMessage({
          to: name,
          data: message
        })
      }
    }
  }

  window.browser = {
    browserAction: {
      setBadgeText ({ text }: { text: string }): void {
        console.log('setBadgeText:', text)
      },

      setBadgeBackgroundColor ({ color }: { color: string }): void {
        console.log('setBadgeBackgroundColor:', color)
      }
    },

    runtime: {
      onConnect: {
        addListener (listener: PortListener): void {
          window.addEventListener('port:connect', function (evt) {
            listener(makePort(evt.detail.name))
          }, false)
        }
      },

      onInstalled: {
        addListener (listener: PortListener): void {}
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/background.js'
  if (document.body) {
    document.body.appendChild(script)
  }
}

export default bootstrapMetaMaskBackground
