const { src, dest, task, series } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass');
const concat = require('gulp-concat');

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

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss',
    'src/styles/main.css'
]

task('styles', () => {
    return src(styles)
        .pipe(concat('main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist'));
    /* сначало установить npm install node-sass gulp-sass --save-dev*/
});

task("default", series("clean", "styles"));