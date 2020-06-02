const { src, dest, task, series } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass');

const files = [
    'src/**/*.scss',
    'src/**/*.css',
]

sass.compiler = require('node-sass'); //sass компилятор node

task('clean', () => {
    return src('dist/**/*', { read: false }) //gulp-rm подключение  npm install --save-dev gulp-rm
        .pipe(rm()) // удаление всех файлов из папки dist
});

task('copy', () => {
    return src(files).pipe(dest('dist'))
        /* копируем файлы с расширением .css, и .scss из папки 
                                                       src в папку dist*/
});

task('styles', () => {
    return src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist'));
    /* сначало установить npm install node-sass gulp-sass --save-dev*/
});

task("default", series("clean", "styles"));