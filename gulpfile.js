const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

sass.compiler = require('node-sass'); //sass компилятор node

task('clean', () => {
    return src('dist/**/*', { read: false }) //gulp-rm подключение  npm install --save-dev gulp-rm
        .pipe(rm()) // удаление всех файлов из папки dist
});

task('copy:html', () => {
    return src('src/*.html')
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
    /* копируем файлы с расширением .html, и .scss из папки 
                                                   src в папку dist*/
});

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss',
    'src/styles/main.css'
]

task('styles', () => {
    return src(styles)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.min.scss'))
        .pipe(sassGlob()) //Продвинутый импорт стилей
        .pipe(sass().on('error', sass.logError))
        .pipe(px2rem())
        .pipe(gulpif(env === 'dev',
            autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: true
            })))
        .pipe(gulpif(env === 'prod', gcmq())) //не нужен при разработке
        .pipe(gulpif(env === 'prod', cleanCSS())) //не нужен при разработке
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
    /* сначала установить npm install node-sass gulp-sass --save-dev*/
});

const libs = [
    'node_modules/jquery/dist/jquery.js',
    'src/scripts/*.js'

]

task('scripts', () => {
    return src(libs)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.min.js', { newLine: ';\n\n' }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('icons', () => {
    return src('src/images/icons/*.svg')
        .pipe(
            svgo({
                plugins: [{
                    removeAttrs: {
                        attrs: '(fill|stroke|style|width|height|data.*)'
                    }
                }]
            })
        )
        .pipe(dest('dist/images/icons'));
})

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

task('watch', () => {
    watch('./src/styles/**/*.css', series('styles'));
    watch('./src/styles/**/*.scss', series('styles')); //слежка за изменениями в файлах и выполнение таска styles
    watch('./src/*.html', series('copy:html'));
    watch('./src/scripts/*.js', series('scripts'));
    watch('./src/images/icons/*.svg', series('icons'));
});



task(
    "default",
    series(
        "clean",
        parallel("copy:html", "styles", 'scripts', 'icons'),
        parallel('watch', 'server')
    )
);

task(
    "build",
    series(
        "clean",
        parallel("copy:html", "styles", 'scripts', 'icons')
    )
);



// npm run gulp --- запуск галпа для разработки

// npm run build --- после окончания разработки