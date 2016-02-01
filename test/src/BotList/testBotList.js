import should from "should";
import glob from "glob";
import BotInfo from "../../../release/List/BotInfo.js";
import IntervalActionList from "../../../release/List/IntervalActionList.js";
import CommandActionList from "../../../release/List/CommandActionList.js";
import WordActionList from "../../../release/List/WordActionList.js";

function tester(){
	describe(`BotList`,_=>{
		// globで全部取ってくる
		const pathList = glob.sync("../../../release/BotList/*.js",{cwd:__dirname,});
		describe(`モジュールチェック`,_=>{
			for(const path of pathList){
				it(`存在チェック: ${path}`,()=>{
					// †import構文が動的ローダに対応しないのでrequire闇†
					require(path);
				});
			}
		});
		describe(`プロパティチェック`,_=>{
			for(const path of pathList){
				const bot = new BotInfo(require(path));
				describe(`型チェック: ${path}`,_=>{
					for(const prop of ["id","messageId","name","iconUrl"]){
						it(`typeof(bot.${prop}) === "string"`,()=>{
							(typeof(bot[prop])).should.be.exactly("string");
						});
					}
					for(const prop of ["disabled"]){
						it(`typeof(bot.${prop}) === "boolean"`,()=>{
							(typeof(bot[prop])).should.be.exactly("boolean");
						});
					}
					for(const prop of ["messages"]){
						it(`typeof(bot.${prop}) === "object"`,()=>{
							(typeof(bot[prop])).should.be.exactly("object");
						});
						for(const key of Object.keys(bot[prop])){
							it(`bot.${prop}[${key}] instanceof Array`,()=>{
								(bot[prop][key] instanceof Array).should.be.exactly(true);
							});
							for(const [index,text] of bot[prop][key].entries()){
								it(`typeof(bot.${prop}[${key}][${index}]) === "string"`,()=>{
									(typeof(text)).should.be.exactly("string");
								});
							}
						}
					}
					for(const prop of ["intervalActionList"]){
						it(`bot.${prop} instanceof IntervalActionList`,()=>{
							(bot[prop] instanceof IntervalActionList).should.be.exactly(true);
						});
						for(const [index,obj] of bot[prop].entries()){
							it(`typeof(bot.${prop}[${index}]) === "object"`,()=>{
								(typeof(obj)).should.be.exactly("object");
							});
							
							["priority"].forEach(key=>{
								const func = obj[key];
								it(`(typeof(bot.${prop}[${index}].${key}) === "boolean") || (typeof(bot.${prop}[${index}].${key}) === "null")`,()=>{
									(!!((typeof(func)==="boolean")||(func===null))).should.be.exactly(true);
								});
							});
						
							["check","next","message"].forEach(key=>{
								const func = obj[key];
								it(`typeof(bot.${prop}[${index}].${key}) === "function"`,()=>{
									(typeof(func)).should.be.exactly("function");
								});
							});
						}
					}
					for(const prop of ["commandActionList"]){
						it(`bot.${prop} instanceof CommandActionList`,()=>{
							(bot[prop] instanceof CommandActionList).should.be.exactly(true);
						});
						for(const [index,obj] of bot[prop].entries()){
							it(`typeof(bot.${prop}[${index}]) === "object"`,()=>{
								(typeof(obj)).should.be.exactly("object");
							});
							
							["priority"].forEach(key=>{
								const func = obj[key];
								it(`(typeof(bot.${prop}[${index}].${key}) === "boolean") || (typeof(bot.${prop}[${index}].${key}) === "null")`,()=>{
									(!!((typeof(func)==="boolean")||(func===null))).should.be.exactly(true);
								});
							});
							
							["check","message"].forEach(key=>{
								const func = obj[key];
								it(`typeof(bot.${prop}[${index}].${key}) === "function"`,()=>{
									(typeof(func)).should.be.exactly("function");
								});
							});
						}
					}
					for(const prop of ["wordActionList"]){
						it(`bot.${prop} instanceof WordActionList`,()=>{
							(bot[prop] instanceof WordActionList).should.be.exactly(true);
						});
						for(const [index,obj] of bot[prop].entries()){
							it(`typeof(bot.${prop}[${index}]) === "object"`,()=>{
								(typeof(obj)).should.be.exactly("object");
							});
							
							["priority"].forEach(key=>{
								const func = obj[key];
								it(`(typeof(bot.${prop}[${index}].${key}) === "boolean") || (typeof(bot.${prop}[${index}].${key}) === "null")`,()=>{
									(!!((typeof(func)==="boolean")||(func===null))).should.be.exactly(true);
								});
							});
							
							["check","message"].forEach(key=>{
								const func = obj[key];
								it(`typeof(bot.${prop}[${index}].${key}) === "function"`,()=>{
									(typeof(func)).should.be.exactly("function");
								});
							});
						}
					}
				});
			}
		});
	});
}

export default tester;