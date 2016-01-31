import PriorityListItem from "./PriorityListItem.js";
import IntervalActionList from "./IntervalActionList.js";
import CommandActionList from "./CommandActionList.js";
import WordActionList from "./WordActionList.js";

class BotInfo extends PriorityListItem{
	constructor(prop){
		if(typeof(prop) !== "object"){
			throw new TypeError("第一引数はObject型を与えてください");
		}
		
		super(prop);
		
		this.id                 = prop.id;
		this.name               = prop.name;
		this.iconUrl            = prop.iconUrl;
		this.disabled           = prop.disabled || false;
		this.messages           = prop.messages;
		this.intervalActionList = IntervalActionList.from(prop.intervalActionList);
		this.commandActionList  = CommandActionList.from(prop.commandActionList);
		this.wordActionList     = WordActionList.from(prop.wordActionList);
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
	
	set iconUrl(value){
		if(typeof(value) !== "string"){
			throw new TypeError("iconUrlはString型のプロパティです");
		}
		this._iconUrl = value;
	}
	get iconUrl(){
		return this._iconUrl;
	}
	
	set messages(value){
		if(typeof(value)!=="object"){
			throw new TypeError("messagesはObject型のプロパティです");
		}
		this._messages = value;
	}
	get messages(){
		return this._messages;
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
	
	createRandomMessageObject(name,prop = {}){
		// 指定されたキーのリストがなければ発言しない
		if(!this.messages[name]) return null;
		
		const text = this._getRandomText(this.messages[name]);
		return this.createMessageObject(text,prop);
	}
	
	createMessageObject(text,prop = {}){
		return Object.assign({
			bot_id: this.id,
			text,
			username: `${this.name}(@${this.id})`,
			icon_url: this.iconUrl,
		},prop);
	}
	
	_getRandomText(list){
		// ランダムに1つを抽出する
		return list[Math.random()*list.length|0];
	}
}

export default BotInfo;