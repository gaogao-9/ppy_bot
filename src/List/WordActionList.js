import PriorityList from "./PriorityList.js";
import WordAction from "./WordAction.js";

class WordActionList extends PriorityList{
	constructor(prop){
		super(prop);
	}
	
	register(item){
		if(!(item instanceof WordAction)){
			throw new TypeError("WordAction型のみが登録できます。");
		}
		super.register(item);
	}
	
	static from(iterable){
		const list = new WordActionList();
		for(let item of iterable){
			if(item instanceof WordAction){
				list.register(item);
			}
			else{
				list.register(new WordAction(item));
			}
		}
		return list;
	}
}

export default WordActionList;