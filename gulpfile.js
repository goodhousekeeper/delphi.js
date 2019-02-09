var gulp = require('gulp')
var rename = require('gulp-rename')

/* JS */
var concat = require('gulp-concat')
var minify = require('gulp-minify')

/* LESS */
var less = require('gulp-less')
var cleanCss = require('gulp-clean-css')

/* -------------------------------------------------------------------------------------------------------------- */

gulp.task('delphi_js', function () {
  'use strict'
  return gulp.src(['delphi/dfm.delphi.js', 'delphi/core.delphi.js', 'delphi/vcl.delphi.js'])
    .pipe(concat('all.delphi.js', {newLine: ';'}))
    .pipe(minify({
      noSource: true
    }))
    .pipe(rename('min.delphi.js'))
    .pipe(gulp.dest('delphi'))
})

gulp.task('delphi_style', function () {
  'use strict'
  return gulp.src('delphi/res.delphi.less')
    .pipe(less())
    .pipe(gulp.dest('delphi'))
    .pipe(cleanCss())
    .pipe(rename('min.delphi.css'))
    .pipe(gulp.dest('delphi'))
})

/* --------------------------------------------------------------------------------------------------------------  */

gulp.task('watch:delphi', function () {
  'use strict'
  gulp.watch(['delphi/dfm.delphi.js', 'delphi/core.delphi.js', 'delphi/vcl.delphi.js'], ['delphi_js'])
  gulp.watch('delphi/res.delphi.less', ['delphi_style'])
})

/* --------------------------------------------------------------------------------------------------------------  */
