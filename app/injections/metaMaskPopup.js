// @flow
import type { Window } from '../types'

type PortListener = any => void

const bootstrapMetaMaskPopup = function (window: Window, document: Document) {
  const makePort = function (name) {
    console.log('portName:', name)
    return {
      name,

      onDisconnect: {
        addListener (listener: PortListener): void {}
      },

      onMessage: {
        addListener (listener: PortListener): void {
          window.addEventListener('port:message', function (evt) {
            if (evt.detail.to === name) {
              listener(evt.detail.data)
            }
          }, false)
        }
      },

      postMessage (message: any): void {
        window.webkit.messageHandlers.reactNative.postMessage({
          action: 'message',
          from: name,
          data: message
        })
      }
    }
  }

  window.browser = {
    runtime: {
      connect ({ name }: { name: string }) {
        window.setTimeout(function () {
          window.webkit.messageHandlers.reactNative.postMessage({
            action: 'connect',
            name
          })
          window.addEventListener('unload', function (evt) {
            window.webkit.messageHandlers.reactNative.postMessage({
              action: 'disconnect',
              name
            })
          }, false)
        }, 1)
        return makePort(name)
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/popup.js'
  if (document.body) {
    document.body.appendChild(script)
  }
}

export default bootstrapMetaMaskPopup
