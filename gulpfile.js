// var gulp = require('gulp');
// var gutil = require('gulp-util');
// var bower = require('bower');
// var concat = require('gulp-concat');
// var sass = require('gulp-sass');
// var minifyCss = require('gulp-minify-css');
// var rename = require('gulp-rename');
// var sh = require('shelljs');
// var del = require('del');

var appName = 'IonicGulpSeed';


var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ripple = require('ripple-emulator');
var cache = require('gulp-cached');

// Unified Watch Object
var watchFiles = {
    serverViews: ['./www/*.html'],
    serverJS: ['./gulpfile.js', './config/**/*.js', './www/**/*.js'],
    clientViews: ['./www/modules/**/views/**/*.html'],
    clientJS: ['./www/js/*.js', './www/modules/**/*.js'],
    // clientCSS: ['public/modules/**/*.css'],
    clientCSS: ['./www/dist/application.min.css', './www/modules/**/*.css'],
    clientSASS:  ['./www/less/**/*.less', './www/modules/**/*.less'],
    mochaTests: ['./www/tests/**/*.js']
};

// Project Configuration
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    .alias('t', 'test')
    .alias('l', 'lint')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('port', 9000)
    .default('strip-debug', false)
    .default('test', false)
    .argv;

// emulate or run would also mean build
var build = args.build || args.emulate || args.run;
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!args.stripDebug;
var test = args.test;
var lint = args.lint;
// if build we use 'www', otherwise '.tmp'
var targetDir = path.resolve(build ? 'www' : '.tmp');

// if we just use emualate or run without specifying platform, we assume iOS
// in this case the value returned from yargs would just be true
if (emulate === true) {
    emulate = 'ios';
}
if (run === true) {
    run = 'ios';
}

// global error handler
function errorHandler(error) {
  console.log('beep: ', beep);
  beep();
  if (build) {
    throw error;
  } else {
    plugins.util.log(error);
  }
}

// clean target dir
gulp.task('clean', function(done) {
  del([targetDir], done);
});


// precompile .scss and concat with ionic.css
// gulp.task('styles', function() {
//
//   var options = build ? { style: 'compressed' } : { style: 'expanded' };
//
//   var sassStream = gulp.src('app/styles/main.scss')
//     .pipe(plugins.sass(options))
//     .on('error', function(err) {
//       console.log('err: ', err);
//       beep();
//     });
//
//
//   var ionicStream = gulp.src('bower_components/ionic/scss/ionic.scss')
//     .pipe(cache('styles'))
//     .pipe(plugins.sass(options))
//     .pipe(plugins.remember('styles'))
//     .on('error', function(err) {
//         console.log('err: ', err);
//         beep();
//       });
//
//   return streamqueue({ objectMode: true }, ionicStream, sassStream)
//     .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
//     .pipe(plugins.concat('main.css'))
//     .pipe(plugins.if(build, plugins.stripCssComments()))
//     .pipe(plugins.if(build && !emulate, plugins.rev()))
//     .pipe(gulp.dest(path.join(targetDir, 'styles')))
//     .on('error', errorHandler);
// });

//EGB
// build templatecache, copy scripts.
// if build: concat, minsafe, uglify and versionize
gulp.task('scripts', function() {
  var dest = path.join(targetDir, 'scripts');

  var minifyConfig = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeComments: true
  };

  // prepare angular template cache from html templates
  // (remember to change appName var to desired module name)
  var templateStream = gulp
    .src('**/*.html', {cwd: 'www/modules/**/views'})
    .pipe(plugins.angularTemplatecache('views.js', {
      root: 'modules/',
      module: appName,
      htmlmin: build && minifyConfig
    }));

  var scriptStream = gulp
    .src('**/*.js', {cwd: 'www/modules'})

    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(stripDebug, plugins.stripDebug()))
    .pipe(plugins.if(build, plugins.concat('appw.js')))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});

// no-op = empty function
gulp.task('noop', function() {});

// our main sequence, with some conditional jobs depending on params
gulp.task('default', function(done) {
  runSequence(
    'clean',
    //'iconfont',
    //[
     // 'fonts',
     // 'templates',
     // 'styles',
     // 'images',
    //  'vendor'
    //],
    'scripts',
    //'index',
    //build ? 'noop' : 'watchers',
    //build ? 'noop' : 'serve',
    //emulate ? ['ionic:emulate', 'watchers'] : 'noop',
    //run ? 'ionic:run' : 'noop',
    done);
});
//
// var paths = {
//   sass: ['./scss/**/*.scss']
// };
//
// gulp.task('default', ['sass']);
//
// gulp.task('sass', function(done) {
//   gulp.src('./scss/ionic.app.scss')
//     .pipe(sass({
//       errLogToConsole: true
//     }))
//     .pipe(gulp.dest('./www/css/'))
//     .pipe(minifyCss({
//       keepSpecialComments: 0
//     }))
//     .pipe(rename({ extname: '.min.css' }))
//     .pipe(gulp.dest('./www/css/'))
//     .on('end', done);
// });
//
// gulp.task('watch', function() {
//   gulp.watch(paths.sass, ['sass']);
// });
//
// gulp.task('install', ['git-check'], function() {
//   return bower.commands.install()
//     .on('log', function(data) {
//       gutil.log('bower', gutil.colors.cyan(data.id), data.message);
//     });
// });
//
// gulp.task('git-check', function(done) {
//   if (!sh.which('git')) {
//     console.log(
//       '  ' + gutil.colors.red('Git is not installed.'),
//       '\n  Git, the version control system, is required to download Ionic.',
//       '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
//       '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
//     );
//     process.exit(1);
//   }
//   done();
// });
