import glob from "glob";
import PluginInfo from "../List/PluginInfo.js";
import PluginInfoList from "../List/PluginInfoList.js";

class PluginLoader{
	static load(){
		const pathList = glob.sync("../Plugin/*/index.js",{cwd:__dirname,});
		const pluginInfoList = new PluginInfoList();
		
		for(const path of pathList){
			// †import構文が動的ローダに対応しないのでrequire闇†
			pluginInfoList.register(new PluginInfo(require(path)));
		}
		
		return pluginInfoList;
	}
}

export default PluginLoader;