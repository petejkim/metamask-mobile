// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import BrowserWindow from '../components/BrowserWindow'
import MetaMaskBackground from '../components/MetaMaskBackground'

class RootScreen extends Component {
  openMetaMask (): void {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  render (): Element<*> {
    return (
      <View style={styles.container}>
        <MetaMaskBackground onOpenMetaMask={this.openMetaMask} />
        <BrowserWindow onPressMetaMaskButton={this.openMetaMask} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  }
})

AppRegistry.registerComponent('RootScreen', () => RootScreen)
export default RootScreen
