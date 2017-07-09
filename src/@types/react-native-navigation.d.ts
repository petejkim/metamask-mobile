declare module 'react-native-navigation' {
  import { ComponentClass } from 'react'
  import { ComponentProvider } from 'react-native'

  export interface NavigatorEvent {
    type: string
    id: string
  }

  export class Navigator {}

  export type NavigatorEventHandler = (NavigatorEvent) => void

  interface DismissModalParams {
    animationType?: 'slide-down' | 'none' | 'slide-down'
  }

  interface ShowModalParams {
    screen: string
    title?: string
    passProps?: any
    navigatorStyle?: any
    navigatorButtons?: any
    animationType?: 'slide-up' | 'none' | 'slide-up'
  }

  interface StartSingleScreenAppParams {
    screen: {
      screen: string
      title?: string
      navigatorStyle?: any
      navigatorButtons?: any
    }
    drawer?: {
      left?: {
        screen: string
        passProps?: any
      }
      right?: {
        screen: string
        passProps?: any
      }
      disableOpenGesture?: boolean
    }
    passProps?: any
    animationType?: 'slide-down' | 'none' | 'slide-down' | 'fade'
  }

  export namespace Navigation {
    function registerComponent (
      screenID: string,
      generator: ComponentProvider,
      store?: any,
      Provider?: ComponentClass<any>
    )
    function dismissModal (params: DismissModalParams = {})
    function showModal (params: ShowModalParams = {})
    function setOnNavigatorEvent (callback: NavigatorEventHandler)
    function startSingleScreenApp (params: StartSingleScreenAppParams)
  }
}
