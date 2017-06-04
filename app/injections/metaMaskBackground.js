const bootstrapMetaMaskBackground = function (window, document) {
  const port = (name) => {
    let disconnectListeners = []
    let messageListeners = []

    const messageHandler = (evt) => {
      if (evt.detail.from === name) {
        messageListeners.forEach((listener) => {
          listener(evt.detail.data)
        })
      }
    }

    const disconnectHandler = (evt) => {
      if (evt.detail.name === name) {
        disconnectListeners.forEach((listener) => listener())
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
        addListener (listener) {
          disconnectListeners.push(listener)
        }
      },

      onMessage: {
        addListener (listener) {
          messageListeners.push(listener)
        }
      },

      postMessage (message) {
        window.webkit.messageHandlers.reactNative.postMessage({
          to: name,
          data: message
        })
      }
    }
  }

  window.browser = {
    browserAction: {
      setBadgeText ({ text }) {
        console.log('setBadgeText:', text)
      },

      setBadgeBackgroundColor ({ color }) {
        console.log('setBadgeBackgroundColor:', color)
      }
    },

    runtime: {
      onConnect: {
        addListener (listener) {
          window.addEventListener('port:connect', function (evt) {
            listener(port(evt.detail.name))
          }, false)
        }
      },

      onInstalled: {
        addListener () {}
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/background.js'
  document.body.appendChild(script)
}

export default bootstrapMetaMaskBackground
