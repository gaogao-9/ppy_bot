const gulp     = require("gulp");
const babel    = require("gulp-babel");
const plumber  = require("gulp-plumber");
const notifier = require("node-notifier");
const rimraf   = require("rimraf");

gulp.task("babel",(callback)=>{
	// メイン記述用
	const mainPromise = new Promise((resolve,reject)=>{
		gulp.src(["./slackToken.js","./src/**/*.js"])
			.pipe(plumber({
				errorHandler(err){
					notifier.notify({
						message: err.message,
						title: err.plugin,
						sound: "Glass"
					});
				},
			}))
			.pipe(babel())
			.pipe(gulp.dest("./debug"))
			.on("end",resolve);
	});
	
	// テスト記述用
	const testPromise = new Promise((resolve,reject)=>{
		gulp.src(["./test/src/**/*.js"])
			.pipe(plumber({
				errorHandler(err){
					notifier.notify({
						message: err.message,
						title: err.plugin,
						sound: "Glass"
					});
				},
			}))
			.pipe(babel())
			.pipe(gulp.dest("./test/debug"))
			.on("end",resolve);
	});
	
	Promise.all([mainPromise,testPromise]).then(()=>{callback()});
});

gulp.task("clean",(callback)=>{
	const mainDebugPromise = new Promise((resolve,reject)=>{
		rimraf("./debug",resolve);
	});
	const mainReleasePromise = new Promise((resolve,reject)=>{
		rimraf("./release",resolve);
	});
	
	// テスト用記述
	const testDebugPromise = new Promise((resolve,reject)=>{
		rimraf("./test/debug",resolve);
	});
	const testReleasePromise = new Promise((resolve,reject)=>{
		rimraf("./test/release",resolve);
	});
	
	Promise.all([mainDebugPromise,mainReleasePromise,testDebugPromise,testReleasePromise])
		.then(_=>{callback()})
		.catch(_=>{callback()});
});

gulp.task("release",["babel"],(callback)=>{
	// メイン記述用
	const mainPromise = new Promise((resolve,reject)=>{
		gulp.src(["./slackToken.js","./debug/**/*.js"])
			.pipe(gulp.dest("./release"))
			.on("end",resolve);
	});
	
	// テスト記述用
	const testPromise = new Promise((resolve,reject)=>{
		gulp.src(["./test/debug/**/*.js"])
			.pipe(gulp.dest("./test/release"))
			.on("end",resolve);
	});
	
	Promise.all([mainPromise,testPromise]).then(()=>{callback()});
});

gulp.task("watch", function() {
  gulp.watch(["./slackToken.js","./src/**/*.js","./test/src/**/*.js"], ["babel"]);
});

gulp.task("watch-release", function() {
  gulp.watch(["./slackToken.js","./src/**/*.js","./test/src/**/*.js"], ["release"]);
});

gulp.task("default", ["babel", "watch"]);

gulp.task("default-release", ["release", "watch-release"]);