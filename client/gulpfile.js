'use strict';

const gulp = require('gulp'),
    clean = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    less = require('gulp-less'),
    replace = require('gulp-replace'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    path = require('path'),
    templateCache = require('gulp-angular-templatecache'),
    es = require('event-stream'),
    pkg = require('./package.json'),
    flatten = require('gulp-flatten'),
    stripDebug = require('gulp-strip-debug');

(function() {

	var config = {
        // set environment (default: development)
        env : process.env.NODE_ENV || 'local',
        // Release - path to release folder
        distdir : 'release',
        // Vendors
        vendorsPath : ['src/vendor/js/jquery/jquery.min.js','src/vendor/js/angular/angular.min.js', 'src/vendor/js/angular/angular-ui-router.min.js', 'src/vendor/js/angular/angular-sanitize.min.js','src/vendor/js/underscore/*.js'],
        // HTML templates
        templatesPath : ['src/app/**/*.tpl.html'],
        // Images
        images : ['src/assets/**'],
        // CSS -
        css : ['src/vendor/css/*.css'],
        index : 'src/app/index.html',
         cdn : {
            local : '/static/'
        },

        banner : ['/*!',
            ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= date %>',
            ' * <%= pkg.homepage %>',
            ' * Copyright (c) <%= year %> <%= pkg.author %>;',
            ' */',
            ''].join('\n')
    };

    // script paths
    var scriptsPath = ['src/app/**/*.js', config.distdir + '/templates/**/*.js'];
    var cdnPath = '/static/';

	// Clean release folder
	gulp.task('clean', function(cb) {
        clean(config.distdir, cb);
    });

	//Copy file and folder
     gulp.task('copy', ['clean'], function(){
        var csCSSFN = pkg.name + '-' + pkg.version + '.min.css',
            csVENFN = pkg.name + '-vendor-' + pkg.version + '.min.js',
            csJSFN = pkg.name + '-' + pkg.version + '.min.js';

        var time = (new Date().getTime());
        
        return es.concat(
            gulp.src(config.index)
                .pipe(replace('evolent.min.css', csCSSFN))
                .pipe(replace('evolent.min.js', csJSFN))
                .pipe(replace('vendor.min.js', csVENFN))
                .pipe(replace('plugins.min.css', 'plugins.min.css?v='+pkg.version))
                .pipe(gulp.dest(config.distdir)),
            gulp.src(config.css)
                .pipe(concat('plugins.min.css'))
                .pipe(minifycss())
                .pipe(gulp.dest(config.distdir + '/css')),
            gulp.src(config.images)
                .pipe(gulp.dest(config.distdir + '/images'))
        );
    });

     // Make angular templates
    gulp.task('templateCache', ['copy'], function () {
        return es.concat(
            gulp.src(config.templatesPath)
                .pipe(templateCache('templates.js',{module: 'templates.app', standalone: true}))
                .pipe(gulp.dest(config.distdir + '/templates'))
        );
    });

    // Make css and minify css
    gulp.task('less', ['templateCache'], function () {
        return es.concat(
            gulp.src('src/less/stylesheet.less')
                .pipe(concat(pkg.name + '-' + pkg.version + '.css'))
                .pipe(header(config.banner, { pkg : pkg,  date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy")}))
                .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
                .pipe(gulp.dest(config.distdir + '/css'))
                .pipe(concat(pkg.name + '-' + pkg.version + '.min.css'))
                .pipe(minifycss())
                .pipe(gulp.dest(config.distdir + '/css'))
        );
    });

  gulp.task('vendors', ['less'], function(){
        return es.concat(
            gulp.src(config.vendorsPath)
                .pipe(concat(pkg.name + '-vendor-' + pkg.version + '.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest(config.distdir + '/js'))
        );
    });

  // Create csio angular build
    gulp.task('build', ['vendors'], function(){
        return gulp.src(scriptsPath)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(concat(pkg.name + '-' + pkg.version + '.js'))
            .pipe(header(config.banner, { pkg : pkg,  date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy")}))
            .pipe(gulp.dest(config.distdir + '/js'))
            .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
            .pipe(uglify({compress: false, mangle : false}).on('error', gutil.log))
            .pipe(header(config.banner, { pkg : pkg, date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy") }))
            .pipe(gulp.dest(config.distdir + '/js'));
    });

    // Watch for html files
    gulp.task('templateCacheWatch', function () {
        return es.concat(
            gulp.src(config.templatesPath)
                .pipe(templateCache('templates.js',{module: 'templates.app', standalone: true}))
                .pipe(replace('cdn', cdnPath))
                .pipe(gulp.dest(config.distdir + '/templates'))
        );
    });

    // Watch for less files
    gulp.task('lessWatch', function () {
        return gulp.src('src/less/stylesheet.less')
            .pipe(concat(pkg.name + '-' + pkg.version + '.css'))
            .pipe(header(config.banner, { pkg : pkg,  date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy")}))
            .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
            .pipe(gulp.dest(config.distdir + '/css'))
            .pipe(concat(pkg.name + '-' + pkg.version + '.min.css'))
            .pipe(minifycss())
            .pipe(gulp.dest(config.distdir + '/css'))
    });

    // Watch for js files
    gulp.task('scriptWatch', ['templateCacheWatch'], function(){
        return gulp.src(scriptsPath)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(concat(pkg.name + '-' + pkg.version + '.js'))
            .pipe(header(config.banner, { pkg : pkg,  date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy")}))
            .pipe(gulp.dest(config.distdir + '/js'))
            .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
            .pipe(uglify({compress: false, mangle : false}).on('error', gutil.log)).on('error', function(){this.emit('end');})
            .pipe(header(config.banner, { pkg : pkg, date : gutil.date("yyyy-mm-dd"), year : gutil.date("yyyy") }))
            .pipe(gulp.dest(config.distdir + '/js'));
    });

    // replace the cdn url in the files
    gulp.task('cdnReplace', ['build'], function() {
        return es.concat(
            gulp.src(config.distdir + '/index.html')
                .pipe(replace('cdn/', cdnPath))
                .pipe(gulp.dest(config.distdir)),
            gulp.src(config.distdir + '/templates/templates.js')
                .pipe(replace('cdn/', cdnPath))
                .pipe(gulp.dest(config.distdir + '/templates')),
            gulp.src([config.distdir + '/js/'+pkg.name + '-' + pkg.version + '.min.js', config.distdir + '/js/'+pkg.name + '-' + pkg.version + '.js'])
                .pipe(replace('cdn/', cdnPath))
                .pipe(gulp.dest(config.distdir + '/js'))
        );
    });

    gulp.task('default', ['cdnReplace']);

    gulp.task('watch', function(){
        gulp.watch('src/app/**/*.js', ['scriptWatch']);
        gulp.watch('src/**/*.less', ['lessWatch']);
        gulp.watch('src/app/**/*.tpl.html', ['scriptWatch']);
    });

})();