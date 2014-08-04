module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: {
        dist: '/*!\n'+
               ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n'+
               ' */\n'
      },
      outputDir: 'js/dist',
      output : '<%= meta.outputDir %>/<%= pkg.main %>',
      outputMin : '<%= meta.outputDir %>/<%= pkg.main.replace("js", "min.js") %>'
    },

    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: [
          'js/vendor/underscore-min.js',
          'js/vendor/eveline.js',
          'js/vendor/canvasquery.js',
          'js/vendor/dat-gui.js',
          'js/engine/engine.js',
          'js/engine/loader.js',
          'js/engine/assets.js',
          'js/engine/application.js',
          'js/engine/scene.js',
          'js/engine/collection.js',
          'js/engine/utils.js',
          'js/main.js',
          'js/entity/*.js',
          'js/game.js',
        ],

        dest: '<%= meta.output %>.js'
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner.dist %>'
        },
        files: {
          '<%= meta.outputDir %>/<%= pkg.main %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
    },

    // jshint: {
    //   files: ['Gruntfile.js', 'js/']
    // },

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('test', [/*'jshint'*/]);
  grunt.registerTask('default', ['test','concat','uglify']);

};