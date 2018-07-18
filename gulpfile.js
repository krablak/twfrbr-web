var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var less = require('gulp-less');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');

var packageJson = require('./package.json');

// Application version
var version = packageJson.version;

// Location variables
var paths = {
    build: {
        all: ['./build/**/**.*', './build/**.*'],
        dir: "./build/",
        styles: "./build/assets/css/",
        images: "./build/assets/images/",
        js: "./build/assets/js/",
        downloads: "./build/assets/downloads/"
    },
    src: {
        all: ['./src/**/**.*', './src/**.*'],
        html: './src/**/**.html',
        fonts: './src/assets/fonts/**.*',
        images: ["./src/assets/images/**.jpg", "./src/assets/images/**.ico", "./src/assets/images/**.png", "./src/assets/images/**.svg", "./src/assets/images/**.gif"],
        js: "./src/assets/js/**.js",
        css: "./src/assets/css/**.css",
        downloads: "./src/assets/downloads/**.*",
        headers: "./src/_headers",
    },
};

gulp.task('default', ['build'], function () {
});

// Creates distribution build  
gulp.task('build',
    [
        'prepare-html',
        'prepare-css',
        'prepare-js',
        'prepare-images',
        'prepare-downloads',
        'prepare-headers'
    ],
    function () { }
);

// Copy HTML files to build
gulp.task('prepare-html', function () {
    return gulp.src(paths.src.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(paths.build.dir));
});

// Process css files
gulp.task('prepare-css', function () {
    return gulp.src(paths.src.css)
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.build.styles));
});

// Process js files
gulp.task('prepare-js', function () {
    return gulp.src(paths.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.js));
});

// Copy and optimize images into build
gulp.task('prepare-images', function () {
    return gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.build.images));
});

gulp.task('prepare-downloads', function () {
    return gulp.src(paths.src.downloads)
        .pipe(gulp.dest(paths.build.downloads));
});

// Copy http2 settings
gulp.task('prepare-headers', function () {
    return gulp.src(paths.src.headers)
        .pipe(gulp.dest(paths.build.dir));
});