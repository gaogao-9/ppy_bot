import glob from "glob";
import PriorityList from "./PriorityList.js";
import PluginInfo from "./PluginInfo.js";

class PluginInfoList extends PriorityList{
	constructor(prop){
		super(prop);
	}
	
	register(item){
		if(!(item instanceof PluginInfo)){
			throw new TypeError("PluginInfo型のみが登録できます。");
		}
		super.register(item);
	}
	
	getById(id){
		for(let item of this.list){
			if(item.id === id) return item;
		}
		return null;
	}
	
	static from(iterable){
		const list = new PluginInfoList();
		for(let item of iterable){
			if(item instanceof PluginInfo){
				list.register(item);
			}
			else{
				list.register(new PluginInfo(item));
			}
		}
		return list;
	}
}

export default PluginInfoList;