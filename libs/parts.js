const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
const autoprefixer = require('autoprefixer');
const postcssFilterGradient = require('postcss-filter-gradient');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
//on build, build all scss files
exports.buildCSS = function() {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("assets/css/styles.css")
    ],
    postcss: function () {
      return [autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 8']}), postcssFilterGradient()];
    },
  };
};

//dev enviroment run just a scss loader.
exports.watchSASS = function() {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    }
  };
};


exports.moveImgDir = function() {
  return {
    plugins: [
      new CopyWebpackPlugin([
          { from: 'assets/src/images/', to: 'assets/images' }
      ])
    ]
  };

};

exports.imgMin = function() {
  return {
    plugins: [
      new ImageminPlugin({
        test: 'assets/images/**',
        optipng: {
          optimizationLevel: 7
        },
        svgo: {
          cleanupIDs: false
        },
      })
    ]
  };
};

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
  // Don't beautify output (enable for neater output)
        beautify: false,
        // Eliminate comments
        comments: false,
        // Compression specific options
        compress: {
          warnings: false,
          // Drop `console` statements
          drop_console: true
        },
        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$','webpackJsonp'],
          // Don't care about IE8
          screw_ie8 : true,
          // Don't mangle function names
          keep_fnames: true
        }
      })
    ]
  };
};

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};

exports.clean = function(paths) {
  return {
    plugins: [
      new CleanWebpackPlugin(paths, {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
};

exports.dashBoard = function(){
  return {
    plugins: [
      new DashboardPlugin()
    ]
  };
};
