module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    clean: ["dist", "build.spec"],
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'spec/**/*.js']
    },
    jasmine_node: {
      specNameMatcher: "spec",
      projectRoot: ".",
      coffee: true,
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    coffee: {
      spec: {
        files: {
          'build.spec/*.js': ['spec/*.coffee'] // compile individually into dest, maintaining folder structure
        }
      }
    },
    watch: {
      files: '<config:lint.files>',
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
        exports: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('spec', 'coffee:spec jasmine_node');
  grunt.registerTask('default', 'lint spec');

};
