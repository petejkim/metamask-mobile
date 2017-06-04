// @flow
import React, { Component } from 'react'
import {
  AppRegistry,
  Button,
  StyleSheet,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import WKWebView from 'react-native-wkwebview-reborn'
import injection from '../injections/metaMaskBackground'
import { sharedIPC as ipc } from '../ipc'
import type { WebViewMessage } from '../types'

class RootScreen extends Component {
  componentDidMount (): void {
    ipc.setBackground(this.refs.metamaskBackground)
  }

  openMetaMask (): void {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  handleMessage (msg: WebViewMessage): void {
    console.log('background message received', msg)
    const body = msg.body
    ipc.sendToClient(body.to, body.data)
  }

  render (): React$Element<*> {
    return (
      <View style={styles.container}>
        <WKWebView
          ref='metamaskBackground'
          style={styles.metamaskBackground}
          source={{uri: 'app://metamask/background.html'}}
          injectedJavaScript={injectedJavaScript}
          onMessage={(msg) => this.handleMessage(msg)}
        />
        <Button
          title='Open MetaMask'
          onPress={() => this.openMetaMask()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  metamaskBackground: {
    flex: 1
  }
})

const injectedJavaScript = `
  (${injection.toString()})(window, document)
`

AppRegistry.registerComponent('RootScreen', () => RootScreen)
export default RootScreen
