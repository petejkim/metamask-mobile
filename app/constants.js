// @flow
import { Platform } from 'react-native'

export const TOOLBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
export const TOOLBAR_ICON_SIZE = Platform.OS === 'ios' ? 32 : 24
export const TOOLBAR_PADDING = Platform.OS === 'ios' ? 8 : 16
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

export const COLOR_HIGHLIGHT_BLUE = '#3378f6'
