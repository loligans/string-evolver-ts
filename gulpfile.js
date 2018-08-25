var spawn = require('child_process').spawnSync;

var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');

var serverTsProject = ts.createProject('./src/tsconfig.json');

gulp.task('clean', () => {
  return gulp.src('./out/**/*', {read: false}).pipe(clean());
});

gulp.task('build', ['clean'], () => {
  return serverTsProject.src()
                        .pipe(sourcemaps.init())
                        .pipe(serverTsProject())
                        .js
                        .pipe(babel({
                          "presets": ['env']
                        }))
                        //.pipe(uglify())
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('./out'));
});

gulp.task('start', () => {
  return spawn('node', ['./out/main.js'], {stdio: 'inherit'});
});
