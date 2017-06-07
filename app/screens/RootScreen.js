// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import BrowserWindow from '../components/BrowserWindow'
import MetaMaskBackground from '../components/MetaMaskBackground'

class RootScreen extends Component {
  render (): Element<*> {
    return (
      <View style={styles.container}>
        <MetaMaskBackground />
        <BrowserWindow />
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
