import DateWithOffset from "date-with-offset";

const bot = {
	id:       "aoba_suzukaze",
	name:     "涼風青葉",
	iconUrl:  "https://pbs.twimg.com/media/CZ31QkMWAAIFzAj.png",
	disabled: false,
	messages: {
		reply: [
			"今日も一日頑張るぞいっ",
			"ふふーん♪",
			"ダメだー！",
		],
		ping: [
			"あっ、呼びました？",
			"は、はいっ！",
		],
	},
	intervalActionList: [
		{
			check({
				actionDate:dt,
				actions,
			}){
				// 日曜日10時以降のみ発動
				return (dt.getDay() === 0) && (dt.getHours() >= 10);
			},
			next({
				actionDate:dt,
				actions,
			}){
				const date = dt.getDate();
				
				// 一番近い日曜日10時辺りで。
				if(actions.check()){
					// 発動条件満たしている場合は1週間後にする
					dt.setDate(date+7);
				}
				dt.setHours(10);
				dt.setMinutes(0);
				dt.setSeconds(0);
				dt.setMilliseconds(0);
				
				return dt;
			},
			message({
				actionDate:dt,
				actions,
			}){
				const text = "ふふーん、今日は青葉は休みなのですよー♪";
				return this.createMessageObject(text,{channel_name: "general"});
			},
		},
	],
	commandActionList: [
		// あおばちゃんデフォルト返信
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
				symbolList,
			}){
				// 既に他の発言をしていたら実行しない
				return !msgObjList.some(msgObj => msgObj.bot_id === this.id);
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
				symbolList,
			}){
				return this.createRandomMessageObject("reply",{
						channel,
						reply_to: user,
					});
			},
		},
	],
	wordActionList:[
		// あおばちゃんping
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
				symbolList,
			}){
				return text.match(/(?:(?:すずかぜ|涼風|あおば|青葉)(?:ちゃん|さん)?|(?:(?:ぞい|ゾイ|ｿﾞｲ)[こ子]))[いお]る[か？?]/);
			},
			message({
				actions,
				param:{
					user,
					text,
					channel,
					ts,
				},
				msgObjList,
				symbolList,
			}){
				return this.createRandomMessageObject("ping",{
						ts,
						channel,
						reply_to: user,
						use_ping: true,
					});
			},
		},
		// あおばちゃんっぽい言葉があれば(確率で)反応する(10%)
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
				symbolList,
			}){
				return text.match(/すずかぜ|涼風|あおば|青葉|(?:(?:ぞい|ゾイ|ｿﾞｲ)[こ子])/) && (Math.random()<0.1);
			},
			message({
				actions,
				param,
				param:{
					user,
					text,
					ts,
					channel,
				},
				msgObjList,
				symbolList,
			}){
				return this.createRandomMessageObject("reply",{
						channel,
						reply_to: user,
					});
			},
		},
	],
};

export default bot;
