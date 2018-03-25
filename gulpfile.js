// plugins
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
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

  gulp.src(path.source + '/**/*.ts')
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


// TODO libのファイルをまとめてdistに書き出す
/**
 * build
 */
gulp.task('build', function() {
  gulp.src(path.source + '/app.ts')
  .pipe(plumber({ errorHandler: errorHandler }))
  .pipe(browserify())
  .pipe(gulp.dest(path.dist));
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