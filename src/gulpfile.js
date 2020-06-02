const { src, dest } = require("gulp");

function copy() {
    return src('src/style/main.css').pipe(dest('dist'))
}

exports.copy = copy