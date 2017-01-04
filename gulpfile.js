'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    del         = require('del'),
    es          = require('event-stream'),
    path        = require('path');

const BUILD_DIRECTORY = './dist';

gulp.task('clean', () => { return del([BUILD_DIRECTORY]) });

gulp.task('scripts:build', ['clean'], () => { return bundle('src/index.js'); });
gulp.task('scripts:watch', ['clean'], () => { return bundle('src/index.js', true); });

// bundling

function bundle(file, watch) {

    let bundler = browserify({
        entries: [file],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    if(watch) {
        bundler = watchify(bundler);
        bundler.on('update', () => {
            console.log('Rebundling...');
            rebundle();
        });
    }

    const transforms = [
        { 'name': babelify, 'options': { 'presets': ['es2015'], 'ignore': ['node_modules'] } }
    ];

    transforms.forEach(transform => { bundler.transform(transform.name, transform.options); });

    function rebundle() {
        const stream = bundler.bundle();        

        return stream.on('error', console.error)
             .pipe(source(path.basename(file)))
              .pipe(buffer())
              .pipe(sourcemaps.init({ loadMaps: true }))              
              .pipe(sourcemaps.write('./'))
              .pipe(gulp.dest(BUILD_DIRECTORY));
    }

    return rebundle(); 
}