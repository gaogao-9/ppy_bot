import glob from "glob";

class MessageEventLoader{
	static load(obj = {}){
		const pathList = glob.sync("../MessageEvent/*.js",{cwd:__dirname,});
		const messageEventList = {};
		
		for(const path of pathList){
			// †import構文が動的ローダに対応しないのでrequire闇†
			const messageEvent = require(path);
			
			// イベントリストに登録する
			messageEventList[messageEvent.name] = messageEvent.bind(null,obj);
		}
		
		return messageEventList;
	}
}

export default MessageEventLoader;