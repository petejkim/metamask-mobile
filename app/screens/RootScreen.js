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

const injectedJavaScript = `
  (${injection.toString()})(window, document)
`

class RootScreen extends Component {
  componentDidMount () {
    ipc.setBackground(this.refs.metamaskBackground)
  }

  openMetaMask () {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  handleMessage (evt) {
    console.log('background message received', evt)
    const body = evt.body
    ipc.sendToClient(body.to, body.data)
  }

  render () {
    return (
      <View style={styles.container}>
        <WKWebView
          ref='metamaskBackground'
          style={styles.metamaskBackground}
          source={{uri: 'app://metamask/background.html'}}
          injectedJavaScript={injectedJavaScript}
          onMessage={(evt) => this.handleMessage(evt)}
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

AppRegistry.registerComponent('RootScreen', () => RootScreen)
export default RootScreen
