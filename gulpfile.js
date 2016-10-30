var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    sass    = require('gulp-sass');

var options = {
  default : {
    tasks : [ 'build', 'watch' ]
  },
  build : {
    tasks : [ 'styles', 'scripts', 'vendors' ]
  },
  styles : {
    files       : [ 'client/assets/stylesheets/scss/**/*.scss' ],
    destination : 'client/assets/stylesheets'
  },
  vendors : {
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/ng-infinite-scroll-npm-is-better-than-bower/build/ng-infinite-scroll.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/cryptojslib/rollups/md5.js'
    ],
    destination : 'client/assets/javascripts/vendor',
    fileName: 'bundle.js'
  },
  scripts : {
    files: [ 
      'client/app/app.module.js',
      'client/app/app.routes.js',
      'client/app/components/**/*.js',
      'client/app/filters/*.js' 
    ],
    destination : 'client/assets/javascripts',
    fileName: 'main.js'
  }
};

gulp.task( 'default', options.default.tasks );

gulp.task( 'build', options.build.tasks );

gulp.task('styles', function () {
  return gulp.src(options.styles.files, { noCache: true })
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(options.styles.destination));   
});

gulp.task('watch', function() {
  gulp.watch(options.styles.files, ['styles']);
  gulp.watch(options.scripts.files, ['scripts']);
});

gulp.task('vendors', function() {
  return gulp.src(options.vendors.files)
    .pipe(concat(options.vendors.fileName))
    .pipe(gulp.dest(options.vendors.destination));
});

gulp.task('scripts', function() {
  return gulp.src(options.scripts.files)
    .pipe(concat(options.scripts.fileName))
    .pipe(gulp.dest(options.scripts.destination));
});
