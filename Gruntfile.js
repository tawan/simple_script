module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({  
    jasmine: {
      src: 'src/**/*js',
      options: {
        specs: 'specs/**/*Spec.js',
        vendor: [
          "http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
        ]
      }
    },
    exec: {
      generate_parser: {
        cmd: 'node node_modules/jison/lib/cli.js -o src/grammar.js src/grammar.jison'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', [ 'exec:generate_parser', 'jasmine' ]);
  grunt.registerTask('default', 'test');

};
