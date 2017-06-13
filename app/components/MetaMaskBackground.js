// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  View
} from 'react-native'
import WKWebView from 'react-native-wkwebview-reborn'
import injection from '../injections/metaMaskBackground'
import { sharedIPC as ipc } from '../ipc'
import type { WebViewMessage } from '../types'
import manifest from '../../web/metamask/manifest.json'

class MetaMaskBackground extends Component {
  componentDidMount (): void {
    ipc.setBackground(this.refs.webview)
  }

  handleMessage = (msg: WebViewMessage): void => {
    console.log('background message received', msg)
    const body = msg.body
    ipc.sendToClient(body.id, body.data)
  }

  render (): Element<*> {
    return (
      <View>
        <WKWebView
          ref='webview'
          source={{uri: 'app://metamask/background.html'}}
          runJavaScriptAtDocumentEnd={injectedJavaScript}
          runJavaScriptInMainFrameOnly
          onMessage={this.handleMessage}
        />
      </View>
    )
  }
}

const injectedJavaScript = `
  (${injection.toString()})(window, document, ${JSON.stringify(manifest)})
`

AppRegistry.registerComponent('MetaMaskBackground', () => MetaMaskBackground)
export default MetaMaskBackground
