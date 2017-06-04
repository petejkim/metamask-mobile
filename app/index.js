// @flow
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './screens'

export const startApp = function () {
  registerScreens()
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'nabi.RootScreen'
    }
  })
}
