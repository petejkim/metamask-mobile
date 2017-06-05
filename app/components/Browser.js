// @flow
import React, { Component, Element } from 'react'
import {
  AppRegistry,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import {
  TOOLBAR_HEIGHT,
  TOOLBAR_ICON_SIZE,
  TOOLBAR_PADDING_X,
  STATUS_BAR_HEIGHT
} from '../constants'

class Browser extends Component {
  handlePressMetaMaskButton = (): void => {
    Navigation.showModal({
      screen: 'nabi.MetaMaskScreen'
    })
  }

  render (): Element<*> {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='#efefef'
          barStyle='default'
        />
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={this.handlePressMetaMaskButton}>
            <Image
              style={styles.metaMaskButton}
              source={require('../assets/metamask-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  toolbar: {
    paddingTop: STATUS_BAR_HEIGHT,
    paddingLeft: TOOLBAR_PADDING_X,
    paddingRight: TOOLBAR_PADDING_X,
    height: TOOLBAR_HEIGHT + STATUS_BAR_HEIGHT,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 0.5,
    borderBottomColor: '#b2b0b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  metaMaskButton: {
    width: TOOLBAR_ICON_SIZE,
    height: TOOLBAR_ICON_SIZE
  }
})

AppRegistry.registerComponent('Browser', () => Browser)
export default Browser
