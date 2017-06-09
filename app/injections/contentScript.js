// @flow
import type { Window } from '../types'

type PortListener = any => void

const injectContentScript = function (window: Window, document: Document) {
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
    extension: {
      getURL (path: string) {
        return `about://metamask/${path}`
      }
    },

    runtime: {
      connect ({ name }: { name: string }) {
        window.setTimeout(function () {
          window.webkit.messageHandlers.reactNative.postMessage({
            action: 'connect',
            url: location.href,
            name
          })
          window.addEventListener('pagehide', function () {
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
  script.src = 'about://metamask/scripts/contentscript.js'
  script.onload = function () {
    this.parentNode.removeChild(this)
  }
  const el = document.head || document.body || document.documentElement
  if (el) {
    el.appendChild(script)
  }
}

export default injectContentScript
