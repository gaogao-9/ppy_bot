import PriorityListItem from "./PriorityListItem.js";
import IntervalActionList from "./IntervalActionList.js";
import CommandActionList from "./CommandActionList.js";
import WordActionList from "./WordActionList.js";

class PluginInfo extends PriorityListItem{
	constructor(prop){
		if(typeof(prop) !== "object"){
			throw new TypeError("第一引数はObject型を与えてください");
		}
		
		super(prop);
		
		this.id                 = prop.id;
		this.name               = prop.name;
		this.disabled           = prop.disabled || false;
		this.intervalActionList = IntervalActionList.from(prop.intervalActionList);
		this.commandActionList  = CommandActionList.from(prop.commandActionList);
		this.wordActionList     = WordActionList.from(prop.wordActionList);
	}
	
	get messageId(){
		return "plugin_id";
	}
	
	set id(value){
		if(typeof(value) !== "string"){
			throw new TypeError("idはString型のプロパティです");
		}
		this._id = value;
	}
	get id(){
		return this._id;
	}
	
	set name(value){
		if(typeof(value) !== "string"){
			throw new TypeError("nameはString型のプロパティです");
		}
		this._name = value;
	}
	get name(){
		return this._name;
	}
	
	set disabled(value){
		if(typeof(value) !== "boolean"){
			throw new TypeError("disabledはBoolean型のプロパティです");
		}
		this._disabled = value;
	}
	get disabled(){
		return this._disabled;
	}
	
	set intervalActionList(value){
		if(!(value instanceof IntervalActionList)){
			throw new TypeError("intervalActionListはIntervalActionList型のプロパティです");
		}
		this._intervalActionList = value;
	}
	get intervalActionList(){
		return this._intervalActionList;
	}
	
	set commandActionList(value){
		if(!(value instanceof CommandActionList)){
			throw new TypeError("commandActionListはCommandActionList型のプロパティです");
		}
		this._commandActionList = value;
	}
	get commandActionList(){
		return this._commandActionList;
	}
	
	set wordActionList(value){
		if(!(value instanceof WordActionList)){
			throw new TypeError("wordActionListはWordActionList型のプロパティです");
		}
		this._wordActionList = value;
	}
	get wordActionList(){
		return this._wordActionList;
	}
	
	createMessageObject(text,prop = {}, targetBot = {}){
		const name     = prop.name     || targetBot.name    || this.name;
		const id       = prop.id       || targetBot.id      || this.id;
		const icon_url = prop.icon_url || targetBot.iconUrl || this.iconUrl;
		const username = prop.username || `${name}(@${id})`;
		
		return Object.assign({
			[this.messageId]: this.id,
			text,
			username,
			icon_url,
		},prop);
	}
}

export default PluginInfo;