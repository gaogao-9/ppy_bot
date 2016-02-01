import should from "should";
import glob from "glob";
import BotInfo from "../../../release/List/BotInfo.js";

function tester(){
	describe(`BotInfo`,_=>{
		describe(`存在チェック`,_=>{
			it(`typeof(BotInfo) === "function"`,()=>{
				(typeof(BotInfo)).should.be.exactly("function");
			});
			["id","name","iconUrl","disabled","messages","priority","intervalActionList","commandActionList","wordActionList","createSequentialMessageObject","createRandomMessageObject","createMessageObject","_getRandomText"].forEach(name=>{
				it(`prototype.${name}`,()=>{
					BotInfo.prototype.should.have.property(name);
				});
			});
		});
		describe(`インスタンスチェック`,_=>{
			const param = {
				id: "gao_bot",
				name: "がおぼっと",
				iconUrl: "http://gaogao.com/gao.png",
				disabled: true,
				messages: {
					gao: [
						"がお",
						"さん",
						"じゅうはっさい",
					],
					emptyTest: [
					],
				},
				intervalActionList: [
					{
						check(){},
						next(){},
						message(){},
					},
				],
				commandActionList: [
					{
						check(){},
						message(){},
					},
				],
				wordActionList: [],
			};
			let bot = null;
			it(`インスタンスの生成`,()=>{
				bot = new BotInfo(param);
			});
		/*
			it(`インスタンスの登録`,()=>{
				BotInfo.register(bot);
			});
			it(`インスタンスの登録反映チェック`,()=>{
				BotInfo.list.length.should.be.exactly(1);
			});
			it(`インスタンスの登録解除`,()=>{
				BotInfo.unregister(bot);
			});
			it(`インスタンスの登録反映チェック`,()=>{
				BotInfo.list.length.should.be.exactly(0);
			});
		*/
		});
	});
}

export default tester;