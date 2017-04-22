var gulp = require("gulp");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var base64 = require("gulp-base64");
var imagemin = require("gulp-imagemin");
var inlinesourece = require("gulp-inline-source");
var cleanCSS = require("gulp-clean-css");
var cssimport = require("gulp-cssimport");
var pngquant = require("imagemin-pngquant");

var NAME = "keyboard";

gulp.task("clean",function(){
    return gulp.src("dist").pipe(clean());
});

gulp.task("build-img",function(){
    return gulp.src("images/**/*")
    .pipe(imagemin({
        progressive:true,
        svgoPlugins:[{removeViewBox:false}],
        use:[pngquant()]
    }))
    .pipe(gulp.dest("dist/images/"));
});

gulp.task("build-css",function(){
    return gulp.src("src/css/"+ NAME +".css")
    .pipe(base64())
    // .pipe(cssimport({}))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist"));
});

gulp.task("build-js",function(){
    return gulp.src("src/js/"+ NAME +".js")
    .pipe(uglify())
    .pipe(rename({suffix:".min"}))
    .pipe(gulp.dest("dist"));
});

gulp.task("build-html",function(){
    return gulp.src("index.html")
    .pipe(inlinesourece({
        compress: false
    }))
    .pipe(gulp.dest("dist"));
});

// gulp.task("default",["build-js","build-css"]);
gulp.task("default",["clean"],function(){
    gulp.start("build-js","build-css");
});