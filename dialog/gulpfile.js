var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
minifycss = require('gulp-minify-css');


gulp.task('default',function(){
	return gulp.src('style.css')
		.pipe(gulp.dest('dist/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/'))
		.pipe(notify({ message: 'Styles task complete' }));
})

gulp.task('js', function() {  
	return gulp.src('src/dialog.js')
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('default'))
	//.pipe(concat('main.js'))
	.pipe(gulp.dest('./dist/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/'))
	.pipe(notify({ message: 'Scripts task complete' }));
});
