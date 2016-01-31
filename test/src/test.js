import "babel-polyfill";
import glob from "glob";

// このディレクトリより一つ以上、下の階層にある.jsファイルを全てテスト用のファイルとしてみなす
const pathList = glob.sync(
	"./*/**/*.js",{
		cwd: __dirname,
		ignore: "./Plugin/Paiza/*.js", // APIがPaizaに飛ぶため、該当箇所変更時以外は除外する
	});

for(const path of pathList){
	// †import構文が動的ローダに対応しないのでrequire闇†
	describe(`${path}`,_=>{
		require(path)();
	});
}