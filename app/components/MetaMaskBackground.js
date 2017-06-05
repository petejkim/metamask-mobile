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

class MetaMaskBackground extends Component {
  componentDidMount (): void {
    ipc.setBackground(this.refs.webview)
  }

  handleMessage = (msg: WebViewMessage): void => {
    console.log('background message received', msg)
    const body = msg.body
    ipc.sendToClient(body.to, body.data)
  }

  render (): Element<*> {
    return (
      <View>
        <WKWebView
          ref='webview'
          source={{uri: 'app://metamask/background.html'}}
          injectedJavaScript={injectedJavaScript}
          onMessage={this.handleMessage}
        />
      </View>
    )
  }
}

const injectedJavaScript = `
  (${injection.toString()})(window, document)
`

AppRegistry.registerComponent('MetaMaskBackground', () => MetaMaskBackground)
export default MetaMaskBackground
