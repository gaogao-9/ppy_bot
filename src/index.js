import "babel-polyfill";
import SlackBot from "slackbots";
import DateWithOffset from "date-with-offset";
import slackToken from "./slackToken.js"; // .gitignoreしてるので自分のトークンを使ってください
import CommandAction from "./List/CommandAction.js";
import WordAction from "./List/WordAction.js";
import BotLoader from "./Loader/BotLoader.js";
import PluginLoader from "./Loader/PluginLoader.js";
import GetMessageFormatter from "./Util/GetMessageFormatter.js";
import PostMessageFormatter from "./Util/PostMessageFormatter.js";
import HtmlSpecialChars from "./Util/HtmlSpecialChars.js";
import sleep from "./Util/sleep.js";

// エントリポイント
function startSlackBot(){
	return new Promise((_,reject)=>{
		// SlackBot用インスタンスの生成
		const slackBot = new SlackBot({
			token: slackToken,
		});
		
		// ローダーから各種一覧を生成
		const botList    = BotLoader.load();
		const pluginList = PluginLoader.load();
		
		// メッセージオブジェクトの整形クラスの生成
		const postMessageFormatter = new PostMessageFormatter(slackBot);
		const getMessageFormatter  = new GetMessageFormatter(slackBot);
		
		// HTMLエスケープ用のライブラリを初期化する
		const h = new HtmlSpecialChars({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;'
		});
		
		console.log(botList);
		console.log(pluginList);
		
		// デバッグ用(投稿を止める)
		//slackBot.postMessage = ((_,__,messageObject)=>Promise.resolve(messageObject));
		
		slackBot
			.on("start",_=>{
				// define channel, where bot exist. You can adjust it there https://my.slack.com/services  
				console.log("on start");
			})
			.on("message",data=>{
				console.log("on message");
				console.log(data);
				
				switch(data.type){
				case "hello":
					// (多態的～～～ｗｗｗ)
					for(const target of [...botList,...pluginList]){
						// 無効のtargetはスルーする
						if(target.disabled) continue;
						
						// 初回起動時にIntervalActionが発動できるかどうかを見る
						for(const [index,intervalAction] of target.intervalActionList.entries()){
							// ロケール考慮のDateオブジェクトを生成する(何がロケールだ、俺は日本人だ)
							let {check,next,message} = intervalAction;
							let actions = {check,next,message};
							actions.check = actions.check.bind(target,{
									actions,
									actionDate:new DateWithOffset(540),
								});
							actions.next = actions.next.bind(target,{
									actions,
									actionDate:new DateWithOffset(540),
								});
							actions.message = actions.message.bind(target,{
									actions,
									actionDate:new DateWithOffset(540),
								});
							
							// 定期実行用の関数を定義する
							const intervalActionCallback = function({actions,intervalAction}){
								const dt = new DateWithOffset(540);
								const nd = actions.next();
								const delta = nd - dt;
								
								if(!Number.isSafeInteger(delta)) return;
								
								// メッセージオブジェクトを取得する
								const msgObjPromise = actions.message();
								if(typeof(msgObjPromise) !== "object") return;
								if(typeof(msgObjPromise) === null) return;
								
								msgObjPromise.then(msgObj=>{
									const {channelId,username} = msgObj;
									
									console.log("intervalAction発動!");
										
									//投稿を行う
									slackBot.postMessage(channelId,username,msgObj)
										.then(data=>{
											console.log(`intervalActionを投稿しました。 targetId: ${target.id}, intervalActionIndex: ${index}`);
											console.log(data);
										})
										.catch(err=>{
											console.log("err:",err);
										});
									
									// 再度登録する
									intervalAction._intervalActionId = setTimeout(intervalActionCallback,delta);
								}).catch(err=>{
									throw err;
								});
							}.bind(target,{actions,intervalAction})
							
							// 起動時に即発動した場合は実行しておく
							if(actions.check()){
								intervalActionCallback();
							}
							// そうでなければ登録だけしておく
							else{
								const dt = new DateWithOffset(540);
								const nd = actions.next();
								const delta = nd - dt;
								
								if(!Number.isSafeInteger(delta)) continue;
								intervalAction._intervalActionId = setTimeout(intervalActionCallback,delta);
							}
						}
					}
				break;
				case "message":
					// 全てのBotがつぶやくオブジェクトを溜めておく
					const msgObjList = [];
					
					// 通常のメッセージ以外は弾く
					if(data.subtype) break;
					
					// リプライっぽいのを見つけたら分離しておく
					(async ()=>{
						// 参加者一覧を取ってくる
						const usersList = (await slackBot.getUsers()).members;
						
						// ユーザー名の処理をする
						const replyList = [];
						let formattedText = data.text
							// ユーザ名の抽出1(登録されているユーザー名)
							.replace(/(?:<@([A-Z0-9]+)(\|[a-z0-9_]+)?>)/g,($0,$1,$2)=>{
								if($2){
									// ユーザ名指定があればそれを利用する
									replyList.push($2);
								}
								else{
									// 指定がなければリストの中から特定する
									const user = usersList.find(obj=>obj.id===$1);
									if(user){
										replyList.push(user.name);
									}
								}
								
								// テキスト中からは除外しておく
								return "";
							})
						
						// その他よくわからないものは良くわからないから消し去っておく（死）
						formattedText = formattedText.replace(/<[^<>]+?>/g,()=>"");
						
						// ユーザ名の抽出2(架空のユーザー名)
						while(true){
							let text = formattedText.replace(/(?:^|(\s))@([a-z0-9_]+)(?:(\s)|$)/g,($0,$1,$2,$3)=>{
								replyList.push($2);
								return ($1||"")+($3||"");
							});
							if(formattedText === text) break;
							formattedText = text;
						}
						
						// HTML特殊文字をデコードする
						formattedText = h.unescape(formattedText);
						
						// 本物のtextとすり替えておく
						[data.text,data.rawText] = [formattedText,data.text];
						
						for(const bot of [...botList]){
							// 無効のbotはスルーする
							if(bot.disabled) continue;
							
							// commandやwordのActionについてさばいていく
							for(const botAction of [...bot.commandActionList,...bot.wordActionList]){
								// commandActionの時には、replyListに引っかかるワードがあるかを見る
								if((botAction instanceof CommandAction) && (replyList.indexOf(bot.id) === -1)){
									continue;
								}
								
								// bot自身への処理を適用する
								let {check,message} = botAction;
								let actions = {check,message};
								
								actions.check = actions.check.bind(bot,{
										actions,
										param: data,
										msgObjList,
										replyList,
										botList,
										pluginList,
									});
								actions.message = actions.message.bind(bot,{
										actions,
										param: data,
										msgObjList,
										replyList,
										botList,
										pluginList,
									});
								
								// 実行関数にひっかけて、実行する場合はメッセージを登録する
								if(actions.check()){
									// メッセージオブジェクトを取得する
									let msgObj = actions.message();
									if((typeof(msgObj) !== "object") && (msgObj !== null)) continue;
									msgObj = await msgObj;
									
									// 追加する
									msgObjList.push(msgObj);
								}
								
								// プラグインへの処理を適用する
								for(const plugin of [...pluginList]){
									for(const pluginAction of [...plugin.commandActionList,...plugin.wordActionList]){
										// botおよびpluginが両方共同じ種類のアクションの時だけ適用する
										if((botAction instanceof CommandAction) && !(pluginAction instanceof CommandAction)) continue;
										if((botAction instanceof WordAction) && !(pluginAction instanceof WordAction)) continue;
										
										let {check,message} = pluginAction;
										let actions = {check,message};
										
										actions.check = actions.check.bind(plugin,{
												actions,
												param: data,
												msgObjList,
												replyList,
												botList,
												pluginList,
												targetBot: bot,
											});
										actions.message = actions.message.bind(plugin,{
												actions,
												param: data,
												msgObjList,
												replyList,
												botList,
												pluginList,
												targetBot: bot,
											});
										
										// 実行関数にひっかけて、実行する場合はメッセージを登録する
										if(actions.check()){
											// メッセージオブジェクトを取得する
											let msgObj = actions.message();
											if((typeof(msgObj) !== "object") && (msgObj !== null)) continue;
											msgObj = await msgObj;
											
											// 追加する
											msgObjList.push(msgObj);
										}
									}
								}
							}
						}
						
						// 引っかかったメッセージを全て投稿する
						for(let messageObject of msgObjList){
							// メッセージオブジェクトはPromiseの可能性もあるので待機する
							let msgObj = messageObject;
							msgObj = await postMessageFormatter.format(msgObj);
							let {channelId,username} = msgObj;
							
							console.log(msgObj);
							
							//投稿を行う
							slackBot.postMessage(channelId,username,msgObj)
								.then(data=>{
									console.log(`commandActionもしくはwordActionを投稿しました。`);
									console.log(data);
								})
								.catch(err=>{
									console.log("err:",err);
								});
						}
					})().catch(err=>{
						console.log(err);
						return;
					});
				break;
				}
			})
			.on("open",_=>{
				console.log("on open");
				
			})
			.on("close",data=>{
				console.log("on close");
				reject(data);
			});
		
		slackBot.login()
			.catch(err=>{
				reject(err);
			});
	});
}

// 落ちた時に自動で再起動します(async-await有能)
async function messageLoop(delay){
	try{
		await startSlackBot();
	}
	catch(err){
		console.log("エラーが発生しました");
		console.log(err);
		console.log(`${delay}秒後に再接続します…`);
		await sleep(delay*1000);
		messageLoop(Math.min(delay*2,60));
	}
}

messageLoop(1).catch(err=>{
	console.error("†Unhandled Error†");
	console.error(err);
	throw err;
});

