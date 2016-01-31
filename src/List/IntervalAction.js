import PriorityListItem from "./PriorityListItem.js";

class IntervalAction extends PriorityListItem{
	constructor(prop){
		if(typeof(prop) !== "object"){
			throw new TypeError("第一引数はObject型を与えてください");
		}
		
		super(prop);
		
		this.check   = prop.check;
		this.next    = prop.next;
		this.message = prop.message;
	}
	
	set check(value){
		if(typeof(value) !== "function"){
			throw new TypeError("checkはFunction型のプロパティです");
		}
		this._check = value;
	}
	get check(){
		return this._check;
	}
	
	set next(value){
		if(typeof(value) !== "function"){
			throw new TypeError("nextはFunction型のプロパティです");
		}
		this._next = value;
	}
	get next(){
		return this._next;
	}
	
	set message(value){
		if(typeof(value) !== "function"){
			throw new TypeError("messageはFunction型のプロパティです");
		}
		this._message = value;
	}
	get message(){
		return this._message;
	}
}

export default IntervalAction;