var gulp = require('gulp');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');

gulp.task('default', ['sassify', 'lint', 'watch']);

gulp.task('watch', function() {
  gulp.watch(['../app/**/*.js', '../sass/**/*.scss' ], ['lint', 'sassify']);
});

gulp.task('sassify', function () {
  return gulp.src('../sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../css'));
});

gulp.task('lint', function() {
  return gulp.src('../app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', function() {}
  );
});
