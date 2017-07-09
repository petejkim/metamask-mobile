const extraNodeModules = require('node-libs-react-native')

module.exports = {
  extraNodeModules,

  getSourceExts () {
    return ['ts', 'tsx']
  },

  getTransformModulePath () {
    return require.resolve('react-native-typescript-transformer')
  }
}
