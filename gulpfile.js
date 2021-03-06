// plugins
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    typeScript = require('gulp-typescript'),
    postcss = require('gulp-postcss'),
    server = require('gulp-webserver');


// path
var path = {
  root  : __dirname,
  dist  : __dirname + '/dist',
  source: __dirname + '/src',
  lib   : __dirname + '/lib',
  test  : __dirname + '/test'
};


/**
 * TypeScriptのコンパイル
 */
gulp.task('ts', function() {
  var ts = typeScript.createProject('./tsconfig.json');

  gulp.src([
    path.source + '/**/*.ts',
  ])
  .pipe(plumber({ errorHandler: errorHandler }))
  .pipe(ts())
  .pipe(gulp.dest(path.lib));
});


/**
 * scssのコンパイル
 */
gulp.task('scss', function() {
  var supportBrowser = ['> 0.5% in JP'],
      postcssPlugins = [
        require('autoprefixer')(supportBrowser),
        require('postcss-sorting')
      ];

  gulp.src(path.source + '/**/*.scss')
  .pipe(plumber({ errorHandler: errorHandler }))
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(postcss(postcssPlugins))
  .pipe(gulp.dest(path.lib));
});


/**
 * build
 */
gulp.task('build', function() {
  // js
  browserify({
    entries: path.lib + '/app.js',
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(path.dist + '/js')).on('end', function() {
    gulp.src(path.dist + '/**/bundle.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(path.dist));
  });

  // css
  gulp.src(path.lib + '/**/*.css')
  .pipe(plumber({ errorHandler: errorHandler }))
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest(path.dist + '/css'))
  .pipe(cleanCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(path.dist + '/css'));
});


/**
 * webserverの起動
 */
gulp.task('webserver', function() {
  gulp.src(path.root)
  .pipe(server({
    // livereload: true, // 自動更新
    open: true // 自動でブラウザで開く
  }));
});


/**
 * watch
 */
gulp.task('watch', function() {
  gulp.watch(path.source + '/**/*.ts', ['ts']);
  gulp.watch(path.source + '/**/*.scss', ['scss']);
});


/**
 * default
 *   サーバを立ち上げて、ファイルの監視をする
 */
gulp.task('default', ['webserver', 'watch']);


/**
 * Plumberのエラーハンドリング
 */
function errorHandler(err) {
  console.log(err.messageFormatted);
  return this.emit('end');
}