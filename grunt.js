module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      files: ['*.js', 'lib/**/*.js', 'spec/**/*.js']
    },
    exec: {
      spec: {
        command: 'jasmine-node --coffee spec',
        stdout: true
      }
    },
    watch: {
      files: ['<config:lint.files>', 'spec/**/*.coffee'],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true,
        exec: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('spec', 'exec:spec');
  grunt.registerTask('default', 'lint spec');
};

