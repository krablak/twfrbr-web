const uglify = require('gulp-uglify');
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const imagemin = require('gulp-imagemin')
var concatCss = require('gulp-concat-css')
const { series, parallel, src, dest } = require('gulp')

// Location variables
var paths = {
    build: {
        all: ['./build/**/**.*', './build/**.*', './build/*'],
        dir: './build/',
        styles: {
            main: './build/assets/css/',
            mainFile: 'styles.css'
        },
        images: {
            main: './build/assets/images/'
        },
        fonts: {
            blog: './build/blog/assets/fonts/'
        },
        js: './build/assets/js/',
        downloads: './build/assets/download/'
    },
    src: {
        all: ['./src/**/**.*'],
        html: ['./src/**/**.html', '!./src/**/ignore-*.html'],
        fonts: ['./src/assets/fonts/**.*', './src/blog/assets/fonts/**.*'],
        images: {
            main: ['./src/assets/images/**/**/*.jpg', './src/assets/images/**/**/*.png', './src/assets/images/**/**/*.svg', './src/assets/images/**/**/*.ico']
        },
        favicons: ['./src/favicon*'],
        js: './src/assets/js/**.js',
        styles: {
            main: './src/assets/css/**.css'
        },
        downloads: './src/assets/download/**.*',
        headers: './src/_headers',
    },
};

function clean() {
    return del(paths.build.all)
}

function prepareHtml() {
    return src(paths.src.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest(paths.build.dir))
}

function prepareStyles() {
    return src(paths.src.styles.main)
        .pipe(postcss([cssnano()]))
        .pipe(concatCss(paths.build.styles.mainFile))
        .pipe(dest(paths.build.styles.main))
}

function prepareJs() {
    return src(paths.src.js)
        .pipe(uglify())
        .pipe(dest(paths.build.js))
}

function prepareImages() {
    return src(paths.src.images.main)
        .pipe(imagemin())
        .pipe(dest(paths.build.images.main))
}

function prepareFavicons() {
    return src(paths.src.favicons)
        .pipe(dest(paths.build.dir))
}

function prepareDownloads() {
    return src(paths.src.downloads)
        .pipe(dest(paths.build.downloads))
}

function prepareHttp2() {
    return src(paths.src.headers)
        .pipe(dest(paths.build.dir));
}

exports.build = series(
    clean,
    parallel(
        prepareHtml,
        prepareStyles,
        prepareJs,
        prepareImages,
        prepareFavicons,
        prepareDownloads,
        prepareHttp2
    )
)
exports.default = exports.build
exports.clean = series(clean)
