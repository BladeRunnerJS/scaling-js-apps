var path = require("path");

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          '**/*.md',
          '**/*.png',
          '**/*.jpg',
          '!**/node_modules/**',
          '!**/_book/**'
        ],
        tasks: ['gitbook:build'],
        options: {
          interrupt: true,
        },
      },
    },
    gitbook: {
      build: {
        input: path.join(__dirname, ".")
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          hostname: '*',
          base: '_book'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-gitbook');

  // Default task(s).
  grunt.registerTask('default', [
    'gitbook:build',
    'connect',
    'watch'
  ]);

};
