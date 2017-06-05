// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import Browser from '../components/Browser'
import MetaMaskBackground from '../components/MetaMaskBackground'

class RootScreen extends Component {
  render (): Element<*> {
    return (
      <View style={styles.container}>
        <MetaMaskBackground />
        <Browser />
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
