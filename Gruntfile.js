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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', 'jasmine');

};
