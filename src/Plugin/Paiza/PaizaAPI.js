import fetch from "node-fetch";
import qs from "qs";
import sleep from "../../util/sleep.js";

class PaizaAPI{
	constructor(prop){
		if(typeof(prop) !== "object"){
			throw new TypeError("第一引数はObject型を与えてください");
		}
		
		this._id           = null;
		this.language      = prop.language;
		this.sourceCode    = prop.sourceCode;
		this.intervalDelay = prop.intervalDelay || 1000;
		this.useLongpoll   = prop.useLongpoll || true;
		this.timeout       = prop.timeout || 10000;
		this.apiKey        = prop.apiKey || "guest";
	}
	
	get id(){
		return this._id;
	}
	
	set language(value){
		if(typeof(value) !== "string"){
			throw new TypeError("languageはString型のプロパティです");
		}
		this._language = value;
	}
	get language(){
		return this._language;
	}
	
	set sourceCode(value){
		if(typeof(value) !== "string"){
			throw new TypeError("sourceCodeはString型のプロパティです");
		}
		this._sourceCode = value;
	}
	get sourceCode(){
		return this._sourceCode;
	}
	
	set intervalDelay(value){
		if(typeof(value) !== "number"){
			throw new TypeError("intervalDelayはNumber型のプロパティです");
		}
		this._intervalDelay = value;
	}
	get intervalDelay(){
		return this._intervalDelay;
	}
	
	set useLongpoll(value){
		if(typeof(value) !== "boolean"){
			throw new TypeError("useLongpollはBoolean型のプロパティです");
		}
		this._useLongpoll = value;
	}
	get useLongpoll(){
		return this._useLongpoll;
	}
	
	set timeout(value){
		if(typeof(value) !== "number"){
			throw new TypeError("timeoutはNumber型のプロパティです");
		}
		this._timeout = value;
	}
	get timeout(){
		return this._timeout;
	}
	
	set apiKey(value){
		if(typeof(value) !== "string"){
			throw new TypeError("apiKeyはString型のプロパティです");
		}
		this._apiKey = value;
	}
	get apiKey(){
		return this._apiKey;
	}
	
	async send(){
		// 実行開始時間を記録する
		const startTime = Date.now();
		
		// paizaへソースコードを飛ばす
		let runners = await this.createRunners();
		
		// 計算が終わるまで結果を遅延する
		while(runners.status !== "completed"){
			if((Date.now()-startTime) > this.timeout){
				throw new Error("通信がタイムアウトしました");
			}
			
			// 数秒間待機する
			await sleep(this.intervalDelay);
			
			// 計算状態を再取得する
			runners = await this.getRunnersStatus();
		}
		
		// 実行結果をpaizaから取ってきて返す
		return await this.getRunnersDetails();
	}
	
	async createRunners(){
		const url   = "http://api.paiza.io/runners/create";
		const query = qs.stringify({
			source_code: this.sourceCode,
			language: this.language,
			longpoll: this.useLongpoll,
			api_key: this.apiKey,
		});
		
		const result = await fetch(url+"?"+query,{ method: "POST" });
		
		if(result.status !== 200){
			throw new Error(`ステータスコードが正常値ではありませんでした(${result.status})`);
		}
		
		const json = await result.json();
		
		if(json.error) throw new Error(json.error);
		
		this._id = json.id;
		
		return json;
	}
	
	async getRunnersStatus(){
		const url   = "http://api.paiza.io/runners/get_status";
		const query = qs.stringify({
			id: this.id,
			api_key: this.apiKey,
		});
		
		const result = await fetch(url+"?"+query);
		
		if(result.status !== 200){
			throw new Error(`ステータスコードが正常値ではありませんでした(${result.status})`);
		}
		
		const json = await result.json();
		
		if(json.error) throw new Error(json.error);
		
		return json;
	}
	
	async getRunnersDetails(){
		const url   = "http://api.paiza.io/runners/get_details";
		const query = qs.stringify({
			id: this.id,
			api_key: this.apiKey,
		});
		
		const result = await fetch(url+"?"+query);
		
		if(result.status !== 200){
			throw new Error(`ステータスコードが正常値ではありませんでした(${result.status})`);
		}
		
		const json = await result.json();
		
		if(json.error) throw new Error(json.error);
		
		return json;
	}
}

export default PaizaAPI;

/* usage
(async _=>{
	const paiza = new PaizaAPI({
		language: "javascript",
		sourceCode: "console.log(1);",
	});
	
	const result = await paiza.send();
	
	console.log(`実行結果: ${result.stdout + result.stderr}`);
})().catch(err=>{
	console.log("通信に失敗しました");
	throw err;
});
*/