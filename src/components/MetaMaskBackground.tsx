import React, { Component } from 'react'
import { View } from 'react-native'
import WKWebView, { WKWebViewMessage } from 'react-native-wkwebview-reborn'
import injection from '../injections/metaMaskBackground'
import { sharedIPC as ipc } from '../ipc'

const manifest = require('../../web/metamask/manifest.json')

const injectedJavaScript = `
  (${injection.toString()})(window, document, ${JSON.stringify(manifest)})
`

export interface Props {
  onOpenMetaMask: () => void
}

export default class MetaMaskBackground extends Component<Props> {
  refs: {
    webview: WKWebView
  }

  componentDidMount () {
    ipc.setBackground(this.refs.webview)
  }

  handleMessage = (msg: WKWebViewMessage): void => {
    console.log('background message received', msg)
    const { body } = msg
    const action: string = body.action

    switch (action) {
      case 'message':
        ipc.sendToClient(body.id, body.data)
        return

      case 'metamask':
        const { onOpenMetaMask } = this.props
        if (onOpenMetaMask) {
          onOpenMetaMask()
        }
    }
  }

  render () {
    return (
      <View>
        <WKWebView
          ref='webview'
          source={{ uri: 'app://metamask/background.html' }}
          runJavaScriptAtDocumentEnd={injectedJavaScript}
          runJavaScriptInMainFrameOnly
          onMessage={this.handleMessage}
        />
      </View>
    )
  }
}
