import "babel-polyfill";
import SlackBot from "slackbots";
import slackToken from "./slackToken.js"; // .gitignoreしてるので自分のトークンを使ってください
import BotLoader from "./Loader/BotLoader.js";
import PluginLoader from "./Loader/PluginLoader.js";
import MessageEventLoader from "./Loader/MessageEventLoader.js";
import GetMessageFormatter from "./Util/GetMessageFormatter.js";
import PostMessageFormatter from "./Util/PostMessageFormatter.js";
import sleep from "./Util/sleep.js";

// エントリポイント
async function startSlackBot(){
	// SlackBot用インスタンスの生成
	const slackBot = new SlackBot({
		token: slackToken,
	});
	// メッセージオブジェクトの整形クラスの生成
	const getMessageFormatter  = new GetMessageFormatter(slackBot);
	const postMessageFormatter = new PostMessageFormatter(slackBot);
	
	// デバッグ用(投稿を止める)
	// slackBot.postMessage = ((_,__,messageObject)=>Promise.resolve(messageObject));
	
	// ローダーから各種一覧を生成
	const botList       = BotLoader.load();
	const pluginList    = PluginLoader.load();
	const messageEvents = MessageEventLoader.load({
		slackBot,
		getMessageFormatter,
		postMessageFormatter,
		botList,
		pluginList
	});
	
	console.log(botList);
	console.log(pluginList);
	
	slackBot
		.on("start",_=>{
			// define channel, where bot exist. You can adjust it there https://my.slack.com/services  
			console.log("on start");
		})
		.on("message",data=>{
			console.log("on message");
			console.log(data);
			
			const type = data.type + ((data.subtype && ("_"+data.subtype)) || "");
			
			// 定義されていないイベントであればスルー
			if(!messageEvents[type]) return;
			
			// 定義されていればそれを呼び出して実行する
			messageEvents[type](data)
				.catch(err=>{
					// エラーが発生した場合は、エラーを表示させて継続させる
					// (メッセージループを絶やしてはいけない…絶対にだ…)
					console.error(err.stack);
				});
		})
		.on("open",_=>{
			console.log("on open");
			
		})
		.on("close",data=>{
			console.log("on close");
			throw new Error("stream closed");
		});
	
	await slackBot.login();
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

