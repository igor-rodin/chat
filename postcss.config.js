module.exports = {
  plugins: [
    'postcss-preset-env',
    ['postcss-pxtorem', {
      unitPrecision: 5,
      propList: ['*'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 1,
      exclude: /node_modules/i
    }]
  ]
}