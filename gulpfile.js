/* eslint-disable */

var gulp = require('gulp');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var del = require('del');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
  return del('build');
});

gulp.task('babel:dev', ['clean'], function() {
  return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
});

gulp.task('babel:prod', ['clean'], function() {
  return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('prod', ['lint', 'babel:prod']);

gulp.task('dev', ['babel:dev']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['dev']);
});
