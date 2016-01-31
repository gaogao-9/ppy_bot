class PostMessageFormatter{
	constructor(slackBot){
		this._slackBot = slackBot;
	}
	
	get slackBot(){
		return this._slackBot;
	}
	
	async format(messageObject){
		// オブジェクトの整形を行う
		messageObject      = await this.formatObject(messageObject);
		messageObject.text = await this.formatText(messageObject);
		
		// チャンネルIDとユーザ名を抽出する
		const {channelId,username} = messageObject;
		
		// 投稿結果オブジェクトを返す
		return messageObject;
	}
	
	async formatObject(messageObject){
		// チャンネルIDの取得
		if(messageObject.channel_name){
			const channel = await this.slackBot.getChannel(messageObject.channel_name);
			messageObject.channel = channel.id;
			delete messageObject.channel_name;
		}
		
		// targetIDの削除
		if(messageObject.bot_id){
			delete messageObject.bot_id;
		}
		if(messageObject.plugin_id){
			delete messageObject.plugin_id;
		}
		
		return messageObject;
	}
	
	async formatText(messageObject){
		let text = messageObject.text || "";
		const rawMsgObj = Object.assign({},messageObject);
		
		// リプライ先の付与
		if(rawMsgObj.reply_to_name){
			text = `@${rawMsgObj.reply_to_name} ` + text;
			delete messageObject.reply_to_name;
		}
		else if(rawMsgObj.reply_to){
			const usersList = (await this.slackBot.getUsers()).members;
			const reply_to  = usersList.find(obj=>obj.id===rawMsgObj.reply_to);
			
			console.log(usersList);
			
			rawMsgObj.reply_to_name = reply_to.name;
			
			if(reply_to){
				text = `@${reply_to.name} ` + text;
				delete messageObject.reply_to;
			}
		}
		
		// Pingテキストの付与
		if(rawMsgObj.use_ping && rawMsgObj.ts){
			text += ` (${((Date.now()-rawMsgObj.ts*1000)/1000).toFixed(3)}sec)`;
			delete messageObject.use_ping;
		}
		
		console.log(text);
		
		// 置換が必要なテキストがあったら置換する
		text = text.replace(/\$([a-zA-Z0-9_]+)/g,($0,$1)=>{
			if(typeof(rawMsgObj[$1]) !== "undefined") return rawMsgObj[$1];
			return $0;
		});
		
		console.log(text);
		
		return text;
	}
}

export default PostMessageFormatter;
