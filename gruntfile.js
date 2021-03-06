'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt); // Show elapsed time after tasks run to visualize performance
    require('load-grunt-tasks')(grunt); // Load all Grunt tasks that are listed in package.json automagically

    var JS_FILES = [
      './bower_components/snap.svg/dist/snap.svg-min.js',
      './bower_components/reqwest/reqwest.min.js',
      './bower_components/strftime/strftime-min.js',
      './bower_components/classie/classie.js',
      './assets/js/highlight.pack.js',
      './assets/js/switch.js',
      './assets/js/scrollMenu.js',
      './assets/js/highlight.js',
      './assets/js/upcoming-events.js',
      './assets/js/navigation-main.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // shell commands for use in Grunt tasks
        shell: {
            jekyllServe: { command: 'jekyll serve' },
            jekyllBuild: { command: 'jekyll build' }

        },

        // watch for files to change and run tasks when they do
        watch: {
            javascript: {
                files: ['assets/js/**/*.js'],
                tasks: ['concat:development'],
                options: { livereload: true } //using the browserextension
            },
            sass: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass'],
                options: { livereload: true } //using the browserextension
            }
        },

        // sass (libsass) config
        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded'
            },
            dev: {
              files: [{
                expand: true,
                cwd: '_sass/',
                src: ['**/*.{scss,sass}'],
                dest: 'css/',
                ext: '.css'
              }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: '_site/css/',
                    ext: '.css'
                }]
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'sass:dev',
                'concat:development',
                'watch',
                'shell:jekyllServe'
            ],
            options: { logConcurrentOutput: true }
        },

        postcss: {
          options: {
            map: false,
            processors: [
              require('autoprefixer')({browsers: 'last 2 versions'}),
              require('cssnano')()
            ]
          },
          dist: {
            src: '_site/css/*.css'
          }
        },
        
        concat: {
          options: {
           separator: ';'
          },
          development : {
            src: JS_FILES,
            dest: 'js/cssclasses.js'
          }
        },

        uglify : {
          build : {
            options : {
              sourceMap: true
            },
            files: {
              'js/cssclasses.min.js': JS_FILES
            }
          }
        },

        env : {
          build : {
            JEKYLL_ENV : 'production'
          }
        }
    });

    // Register the grunt serve task
    grunt.registerTask('serve', ['concurrent:serve' ]);

    // Register the grunt build task
    grunt.registerTask('build', [
        'env:build',
        'shell:jekyllBuild',
        'sass:build',
        'postcss',
        'uglify:build'
    ]);

    // Register build as the default task fallback
    grunt.registerTask('default', 'serve');
};
