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
import injection from '../injections/metaMaskPopup'
import { sharedIPC as ipc } from '../ipc'

const injectedJavaScript = `
  (${injection.toString()})(window, document)
`

class MetaMaskScreen extends Component {
  componentWillUnmount () {
    ipc.disconnect('popup')
  }

  handleDismiss () {
    Navigation.dismissModal({})
  }

  handleMessage (evt) {
    console.log('popup message received', evt)
    const body = evt.body
    switch (body.action) {
      case 'connect':
        ipc.connect(body.name, this.refs.metamaskPopup)
        return

      case 'disconnect':
        ipc.disconnect(body.name)
        return

      case 'message':
        ipc.sendToBackground(body.from, body.data)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <WKWebView
          ref='metamaskPopup'
          style={styles.metamaskPopup}
          source={{uri: 'app://metamask/popup.html'}}
          injectedJavaScript={injectedJavaScript}
          onMessage={(evt) => this.handleMessage(evt)}
        />
        <Button
          title='Dismiss'
          onPress={() => this.handleDismiss()}
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
  metamaskPopup: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  }
})

AppRegistry.registerComponent('MetaMaskScreen', () => MetaMaskScreen)
export default MetaMaskScreen
