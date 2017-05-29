/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import WKWebView from 'react-native-wkwebview-reborn'

export default class Nabi extends Component {
  render() {
    return (
      <View style={styles.container}>
        <WKWebView
          style={styles.webView}
          source={{uri: 'http://example.com/'}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  webView: {
    flex: 1
  }
})

AppRegistry.registerComponent('Nabi', () => Nabi)
