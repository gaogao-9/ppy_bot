import CommandAction from "../List/CommandAction.js";
import WordAction from "../List/WordAction.js";
import sleep from "../Util/sleep.js";

async function message({
	slackBot,
	botList,
	pluginList,
	getMessageFormatter,
	postMessageFormatter,
},data){
	// 通常のメッセージ以外は弾く
	if(data.subtype) return;
	
	// 全てのBotがつぶやくオブジェクトを溜めておく
	const outMsgObjList = [];
	
	// ユーザー名とチャンネルタグを抽出しながらテキストの処理をする
	const {messageObject:inMsgObj,symbols} = await getMessageFormatter.format(data);
	
	for(const bot of [...botList]){
		// 無効のbotはスルーする
		if(bot.disabled) continue;
		
		// commandやwordのActionについてさばいていく
		for(const botAction of [...bot.commandActionList,...bot.wordActionList]){
			// commandActionの時には、replyシンボルに引っかかるワードがあるかを見る
			if((botAction instanceof CommandAction) && (symbols.reply.indexOf(bot.id) === -1)){
				continue;
			}
			
			// actionsオブジェクトを生成する
			const actions = {};
			for(const name of ["check","message"]){
				actions[name] = botAction[name];
				actions[name] = actions[name].bind(bot,{
					actions,
					param: inMsgObj,
					msgObjList: outMsgObjList,
					symbols,
					botList,
					pluginList,
				});
			}
			
			// 実行関数にひっかけて、実行する場合はメッセージを登録する
			if(actions.check()){
				// メッセージオブジェクトを取得する
				let outMsgObj = actions.message();
				if(typeof(outMsgObj) !== "object") continue;
				if(typeof(outMsgObj) === null) continue;
				
				// Promiseの可能性を考慮してIDを付与する
				outMsgObj[bot.messageId] = bot.id;
				
				outMsgObj = await outMsgObj;
				
				// 追加する
				outMsgObjList.push(outMsgObj);
			}
			
			// プラグインへの処理を適用する
			for(const plugin of [...pluginList]){
				for(const pluginAction of [...plugin.commandActionList,...plugin.wordActionList]){
					// botおよびpluginが両方共同じ種類のアクションの時だけ適用する
					if((botAction instanceof CommandAction) && !(pluginAction instanceof CommandAction)) continue;
					if((botAction instanceof WordAction) && !(pluginAction instanceof WordAction)) continue;
					
					// actionsオブジェクトを生成する
					const actions = {};
					for(const name of ["check","message"]){
						actions[name] = pluginAction[name];
						actions[name] = actions[name].bind(plugin,{
							actions,
							param: inMsgObj,
							msgObjList: outMsgObjList,
							symbols,
							botList,
							pluginList,
							targetBot: bot,
						});
					}
					
					// 実行関数にひっかけて、実行する場合はメッセージを登録する
					if(actions.check()){
						// メッセージオブジェクトを取得する
						let outMsgObj = actions.message();
						if(typeof(outMsgObj) !== "object") continue;
						if(typeof(outMsgObj) === null) continue;
						
						// Promiseの可能性を考慮してIDを付与する
						outMsgObj[plugin.messageId] = plugin.id;
						
						outMsgObj = await outMsgObj;
						
						// 追加する
						outMsgObjList.push(outMsgObj);
					}
				}
			}
		}
	}
	
	// 引っかかったメッセージを全て投稿する
	for(let messageObject of outMsgObjList){
		// メッセージオブジェクトはPromiseの可能性もあるので待機する
		let outMsgObj = messageObject;
		outMsgObj = await postMessageFormatter.format(outMsgObj);
		
		//投稿を行う
		let {channelId,username} = outMsgObj;
		const data = await slackBot.postMessage(channelId,username,outMsgObj);
		
		console.log("commandActionもしくはwordActionを投稿しました。");
		console.log(data);
	}
}

export default message;