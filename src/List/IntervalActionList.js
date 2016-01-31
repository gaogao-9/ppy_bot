import PriorityList from "./PriorityList.js";
import IntervalAction from "./IntervalAction.js";

class IntervalActionList extends PriorityList{
	constructor(prop){
		super(prop);
	}
	
	register(item){
		if(!(item instanceof IntervalAction)){
			throw new TypeError("IntervalAction型のみが登録できます。");
		}
		super.register(item);
	}
	
	static from(iterable){
		const list = new IntervalActionList();
		for(let item of iterable){
			if(item instanceof IntervalAction){
				list.register(item);
			}
			else{
				list.register(new IntervalAction(item));
			}
		}
		return list;
	}
}

export default IntervalActionList;