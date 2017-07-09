import React, { Component } from 'react'
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import WKWebView, { WKWebViewMessage } from 'react-native-wkwebview-reborn'
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

export interface Props {
  onPressMetaMaskButton: () => void
}

interface State {
  sourceUrl: string
  showProgress: boolean
  progress: number
  canGoBack: boolean
  canGoForward: boolean
}

export default class BrowserWindow extends Component<Props, State> {
  state = {
    sourceUrl: 'about:blank',
    showProgress: false,
    progress: 1,
    canGoBack: false,
    canGoForward: false
  }

  refs: {
    webview: WKWebView
  }

  connections: { [id: string]: boolean } = {}

  componentWillUnmount () {
    Object.keys(this.connections).forEach(function (id) {
      ipc.disconnect(id)
    })
  }

  handlePressMetaMaskButton = (): void => {
    const { onPressMetaMaskButton } = this.props
    if (onPressMetaMaskButton) {
      onPressMetaMaskButton()
    }
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

  handleLoadStart = ({ nativeEvent: event }): void => {
    const url = event.url

    const changes = {
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

  handleLoadEnd = ({ nativeEvent: event }): void => {
    this.setState({
      canGoBack: event.canGoBack,
      canGoForward: event.canGoForward,
      showProgress: false,
      progress: 1
    })
  }

  handleMessage = (msg: WKWebViewMessage): void => {
    console.log('browser window message received', msg)
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

  render () {
    const {
      sourceUrl,
      showProgress,
      progress,
      canGoBack,
      canGoForward
    } = this.state

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#efefef' barStyle='default' />
        <View style={styles.toolbar}>
          {canGoBack
            ? <TouchableOpacity onPress={this.handlePressBackButton}>
                <Image
                  style={styles.navigateButton}
                  source={require('../assets/toolbar-back.png')}
                />
              </TouchableOpacity>
            : <Image
                style={[styles.navigateButton, styles.disabledButton]}
                source={require('../assets/toolbar-back.png')}
              />}
          {canGoForward
            ? <TouchableOpacity onPress={this.handlePressForwardButton}>
                <Image
                  style={styles.navigateButton}
                  source={require('../assets/toolbar-forward.png')}
                />
              </TouchableOpacity>
            : <Image
                style={[styles.navigateButton, styles.disabledButton]}
                source={require('../assets/toolbar-forward.png')}
              />}
          <LocationBar
            currentUrl={sourceUrl}
            onNavigate={this.handleNavigate}
          />
          <TouchableOpacity onPress={this.handlePressMetaMaskButton}>
            <Image
              style={styles.metaMaskButton}
              source={require('../assets/metamask-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <PageLoadProgress progress={progress} hidden={!showProgress} />
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
