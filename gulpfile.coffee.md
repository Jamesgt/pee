Build file.

	gulp = require 'gulp'
	jade = require 'gulp-jade'
	coffee = require 'gulp-coffee'
	browserify = require 'gulp-browserify'
	mocha = require 'gulp-mocha'
	mochaPhantomJs = require 'gulp-mocha-phantomjs'
	uglify = require 'gulp-uglify'
	rename = require 'gulp-rename'
	bump = require 'gulp-bump'
	docco = require 'gulp-docco'

	coffeeCompiler = browserify transform: ['coffeeify'], extensions: ['.coffee.md']
	coffeeCompiler.on 'error', (e) ->
		console.log '--- COFFEE SCRIPT ERROR ----------------'
		console.log e.name, ':', e.message
		console.log '----------------------------------------'

	gulp
	.task 'test-compile-jade', ->
		gulp.src './test/test.jade'
		.pipe jade locals: root: '../../'
		.pipe gulp.dest './test/compiled'

	.task 'test-compile-coffee', ->
		gulp.src './test/tests.coffee.md', read: no
		.pipe coffeeCompiler
		.pipe rename 'browser.js'
		.pipe gulp.dest './test/compiled'

	.task 'test-browser', ['test-compile-jade', 'test-compile-coffee'], ->
		gulp.src './test/compiled/test.html'
		.pipe mochaPhantomJs()

	.task 'test-node', ->
		gulp.src 'test/tests.coffee.md'
		.pipe mocha()

	.task 'test', ['test-node', 'test-browser']

	.task 'dist', ->
		gulp.src './package.json'
		.pipe bump()
		.pipe gulp.dest './'

		gulp.src './src/PassEventEmitter.coffee.md'
		.pipe coffee()
		.pipe gulp.dest './dist'
		.pipe uglify()
		.pipe rename 'PassEventEmitter.min.js'
		.pipe gulp.dest './dist'

		gulp.src './src/PassEventEmitter.coffee.md', read: no
		.pipe coffeeCompiler
		.pipe uglify()
		.pipe rename 'PassEventEmitter.browser.min.js'
		.pipe gulp.dest './dist'

		gulp.src './src/PassEventEmitter.coffee.md'
		.pipe docco layout: 'linear'
		.pipe gulp.dest './docs'
