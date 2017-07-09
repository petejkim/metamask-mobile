import { PortListener, Port, ConnectEvent } from './types'

export default function bootstrapMetaMaskBackground (
  window: Window,
  document: Document,
  manifest: {}
) {
  const makePort = function (name: string, id: string, url: string): Port {
    let disconnectListeners: PortListener[] = []
    let messageListeners: PortListener[] = []

    const messageHandler = function (evt: CustomEvent): void {
      if (evt.detail.id === id) {
        console.log('message received', evt)
        messageListeners.forEach(function (listener) {
          listener(evt.detail.data)
        })
      }
    }

    const disconnectHandler = function (evt: CustomEvent): void {
      if (evt.detail.id === id) {
        console.log('disconnect', evt.detail)
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
      sender: { url },

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
        console.log(`sending message back to ${name} ${id}: `, message)
        window.webkit.messageHandlers.reactNative.postMessage({
          action: 'message',
          data: message,
          id
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
          window.addEventListener(
            'port:connect',
            function (evt: ConnectEvent) {
              console.log(
                'connecting to port: ',
                evt.detail.name,
                evt.detail.id,
                evt.detail.url
              )
              listener(makePort(evt.detail.name, evt.detail.id, evt.detail.url))
            },
            false
          )
        }
      },

      onInstalled: {
        addListener (_listener: PortListener): void {}
      },

      getManifest (): {} {
        return manifest
      },

      reload () {}
    },

    tabs: {
      create ({ url: _url }) {}
    },

    windows: {
      create ({ url }, cb) {
        if (url === 'notification.html') {
          window.webkit.messageHandlers.reactNative.postMessage({
            action: 'metamask'
          })
          if (typeof cb === 'function') cb()
        }
      },

      update () {},

      remove () {},

      getAll (_, cb) {
        cb([])
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/background.js'
  script.onload = function () {
    if (this && this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
  if (document.body) {
    document.body.appendChild(script)
  }
}
