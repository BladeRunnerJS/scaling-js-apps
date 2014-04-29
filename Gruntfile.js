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
    shell: {
      gitbook_serve: {
        command: 'gitbook serve',
        options: {
          async: true
        }
      },
      options: {
        stdout: true,
        stderr: true,
        failOnError: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-gitbook');

  // Default task(s).
  grunt.registerTask('default', [
    'shell:gitbook_serve',
    'watch'
  ]);

};
