var spawn = require('child_process').spawnSync;

var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var merge = require('merge-stream');
var nodemon = require('gulp-nodemon');


gulp.task('clean', () => {
  return gulp.src('./out/**/*', {read: false}).pipe(clean());
});

gulp.task('build', ['clean'], () => {
  var tsProject = ts.createProject('./src/tsconfig.json');
  var tsResult = gulp.src(['src/**/*.ts'])
                     .pipe(sourcemaps.init())
                     .pipe(tsProject());
  return merge(tsResult, tsResult.js)
                        .pipe(babel({presets: ['env'], ignore: ['**/*.d.ts']}))
                        //.pipe(uglify())
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('./out'));
});

gulp.task('start', () => {
  return spawn('node', ['./out/main.js'], {stdio: 'inherit'});
});
