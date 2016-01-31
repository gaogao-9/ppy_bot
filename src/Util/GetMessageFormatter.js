class GetMessageFormatter{
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
		
		return messageObject;
	}
	
	async formatText(messageObject){
		let text = messageObject.text || "";
		
		// リプライ先の付与
		if(messageObject.reply_to_name){
			text = `@${messageObject.reply_to_name} ` + text;
			delete messageObject.reply_to_name;
		}
		else if(messageObject.reply_to){
			const reply_to = await this.slackBot.getUser(messageObject.reply_to);
			text = `@${reply_to.name} ` + text;
			delete messageObject.reply_to;
		}
		
		// Pingテキストの付与
		if(messageObject.use_ping){
			text += ` (${((Date.now()-timestamp*1000)/1000).toFixed(3)}sec)`;
			delete messageObject.use_ping;
		}
		return text;
	}
}

export default GetMessageFormatter;
