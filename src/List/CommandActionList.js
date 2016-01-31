import PriorityList from "./PriorityList.js";
import CommandAction from "./CommandAction.js";

class CommandActionList extends PriorityList{
	constructor(prop){
		super(prop);
	}
	
	register(item){
		if(!(item instanceof CommandAction)){
			throw new TypeError("CommandAction型のみが登録できます。");
		}
		super.register(item);
	}
	
	static from(iterable){
		const list = new CommandActionList();
		for(let item of iterable){
			if(item instanceof CommandAction){
				list.register(item);
			}
			else{
				list.register(new CommandAction(item));
			}
		}
		return list;
	}
}

export default CommandActionList;