import DateWithOffset from "date-with-offset";
import PaizaAPI from "./PaizaAPI.js";

const plugin = {
	id:       "paiza",
	name:     "Paiza実行プラグイン",
	disabled: false,
	intervalActionList: [],
	commandActionList: [
		{
			check({
				actions,
				param:{
					user,
					text,
					ts,
					channel,
				},
				msgObjList,
				replyList,
				botList,
				pluginList,
				targetBot:bot,
			}){
				for(const msgObj of msgObjList){
					// 既に他の計算結果を表示していたら実行しない
					if(msgObj.plugin_id === this.id) return false;
				}
				
				// Paizaの正規表現にヒットしなかったら弾く
				if(!(/(?:^|\s+)(js|cs|coffee|c|cpp|objective-c|java|scala|swift|csharp|go|haskell|erlang|perl|python|python3|ruby|php|bash|r|javascript|coffeescript|vb|cobol|fsharp|d|clojure|mysql):((?:.|[\n\r])+)$/).test(text)){
					return false
				}
				
				// 計算することが確定したら、既にあるbotの他の発言を†抹殺†する
				for(let i=msgObjList.length;i--;){
					let msgObj = msgObjList[i];
					
					if(msgObj.bot_id === bot.id){
						msgObjList.splice(i,1);
					}
				}
				
				return true;
			},
			message({
				actions,
				param:{
					user,
					text,
					ts,
					channel,
				},
				msgObjList,
				replyList,
				botList,
				pluginList,
				targetBot:bot,
			}){
				// 情報を取ってくる
				let [,language,sourceCode] = text.match(/(?:^|[\s\n\r])(js|cs|coffee|c|cpp|objective-c|java|scala|swift|csharp|go|haskell|erlang|perl|python|python3|ruby|php|bash|r|javascript|coffeescript|vb|cobol|fsharp|d|clojure|mysql):((?:.|[\n\r])+)$/);
				
				// オレオレエイリアスをpaiza向けに正規化する
				switch(language){
				case "js":
					language = "javascript";
				break;
				case "cs":
					language = "csharp";
				break;
				case "coffee":
					language = "coffeescript";
				break;
				}
				
				return (async _=>{
					const paiza = new PaizaAPI({
						language,
						sourceCode,
					});
					console.log(language,sourceCode);
					const result = await paiza.send();
					let resultText = result.stdout + result.stderr;
					if(resultText.length > 1023){
						resultText = resultText.slice(0,1023) + "…";
					}
					
					const text = `paiza実行(言語:${result.language}, 結果:${result.result}, メモリ消費:${result.time})
\`\`\`
${resultText}
\`\`\``;
					return this.createMessageObject(text,{
					channel,
						reply_to: user,
					},bot);
				})().catch(err=>{
					throw err;
				});
			},
		},
	],
	wordActionList:[],
};

export default plugin;
