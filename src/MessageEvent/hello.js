import DateWithOffset from "date-with-offset";
import sleep from "../Util/sleep.js";

async function hello({
	slackBot,
	botList,
	pluginList,
	getMessageFormatter,
	postMessageFormatter,
	htmlSpecialChars: h,
},message){
	// 常に利用されるパラメータのバインディングを先に行う
	const intervalActionBindingCallback = intervalAction.bind(null,{
		slackBot,
		postMessageFormatter
	});
	
	// (多態的～～～ｗｗｗ)
	for(const target of [...botList,...pluginList]){
		// 無効のtargetはスルーする
		if(target.disabled) continue;
		
		// 初回起動時にIntervalActionが発動できるかどうかを見る
intervalActionFor: 
		for(const intervalAction of target.intervalActionList){
			// ロケール考慮のDateオブジェクトを生成する(何がロケールだ、俺は日本人だ)
			const actions = {};
			for(const name of ["check","next","message"]){
				actions[name] = intervalAction[name];
				actions[name] = actions[name].bind(target,{
					actions,
					actionDate:new DateWithOffset(540),
				});
			}
			
			// 対象のbot/plugin毎のバインディングをキメる。
			const intervalActionCallback = intervalActionBindingCallback.bind(null,{
				target,
				actions,
			});
			
			// 起動時に即発動した場合は実行しておく
			if(actions.check()){
				intervalActionCallback();
			}
			
			// 定期実行用のループを記述する
			while(true){
				const dt = new DateWithOffset(540);
				const nd = actions.next();
				const delta = Math.max(nd - dt, 1000); // 最小待機時間は１秒とする
				
				if(!Number.isSafeInteger(delta)) continue intervalActionFor;
				
				// 次回実行秒経過するまで待機させる
				await sleep(delta);
				
				// 待機後に実行する
				intervalActionCallback();
			}
		}
	}
}

// 定期実行用の関数を定義する
async function intervalAction({
	slackBot,
	postMessageFormatter,
},{
	target,
	actions,
}){
	// メッセージオブジェクトを取得する
	let msgObj = actions.message();
	if(typeof(msgObj) !== "object") return;
	if(typeof(msgObj) === null) return;
	
	// Promiseの可能性を考慮してIDを付与する
	msgObj[target.messageId] = target.id;
	
	// メッセージオブジェクトの待機処理を行う
	msgObj = await msgObj;
	msgObj = await postMessageFormatter.format(msgObj);
	
	//投稿を行う
	const {channelId,username} = msgObj;
	const data = await slackBot.postMessage(channelId,username,msgObj);
	
	console.log("intervalActionを投稿しました。");
	console.log(data);
}

export default hello;