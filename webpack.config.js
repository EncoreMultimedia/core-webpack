const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

//webpack parts
const parts = require('./libs/parts');


//global paths
const PATHS = {
  bundle: './assets/src/react/main.js',
  scripts: './assets/src/js/script.js',
  build: path.join(__dirname, 'assets/js/'),
  style: path.join(__dirname, 'assets/css/'),
  images: path.join(__dirname, 'assets/images/')
};



const common = {
  entry: {bundle: ['whatwg-fetch', PATHS.bundle], scripts: PATHS.scripts},
  output: {path: __dirname, filename: 'assets/js/[name].js' },
  watch: true,
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
    ]
  },
};

var config;
// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
case 'build':
  config = merge(
    common,
    parts.setFreeVariable(
      'process.env.NODE_ENV',
      'production'
    ),
    parts.clean([PATHS.build, PATHS.style, PATHS.images]),
    parts.minify(),
    parts.buildCSS(),
    parts.moveImgDir()
  );
  break;
default:
  config = merge(
    common,
    {devtool: 'eval-source-map'},
    parts.watchSASS(),
    parts.moveImgDir(),
    parts.dashBoard()
  );
}

module.exports = validate(config);
