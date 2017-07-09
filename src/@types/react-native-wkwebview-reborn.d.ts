declare module 'react-native-wkwebview-reborn' {
  import { Component } from 'react'
  import {
    EdgeInsetsPropType,
    NativeSyntheticEvent,
    ViewStyleProp
  } from 'react-native'

  export interface WKWebViewMessage {
    body: any
    name: string
    target: number
  }

  export interface WKWebViewBaseEvent {
    url: string
    loading: boolean
    title: string
    canGoBack: boolean
    canGoForward: boolean
  }

  export interface WKWebViewProps {
    html?: string
    url?: string
    source?:
      | {
          uri: string
          method?: string
          headers?: { [string]: string }
          body?: string
        }
      | {
          html: string
          baseUrl: string
        }
      | number
    renderError?: (errorDomain, errorCode, errorDesc) => void
    renderLoading?: () => void
    onLoad?: (event: NativeSyntheticEvent<any>) => void
    onLoadEnd?: (event: NativeSyntheticEvent<WKWebViewBaseEvent>) => void
    onLoadStart?: (event: NativeSyntheticEvent<WKWebViewBaseEvent>) => void
    onError?: (event: NativeSyntheticEvent<any>) => void
    onProgress?: (progress: number) => void
    onMessage?: (msg: WKWebViewMessage) => void
    bounces?: boolean
    scrollEnabled?: boolean
    allowsBackForwardNavigationGestures?: boolean
    automaticallyAdjustContentInsets?: boolean
    contentInset?: EdgeInsetsPropType
    onNavigationStateChange?: (event: any) => void
    scalesPageToFit?: boolean
    startInLoadingState?: boolean
    style?: ViewStyleProp
    injectedJavaScript?: string
    runJavaScriptAtDocumentStart?: string
    runJavaScriptAtDocumentEnd?: string
    runJavaScriptInMainFrameOnly?: boolean
    onShouldStartLoadWithRequest?: (event: any) => boolean
    sendCookies?: boolean
    openNewWindowInWebView?: boolean
    hideKeyboardAccessoryView?: boolean
    customUserAgent?: string
    userAgent?: string
    pagingEnabled?: boolean
  }

  class WKWebView extends Component<WKWebViewProps> {
    goBack (): void
    goForward (): void
    reload (): void
    stopLoading (): void
    evaluateJavaScript (js: string): any
    getWebViewHandle (): any
  }

  export default WKWebView
}
