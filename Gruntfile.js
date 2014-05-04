module.exports = function(grunt) {

    // Configure grunt plugins
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            build: {
                command: 'browserify -e src/YouMe.js -r ./src/YouMe.js:YouMe --standalone YouMe -o build/dev/<%= pkg.name %>.<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> v<%= pkg.version %>: <%= grunt.template.today("mm/dd/yyyy") %> */\n'
            },
            dist: {
                src: 'build/dev/<%= pkg.name %>.<%= pkg.version %>.js',
                dest: 'build/release/<%= pkg.name %>.<%= pkg.version %>.min.js'
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-shell'); // Grunt shell
    grunt.loadNpmTasks('grunt-contrib-uglify'); // Uglify

    // Register tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', 'Build the library.', ['shell:build', 'uglify:dist']);

};