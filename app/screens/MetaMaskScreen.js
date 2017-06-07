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

  componentDidMount (): void {
    const { navigator } = this.props
    navigator.setOnNavigatorEvent(this.handleNavigatorEvent)
  }

  componentWillUnmount (): void {
    ipc.disconnect('popup')
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
        ipc.connect(body.name, this.refs.webview)
        return

      case 'disconnect':
        ipc.disconnect(body.name)
        return

      case 'message':
        ipc.sendToBackground(body.from, body.data)
    }
  }

  render (): Element<*> {
    return (
      <View style={styles.container}>
        <WKWebView
          ref='webview'
          style={styles.webview}
          source={{uri: 'app://metamask/popup.html'}}
          injectedJavaScript={injectedJavaScript}
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
  (${injection.toString()})(window, document)
`

AppRegistry.registerComponent('MetaMaskScreen', () => MetaMaskScreen)
export default MetaMaskScreen
