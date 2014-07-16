module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({  
    jasmine: {
      src: 'src/**/*js',
      options: {
        specs: 'specs/**/*Spec.js',
        vendor: [
          "bower_components/jquery/dist/jquery.js"
        ]
      }
    },
    exec: {
      generate_parser: {
        cmd: 'node node_modules/jison/lib/cli.js -o src/grammar.js src/grammar.jison'
      },
      bower_install: {
        cmd: 'node node_modules/bower/bin/bower install'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', [ 'exec:generate_parser', 'exec:bower_install', 'jasmine' ]);
  grunt.registerTask('default', 'test');

};
