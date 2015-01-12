module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['build/'],

    jshint: {
      files: ['lib/**/*.js', 'spec/**/*.js'],
      options: {
        node: true,
        jasmine: true,
        globalstrict: true,
        quotmark: true,
        undef: true,
        unused: true
      }
    },

    jasmine_node: {
      all: ['spec/']
    },

    jsdoc: {
      dist: {
        src: ['lib/**/*.js'],
        options: {
          destination: 'build/docs',
          private: false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', ['clean', 'test', 'jsdoc']);
  grunt.registerTask('test', ['jshint', 'jasmine_node']);
};
