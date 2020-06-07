const { src, dest, task, series, watch } = require("gulp");
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

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss',
    'src/styles/main.css'
]

task('styles', () => {
    return src(styles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.scss'))
        .pipe(sassGlob()) //Продвинутый импорт стилей
        .pipe(sass().on('error', sass.logError))
        .pipe(px2rem())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: true
            }))
        .pipe(gcmq()) //не нужен при разработке
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(dest('dist'));
    /* сначала установить npm install node-sass gulp-sass --save-dev*/
});

task('scripts', () => {
    return src('src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js', { newLine: ';\n\n' }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
});

watch('./src/styles/**/*.css', series('styles'));
watch('./src/styles/**/*.scss', series('styles')); //слежка за изменениями в файлах и выполнение таска styles
watch('./src/*.html', series('copy:html'));

task("default", series("clean", "copy:html", "styles", 'scripts', 'server'));