import glob from "glob";
import BotInfo from "../List/BotInfo.js";
import BotInfoList from "../List/BotInfoList.js";

class BotLoader{
	static load(){
		const pathList = glob.sync("../BotList/*.js",{cwd:__dirname,});
		const botInfoList = new BotInfoList();
		
		for(const path of pathList){
			// †import構文が動的ローダに対応しないのでrequire闇†
			botInfoList.register(new BotInfo(require(path)));
		}
		
		return botInfoList;
	}
}

export default BotLoader;