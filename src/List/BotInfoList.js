import glob from "glob";
import PriorityList from "./PriorityList.js";
import BotInfo from "./BotInfo.js";

class BotInfoList extends PriorityList{
	constructor(prop){
		super(prop);
	}
	
	register(item){
		if(!(item instanceof BotInfo)){
			throw new TypeError("BotInfo型のみが登録できます。");
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
		const list = new BotInfoList();
		for(let item of iterable){
			if(item instanceof BotInfo){
				list.register(item);
			}
			else{
				list.register(new BotInfo(item));
			}
		}
		return list;
	}
}

export default BotInfoList;