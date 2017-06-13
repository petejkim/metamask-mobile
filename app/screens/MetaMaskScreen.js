// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import WKWebView from 'react-native-wkwebview-reborn'
import injection from '../injections/metaMaskPopup'
import manifest from '../../web/metamask/manifest.json'
import { sharedIPC as ipc } from '../ipc'
import type { NavigatorEvent, WebViewMessage } from '../types'

class MetaMaskScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Close',
        id: 'close'
      }
    ]
  }

  props: {
    navigator: *
  }

  connections: { [string] : boolean } = {}

  componentDidMount (): void {
    const { navigator } = this.props
    navigator.setOnNavigatorEvent(this.handleNavigatorEvent)
  }

  componentWillUnmount (): void {
    Object.keys(this.connections).forEach(function (id) {
      ipc.disconnect(id)
    })
  }

  handleNavigatorEvent = (event: NavigatorEvent): void => {
    if (event.type === 'NavBarButtonPress' && event.id === 'close') {
      Navigation.dismissModal({})
    }
  }

  handleMessage = (msg: WebViewMessage): void => {
    console.log('popup message received', msg)
    const body = msg.body
    switch (body.action) {
      case 'connect':
        ipc.connect(body.name, body.id, body.url, this.refs.webview)
        this.connections[body.id] = true
        return

      case 'disconnect':
        ipc.disconnect(body.id)
        delete this.connections[body.id]
        return

      case 'message':
        ipc.sendToBackground(body.id, body.data)
    }
  }

  render (): Element<*> {
    return (
      <View style={styles.container}>
        <WKWebView
          ref='webview'
          style={styles.webview}
          source={{uri: 'app://metamask/popup.html'}}
          runJavaScriptAtDocumentEnd={injectedJavaScript}
          runJavaScriptInMainFrameOnly
          onMessage={this.handleMessage}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  webview: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  }
})

const injectedJavaScript = `
  (${injection.toString()})(window, document, ${JSON.stringify(manifest)})
`

AppRegistry.registerComponent('MetaMaskScreen', () => MetaMaskScreen)
export default MetaMaskScreen
