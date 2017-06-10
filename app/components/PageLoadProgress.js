// @flow
import React, { Component, Element } from 'react'
import {
  Animated,
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'
import {
  COLOR_HIGHLIGHT_BLUE
} from '../constants'

interface Props {
  progress: number,
  hidden: boolean
}

class PageLoadProgress extends Component {
  props: Props
  state: {
    progressAnimated: Animated.Value,
    opacityAnimated: Animated.Value
  } = {
    progressAnimated: new Animated.Value(0),
    opacityAnimated: new Animated.Value(0)
  }

  componentWillReceiveProps (newProps: Props): void {
    const { progress, hidden } = this.props
    const { progress: newProgress, hidden: newHidden } = newProps

    if ((!hidden || progress !== 1) && (newHidden || newProgress === 1)) {
      Animated.timing(this.state.progressAnimated, {
        toValue: 1,
        duration: 500
      }).start()
      Animated.timing(this.state.opacityAnimated, {
        toValue: 0,
        delay: 500,
        duration: 200
      }).start()
      return
    }

    if (newProgress !== progress) {
      if (newProgress <= 0.1) {
        this.state.progressAnimated.setValue(0)
        this.state.opacityAnimated.setValue(1)
      }
      Animated.timing(this.state.progressAnimated, {
        toValue: newProgress,
        duration: 500
      }).start()
    }
  }

  render (): Element<*> {
    const { progressAnimated, opacityAnimated } = this.state

    return (
      <View style={styles.container}>
        <Animated.View style={[
          styles.bar,
          {
            width: progressAnimated.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }),
            opacity: opacityAnimated
          }
        ]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: -2,
    zIndex: 1
  },
  bar: {
    height: 2,
    backgroundColor: COLOR_HIGHLIGHT_BLUE,
    shadowColor: COLOR_HIGHLIGHT_BLUE
  }
})

AppRegistry.registerComponent('PageLoadProgress', () => PageLoadProgress)
export default PageLoadProgress
