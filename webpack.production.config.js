var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['whatwg-fetch', 'babel-polyfill', 'match-media', 'match-media/matchMedia.addListener.js', './assets/src/react/main.js'],
  output: {path: __dirname, filename: 'assets/js/bundle.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, "node_modules"),
        query: {
          presets: ['es2015','react','stage-0']
        }
      },
      {
        test: require.resolve('snapsvg-cjs'),
        loader: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    alias: {
      slickCarousel: path.join(__dirname, 'node_modules/slick-carousel/slick')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin,
    new webpack.optimize.UglifyJsPlugin()
  ]
};
