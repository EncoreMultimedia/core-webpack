// Configuring Grunt tasks:
// http://gruntjs.com/configuring-tasks
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Define asset paths
    dirs: {
      scss: 'assets/src/sass',
      css: 'assets/css',
      imagesrc: 'assets/src/images',
      images: 'assets/images',
      jssrc: 'assets/src/js',
      js: 'assets/js'
    },

    // Optimizes the images from src/images and places them inside of images
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 5,
          svgoPlugins: [{ cleanupIDs: false }]
        },
        files: [{
          expand: true,
          cwd: '<%= dirs.imagesrc %>/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= dirs.images %>/'
        }]
      }
    },

    // Compiles sass
    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: '<%= dirs.scss %>',
          src: ['**/*.scss'],
          dest: '<%= dirs.css %>/',
          ext: '.css'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: '<%= dirs.scss %>',
          src: ['**/*.scss'],
          dest: '<%= dirs.css %>/',
          ext: '.css'
        }]
      }
    },

    // After sass compiles, manipulate generated CSS
    postcss: {
      main: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 8']}), // Add browser prefixes
            require('postcss-filter-gradient')() // Add IE gradient filters
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= dirs.css %>',
          src: ['*.css', '!styles-ie.css'],
          dest: '<%= dirs.css %>'
        }]
      },
      old: { // Creates separate old IE css file
        options: {
          map: false,
          processors: [
            require('postcss-unmq')(), // Remove media queries
            require('pixrem')() // Replace rem units with pixels
          ]
        },
        files: {
          '<%= dirs.css %>/styles-ie.css': ['<%= dirs.css %>/styles.css']
        }
      }
    },

    // Minifies CSS outputted by Compass
    cssmin: {
      options: {
        keepSpecialComments: 0,
        mediaMerging: true,
        roundingPrecision: 3
      },
      target: {
        files: [{
          expand: true,
          cwd: '<%= dirs.css %>',
          src: '*.css',
          dest: '<%= dirs.css %>'
        }]
      }
    },

    // Cleans the images and css directories
    clean: ['<%= dirs.css %>/*', '<%= dirs.images %>/*', '<%= dirs.js %>/*'],

    // Concatenates and minifies js files and movies them from src/js to js
    uglify: {
      options: {
        mangle: false, // Doesn't modify the variable names
        sourceMap: true,
        sourceMapRoot: '/assets/js'
      },
      target: {
        files: {
          '<%= dirs.js %>/script.js': ['<%= dirs.jssrc %>/*.js']
        }
      }
    },

    grunticon: {
      sprites: {
        files: [{
          expand: true,
          cwd: 'assets/images',
          src: ['*.svg'],
          dest: 'assets/sprites'
        }],
        options: {
          enhanceSVG: true,
          template: 'assets/grunt_support/grunticon-template.hbs'
        }
      }
    },

    webpack: {
      build: require('./webpack.production.config.js')
    },

    // Watch task: https://npmjs.org/package/grunt-contrib-watch
    watch: {
      images: {
        files: ['<%= dirs.imagesrc %>/*.{png,jpg,gif,svg}'],
        tasks: ['imagemin']
      },
      js: {
        files: ['<%= dirs.jssrc %>/*.js'],
        tasks: ['uglify']
      },
      sass: {
        files: ['<%= dirs.scss %>/**/*.scss'],
        tasks: ['sass:dev', 'postcss']
      },
      options: {
        livereload: true
      }
    }
  });

  // Load the plugin(s)
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-webpack');

  // Default task(s).
  grunt.registerTask('default', 'watch');
  grunt.registerTask('build', ['clean', 'sass:prod', 'imagemin', 'postcss', 'cssmin', 'uglify', 'grunticon:sprites', 'webpack:build']);

};
