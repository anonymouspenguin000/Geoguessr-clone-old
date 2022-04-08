// GULPFILE

const BUILD_NAME = 'main'; // please, specify your build name. Empty string to use the whole DIST

const gulp = require('gulp');
const { src, dest } = gulp;
const autoprfx = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const js_include = require('gulp-rigger');
const html_include = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const brwsync = require('browser-sync');
const del = require('gulp-clean');
const copy = require('gulp-copy');

const reload = brwsync.reload;

const SRC_DIR = './src/';
const DIST_DIR = './dist/';

const path = {
	build: {
		html: DIST_DIR + BUILD_NAME + '/',
		css: DIST_DIR + BUILD_NAME + '/css',
		js: DIST_DIR + BUILD_NAME + '/js',
		img: DIST_DIR + BUILD_NAME + '/img',
		fonts: DIST_DIR + BUILD_NAME + '/fonts'
	},
	src: {
		html: [SRC_DIR + BUILD_NAME + '/html/*.html', '!' + SRC_DIR + '**/_*.html'],
		sass: [SRC_DIR + BUILD_NAME + '/sass/*.scss', '!' + SRC_DIR + '**/_*.scss'],
		js: [SRC_DIR + BUILD_NAME + '/js/*.js', '!' + SRC_DIR + '**/_*.js'],
		img: SRC_DIR + BUILD_NAME + '/img/*.{png,jpg,svg,webp,ico}',
		fonts: SRC_DIR + BUILD_NAME + '/fonts/*'
	},
	watch: {
		html: SRC_DIR + BUILD_NAME + '/html/**/*.html',
		sass: SRC_DIR + BUILD_NAME + '/sass/**/*.scss',
		js: SRC_DIR + BUILD_NAME + '/js/**/*.js',
		img: SRC_DIR + BUILD_NAME + '/img/**/*',
		fonts: SRC_DIR + BUILD_NAME + '/fonts/**/*'
	},
	clean: './' + DIST_DIR + BUILD_NAME + '/'
}

function serve() {
	brwsync.init({
		server: {
			baseDir: './' + DIST_DIR + BUILD_NAME + '/'
		}
	});
}
function html(gd) {
	src(path.src.html)
		.pipe(html_include({
			prefix: '@@',
			basepath: '@file'
		}))
		.on('error', console.log.bind(console))
		.pipe(dest(path.build.html))
		.pipe(reload({ stream: true }));
	gd();
}
function css(gd) {
	src(path.src.sass)
		.pipe(sass({
			errorLogToConsole: true,
			outputStyle: 'compressed'
		}))
		.on('error', console.log.bind(console))
		.pipe(autoprfx({
			cascade: false
		})).pipe(rename({ suffix: '.min' }))
		.pipe(dest(path.build.css))
		.pipe(reload({ stream: true }));
	gd();
}
function js(gd) {
	src(path.src.js)
		.pipe(js_include())
		.on('error', console.log.bind(console))
		.pipe(dest(path.build.js))
		.pipe(reload({ stream: true }));
	gd();
}
function img(gd) {
	src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(reload({ stream: true }));
	gd();
}
function fonts(gd) {
	src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(reload({ stream: true }));
	gd();
}
function clean(gd = () => undefined) {
	/*try {
		src(path.clean).pipe(del());
	} catch (e) {}*/
	gd();
}
function watchFiles() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.sass, css);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.img, img);
	gulp.watch(path.watch.fonts, fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

gulp.task('ping', (gd) => {
	console.log('pong');
	gd();
});

gulp.task(html);
gulp.task(css);
gulp.task(js);
gulp.task(img);
gulp.task(fonts);
gulp.task(clean);

gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('default', watch);
