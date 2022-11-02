const uglify = require('gulp-uglify');
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const imagemin = require('gulp-imagemin')
const concatCss = require('gulp-concat-css')
const { series, parallel, src, dest } = require('gulp')

// Location variables
const paths = {
    src: {
        all: ['./src/**/**.*'],
        html: ['./src/**/**.html', '!./src/**/ignore-*.html'],
        favicons: ['./src/favicon*'],
        downloads: './src/assets/download/**.*',
        headers: './src/_headers',
    },
    build: {
        all: ['./build/**/**.*', './build/**.*', './build/*'],
        dir: './build/',
        downloads: './build/assets/download/'
    }
};

function clean() {
    return del(paths.build.all)
}

function prepareHtml() {
    return src(paths.src.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest(paths.build.dir))
}

function prepareStyles(sources, buildDest, buildFileName) {
    return () => {
        return src(sources)
            .pipe(postcss([cssnano()]))
            .pipe(concatCss(buildFileName ?? 'styles.css'))
            .pipe(dest(buildDest))
    }
}

function prepareJs(sources, buildDest) {
    return () => {
        return src(sources)
            .pipe(uglify())
            .pipe(dest(buildDest))
    }
}

function prepareImages(sources, buildDest) {
    return () => {
        return src(sources)
            .pipe(imagemin())
            .pipe(dest(buildDest))
    }
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
        // Prepares global files for web
        prepareHtml,
        prepareFavicons,
        prepareHttp2,
        // Main page
        prepareStyles(
            './src/assets/css/**.css',
            './build/assets/css/'
        ),
        prepareJs('./src/assets/js/**.js', './build/assets/js/'),
        prepareImages(
            ['./src/assets/images/**/**/*.jpg', './src/assets/images/**/**/*.png', './src/assets/images/**/**/*.svg', './src/assets/images/**/**/*.ico'],
            './build/assets/images/'
        ),
        prepareDownloads,

        // Blog pages
        prepareStyles(
            './src/blog/assets/css/**.css',
            './build/blog/assets/css/'
        ),
        prepareImages(
            ['./src/blog/assets/images/**/**/*.jpg', './src/blog/assets/images/**/**/*.png', './src/blog/assets/images/**/**/*.svg', './src/blog/assets/images/**/**/*.ico'],
            './build/blog/assets/images/'
        ),

        // Micro Garden project pages
        prepareStyles(
            './src/projects/microgarden/assets/css/**.css',
            './build/projects/microgarden/assets/css/'
        ),
        prepareImages(
            ['./src/projects/microgarden/assets/images/**/**/*.jpg', './src/projects/microgarden/assets/images/**/**/*.png', './src/projects/microgarden/assets/images/**/**/*.svg', './src/projects/microgarden/assets/images/**/**/*.ico'],
            './build/projects/microgarden/assets/images/'
        ),
    )
)
exports.default = exports.build
exports.clean = series(clean)
