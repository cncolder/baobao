import child from 'child_process';
import gulp from 'gulp';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import less from 'gulp-less';
import prefix from 'gulp-autoprefixer';
import browserify from 'browserify';
import transform from 'vinyl-transform';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('default', ['pm2-dev', 'watch']);

gulp.task('watch', () => {
  gulp.watch('views/less/**/*.less', ['less']);
  gulp.watch('views/js/**/*.js', ['browserify']);
  gulp.watch(['test/**/*.js', '!test/browser/*'], ['mocha']);
});

gulp.task('less', () => {
  return gulp.src('./views/less/index.less')
    .pipe(less().on('error', function(err) {
      gutil.log(err.message);
      this.emit('end');
    }))
    .pipe(prefix())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./public/css'))
    .on('end', () => {});
});

gulp.task('browserify', () => {
  // set up the browserify instance on a task basis
  let b = browserify({
    debug: true,
  });
  // transform regular node stream to gulp (buffered vinyl) stream
  let browserified = transform(filename => {
    b.add(filename);
    return b.bundle();
  });

  return gulp.src('./views/js/index.js')
    .pipe(browserified)
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('pm2-dev', cb => {
  child.spawn('pm2-dev', ['--raw', 'package.json'], {
      stdio: 'inherit',
    })
    .on('exit', cb);
});

gulp.task('mocha', cb => {
  let env = Object.keys(process.env).reduce((env, key) => {
    env[key] = process.env[key];
    return env;
  }, {});

  Object.assign(env, {
    NODE_ENV: 'test',
    DEBUG: '*',
    MONGOOSE_DISABLE_STABILITY_WARNING: 1,
  });

  child.spawn('mocha', ['--harmony', '--bail', '--reporter', 'dot'], {
    env: env,
    stdio: 'inherit',
  }).on('close', cb);
});
