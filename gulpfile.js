var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
var cssmin = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var path = require('path');
var url = require('url')
var fs = require('fs')

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('./src/css'))
})
gulp.task('minjs', function() {
    return gulp.src('./src/js/js.js')
        .pipe(minjs())
        .pipe(gulp.dest('./src/js/libs'))
})

gulp.task('watchcss', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'))

})
gulp.task('watchjs', function() {
    return gulp.watch('./src/js/js.js', gulp.series('minjs'))
})
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8080,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname
                console.log(pathname)
                if (pathname === '/favicon.ico') {
                    return res.end()
                } else {
                    var pathname = pathname === '/' ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})
gulp.task('dev', gulp.series('sass', 'minjs', 'server', 'watchcss', 'watchjs'))