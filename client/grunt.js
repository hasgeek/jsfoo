/*global module:false*/
var glob = require('glob-whatev'),
    _ = require('underscore');


module.exports = function(grunt) {
                
    // hack to get _foo.js to load first. heh. 
    var srcJS = _(['src/core/js/_foo.js'].concat(glob.glob('src/**/js/*.js').sort())).uniq(); 
    var vendorJS = ['lib/underscore.js', 'lib/deferred.js', 'lib/backbone.js', 'lib/easings.js', 'lib/morpheus.js'];
    var allJS = srcJS.concat(vendorJS);

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
            '*  http://jsfoo.in\n' + 
            '*  Copyright (c) <%= grunt.template.today("yyyy") %> Hasgeek & fly.\n' + 
            '*  BSD License\n*/'
        },
        lint: {
            files: ['grunt.js', 'src/**/js/*.js', 'src/**/test/*.js']
        },
        qunit: {
            files: ['test/**/*.html']
        },
        concat: {
            full:{
                src: allJS,
                dest: 'build/jsfoo.js'
            },
            vendor: {
                src: vendorJS,
                dest: 'build/vendor.js'
            } 

        },
        min: {
            full: {
                src: ['<banner:meta.banner>'].concat(allJS),
                dest: 'build/jsfoo.min.js'
            },
            vendor: {
                src: ['<banner:meta.banner>', 'build/vendor.js'],
                dest:'build/vendor.min.js'
            }
            
        },
        watch: {
            files: ['grunt.js'].concat(allJS), 
            tasks: 'default'
        },
        server: {
            port: 8000,
            base: '.'
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
                browser: true
            },
            globals: {
                _: true,
                Backbone: true,
                jQuery: true, 
                $: true,
                module: true,
                exports: true,
                jsfoo: true,
                console: true,
                require: true,
                morpheus: true,
                easings: true
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat:vendor min:vendor concat:full min:full');



};