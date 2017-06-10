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

interface WebViewBaseEvent {
  url: string,
  loading: boolean,
  title: string,
  canGoBack: boolean,
  canGoForward: boolean
}

class BrowserWindow extends Component {
  state: {
    sourceUrl: string,
    showProgress: boolean,
    progress: number,
    canGoBack: boolean,
    canGoForward: boolean
  } = {
    sourceUrl: 'about:blank',
    showProgress: false,
    progress: 1,
    canGoBack: false,
    canGoForward: false
  }

  handlePressMetaMaskButton = (): void => {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  handlePressBackButton = (): void => {
    this.refs.webview.goBack()
  }

  handlePressForwardButton = (): void => {
    this.refs.webview.goForward()
  }

  handleNavigate = (urlString: string): void => {
    const { sourceUrl } = this.state
    if (sourceUrl === urlString) {
      this.refs.webview.reload()
      return
    }
    this.setState({ sourceUrl: urlString })
  }

  handleProgress = (progress: number): void => {
    this.setState({ progress })
  }

  handleLoadStart = ({ nativeEvent: event }: { nativeEvent: WebViewBaseEvent }): void => {
    const url = event.url

    const changes: {
      sourceUrl: string,
      canGoBack: boolean,
      canGoForward: boolean,
      showProgress?: boolean,
      progress?: number
    } = {
      sourceUrl: url,
      canGoBack: event.canGoBack,
      canGoForward: event.canGoForward
    }

    if (!url.startsWith('about:')) {
      Object.assign(changes, {
        showProgress: true,
        progress: 0
      })
    }

    this.setState(changes)
  }

  handleLoadEnd = ({ nativeEvent: event }: { nativeEvent: WebViewBaseEvent }): void => {
    this.setState({
      canGoBack: event.canGoBack,
      canGoForward: event.canGoForward,
      showProgress: false,
      progress: 1
    })
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
      sourceUrl,
      showProgress,
      progress,
      canGoBack,
      canGoForward
    } = this.state

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='#efefef'
          barStyle='default'
        />
        <View style={styles.toolbar}>
          {canGoBack ? (
            <TouchableOpacity onPress={this.handlePressBackButton}>
              <Image
                style={styles.navigateButton}
                source={require('../assets/toolbar-back.png')}
              />
            </TouchableOpacity>
          ) : (
            <Image
              style={[styles.navigateButton, styles.disabledButton]}
              source={require('../assets/toolbar-back.png')}
            />
          )}
          {canGoForward ? (
            <TouchableOpacity onPress={this.handlePressForwardButton}>
              <Image
                style={styles.navigateButton}
                source={require('../assets/toolbar-forward.png')}
              />
            </TouchableOpacity>
          ) : (
            <Image
              style={[styles.navigateButton, styles.disabledButton]}
              source={require('../assets/toolbar-forward.png')}
            />
          )}
          <LocationBar currentUrl={sourceUrl} onNavigate={this.handleNavigate} />
          <TouchableOpacity onPress={this.handlePressMetaMaskButton}>
            <Image
              style={styles.metaMaskButton}
              source={require('../assets/metamask-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <PageLoadProgress progress={progress} hidden={!showProgress} />
        <View style={styles.progressBar} />
        <WKWebView
          ref='webview'
          style={styles.webview}
          source={{ uri: sourceUrl }}
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
  navigateButton: {
    width: 24,
    height: 24,
    marginRight: TOOLBAR_PADDING
  },
  metaMaskButton: {
    width: TOOLBAR_ICON_SIZE,
    height: TOOLBAR_ICON_SIZE
  },
  disabledButton: {
    opacity: 0.25
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
