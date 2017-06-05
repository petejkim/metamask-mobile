// @flow
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './screens'

export const startApp = function (): void {
  registerScreens()
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'nabi.RootScreen',
      navigatorStyle: {
        navBarHidden: true
      }
    }
  })
}
