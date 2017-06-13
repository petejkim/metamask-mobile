// @flow
export interface WebViewMessage {
  body: any,
  name: string,
  target: number
}

export type CustomEventListener = (CustomEvent) => void

export interface Window {
  addEventListener: (string, CustomEventListener, boolean) => void,
  removeEventListener: (string, CustomEventListener, boolean) => void,
  setTimeout: (() => void, number) => number,
  browser: any,
  crypto: {
    getRandomValues: (Uint8Array) => Uint8Array
  },
  webkit: {
    messageHandlers: {
      reactNative: {
        postMessage: (any) => void
      }
    }
  }
}

export interface NavigatorEvent {
  type: string,
  id: string
}
