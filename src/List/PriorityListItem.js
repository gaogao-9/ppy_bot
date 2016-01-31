class PriorityListItem{
	constructor(prop){
		if(typeof(prop) !== "object"){
			throw new TypeError("第一引数はObject型を与えてください");
		}
		
		this.priority = prop.priority || null;
	}
	
	set priority(value){
		if(!Number.isSafeInteger(value) && (value !== null)){
			throw new TypeError("priorityはNullableなNumber(Integer)型のプロパティです");
		}
		this._priority = value;
	}
	get priority(){
		return this._priority;
	}
}

export default PriorityListItem;
