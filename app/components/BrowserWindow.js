// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import WKWebView from 'react-native-wkwebview-reborn'
import LocationBar from './LocationBar'
import PageLoadProgress from './PageLoadProgress'
import injection from '../injections/contentScript'
import { sharedIPC as ipc } from '../ipc'
import {
  TOOLBAR_HEIGHT,
  TOOLBAR_ICON_SIZE,
  TOOLBAR_PADDING,
  STATUS_BAR_HEIGHT
} from '../constants'
import type { WebViewMessage } from '../types'

class BrowserWindow extends Component {
  state: {
    location: string,
    currentLocation: string,
    progress: number,
    loaded: boolean
  } = {
    location: 'about:blank',
    currentLocation: 'about:blank',
    progress: 1,
    loaded: true
  }

  handlePressMetaMaskButton = (): void => {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  handleNavigate = (urlString: string): void => {
    this.setState({ location: urlString })
  }

  handleProgress = (progress: number): void => {
    this.setState({ progress })
  }

  handleLoadStart = ({ nativeEvent: { url } }: { nativeEvent: { url: string } }): void => {
    if (url === 'about:blank') {
      this.setState({ currentLocation: url })
      return
    }
    this.setState({ currentLocation: url, progress: 0, loaded: false })
  }

  handleLoadEnd = (): void => {
    this.setState({ loaded: true })
  }

  handleMessage = (msg: WebViewMessage): void => {
    console.log('browser window message received', msg)
    const body = msg.body
    if (body.name === 'contentscript' && body.action === 'connect') {
      ipc.connect(body.name, body.url, this.refs.webview)
    } else if (body.name === 'contentscript' && body.action === 'disconnect') {
      ipc.disconnect(body.name)
    } else if (body.from === 'contentscript' && body.action === 'message') {
      ipc.sendToBackground(body.from, body.data)
    }
  }

  render (): Element<*> {
    const {
      location,
      currentLocation,
      progress,
      loaded
    } = this.state

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='#efefef'
          barStyle='default'
        />
        <View style={styles.toolbar}>
          <LocationBar currentLocation={currentLocation} onNavigate={this.handleNavigate} />
          <TouchableOpacity onPress={this.handlePressMetaMaskButton}>
            <Image
              style={styles.metaMaskButton}
              source={require('../assets/metamask-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <PageLoadProgress progress={progress} completed={loaded} />
        <View style={styles.progressBar} />
        <WKWebView
          ref='webview'
          style={styles.webview}
          source={{ uri: location }}
          onProgress={this.handleProgress}
          onLoadStart={this.handleLoadStart}
          onLoadEnd={this.handleLoadEnd}
          onMessage={this.handleMessage}
          runJavaScriptAtDocumentStart={injectedJavaScript}
          runJavaScriptInMainFrameOnly={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  metaMaskButton: {
    width: TOOLBAR_ICON_SIZE,
    height: TOOLBAR_ICON_SIZE
  },
  toolbar: {
    paddingTop: STATUS_BAR_HEIGHT,
    paddingLeft: TOOLBAR_PADDING,
    paddingRight: TOOLBAR_PADDING,
    height: TOOLBAR_HEIGHT + STATUS_BAR_HEIGHT,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#b2b0b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  webview: {
    flex: 1
  }
})

const injectedJavaScript = `
  (${injection.toString()})(window, document)
`

AppRegistry.registerComponent('BrowserWindow', () => BrowserWindow)
export default BrowserWindow
