const bootstrapMetaMaskPopup = function (window, document) {
  const port = (name) => {
    console.log('portName:', name)
    return {
      name,

      onDisconnect: {
        addListener (listener) {}
      },

      onMessage: {
        addListener (listener) {
          window.addEventListener('port:message', function (evt) {
            if (evt.detail.to === name) {
              listener(evt.detail.data)
            }
          }, false)
        }
      },

      postMessage (message) {
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
      connect ({ name }) {
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
          })
        }, 1)
        return port(name)
      }
    }
  }

  const script = document.createElement('script')
  script.src = '/scripts/popup.js'
  document.body.appendChild(script)
}

export default bootstrapMetaMaskPopup
