import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import BrowserWindow from '../components/BrowserWindow'
import MetaMaskBackground from '../components/MetaMaskBackground'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  }
})

export default class RootScreen extends Component {
  openMetaMask (): void {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <MetaMaskBackground onOpenMetaMask={this.openMetaMask} />
        <BrowserWindow onPressMetaMaskButton={this.openMetaMask} />
      </View>
    )
  }
}
