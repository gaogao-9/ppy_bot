import DateWithOffset from "date-with-offset";

class PostMessageFormatter{
	constructor(slackBot){
		this._slackBot = slackBot;
	}
	
	get slackBot(){
		return this._slackBot;
	}
	
	async format(msgObj){
		// オブジェクトの整形を行う
		msgObj      = await this.formatObject(msgObj);
		msgObj.text = await this.formatText(msgObj);
		
		// 投稿結果オブジェクトを返す
		return msgObj;
	}
	
	async formatObject(msgObj){
		// チャンネルIDの取得
		if(msgObj.channel_name){
			const channel = await this.slackBot.getChannel(msgObj.channel_name);
			msgObj.channel = channel.id;
			delete msgObj.channel_name;
		}
		
		// targetIDの削除
		if(msgObj.bot_id){
			delete msgObj.bot_id;
		}
		if(msgObj.plugin_id){
			delete msgObj.plugin_id;
		}
		
		return msgObj;
	}
	
	async formatText(msgObj){
		let text = msgObj.text || "";
		const rawMsgObj = Object.assign({},msgObj);
		
		// リプライ先の付与
		if(rawMsgObj.reply_to_name){
			text = `@${rawMsgObj.reply_to_name} ` + text;
			delete msgObj.reply_to_name;
		}
		else if(rawMsgObj.reply_to){
			const usersList = (await this.slackBot.getUsers()).members;
			const reply_to  = usersList.find(obj=>obj.id===rawMsgObj.reply_to);
			
			rawMsgObj.reply_to_name = reply_to.name;
			
			if(reply_to){
				text = `@${reply_to.name} ` + text;
				delete msgObj.reply_to;
			}
		}
		
		// Pingテキストの付与
		if(rawMsgObj.use_ping && rawMsgObj.ts){
			text += ` (${(((new DateWithOffset(540)) - rawMsgObj.ts*1000)/1000).toFixed(3)}sec)`;
			delete msgObj.use_ping;
		}
		
		// 置換が必要なテキストがあったら置換する
		text = text.replace(/\$([a-zA-Z0-9_]+)/g,($0,$1)=>{
			if(typeof(rawMsgObj[$1]) !== "undefined") return rawMsgObj[$1];
			return $0;
		});
		
		return text;
	}
}

export default PostMessageFormatter;
