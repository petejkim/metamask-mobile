import React, { Component } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { normalizeUrl } from '../util'
import {
  TOOLBAR_HEIGHT,
  TOOLBAR_PADDING,
  COLOR_HIGHLIGHT_BLUE
} from '../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: TOOLBAR_HEIGHT - TOOLBAR_PADDING * 2,
    backgroundColor: 'white',
    marginRight: TOOLBAR_PADDING,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#b2b0b2',
    padding: StyleSheet.hairlineWidth,
    borderRadius: 4,
    justifyContent: 'center'
  },
  containerFocused: {
    borderColor: COLOR_HIGHLIGHT_BLUE,
    borderWidth: 1,
    padding: 0
  },
  textInput: {
    width: '100%',
    height: '100%',
    paddingLeft: TOOLBAR_PADDING,
    fontSize: 15
  }
})

export interface Props {
  currentUrl: string
  onNavigate?: (url: string) => void
}

interface State {
  focused: boolean
  urlString: string
}

export default class LocationBar extends Component<Props, State> {
  state = {
    focused: false,
    urlString: this.props.currentUrl
  }

  componentWillReceiveProps (newProps: Props) {
    const { currentUrl } = this.props
    const { currentUrl: newCurrentLocation } = newProps
    const { focused } = this.state

    if (currentUrl !== newCurrentLocation && !focused) {
      this.setState({ urlString: newCurrentLocation })
    }
  }

  handleFocus = (): void => {
    this.setState({
      focused: true
    })
  }

  handleBlur = (): void => {
    this.setState({
      focused: false
    })
  }

  handleChangeText = (text: string): void => {
    this.setState({ urlString: text })
  }

  handleSubmitEditing = (): void => {
    const { onNavigate } = this.props
    const { urlString } = this.state

    if (typeof onNavigate === 'function') {
      onNavigate(normalizeUrl(urlString))
    }
  }

  render () {
    const { focused, urlString } = this.state
    return (
      <View
        style={
          focused
            ? [styles.container, styles.containerFocused]
            : styles.container
        }
      >
        <TextInput
          style={styles.textInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
          autoCapitalize='none'
          autoCorrect={false}
          clearButtonMode='while-editing'
          keyboardType='url'
          returnKeyType='go'
          selectTextOnFocus
          value={urlString}
        />
      </View>
    )
  }
}
