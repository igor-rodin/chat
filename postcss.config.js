module.exports = {
  plugins: [
    'postcss-preset-env',
    ['postcss-pxtorem', {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 1,
      exclude: /node_modules/i
    }]
  ]
}