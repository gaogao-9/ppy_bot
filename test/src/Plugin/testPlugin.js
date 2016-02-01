import should from "should";
import glob from "glob";
import PluginInfo from "../../../release/List/PluginInfo.js";
import IntervalActionList from "../../../release/List/IntervalActionList.js";
import CommandActionList from "../../../release/List/CommandActionList.js";
import WordActionList from "../../../release/List/WordActionList.js";

function tester(){
	describe(`BotList`,_=>{
		// globで全部取ってくる
		const pathList = glob.sync("../../../release/Plugin/*/index.js",{cwd:__dirname,});
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
				const plugin = new PluginInfo(require(path));
				
				describe(`型チェック: ${path}`,_=>{
					for(const prop of ["id","messageId","name"]){
						it(`typeof(plugin.${prop}) === "string"`,()=>{
							(typeof(plugin[prop])).should.be.exactly("string");
						});
					}
					for(const prop of ["disabled"]){
						it(`typeof(plugin.${prop}) === "boolean"`,()=>{
							(typeof(plugin[prop])).should.be.exactly("boolean");
						});
					}
					for(const prop of ["intervalActionList"]){
						it(`plugin.${prop} instanceof IntervalActionList`,()=>{
							(plugin[prop] instanceof IntervalActionList).should.be.exactly(true);
						});
						for(const [index,obj] of plugin[prop].entries()){
							it(`typeof(plugin.${prop}[${index}]) === "object"`,()=>{
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
								it(`typeof(plugin.${prop}[${index}].${key}) === "function"`,()=>{
									(typeof(func)).should.be.exactly("function");
								});
							});
						}
					}
					for(const prop of ["commandActionList"]){
						it(`plugin.${prop} instanceof CommandActionList`,()=>{
							(plugin[prop] instanceof CommandActionList).should.be.exactly(true);
						});
						for(const [index,obj] of plugin[prop].entries()){
							it(`typeof(plugin.${prop}[${index}]) === "object"`,()=>{
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
								it(`typeof(plugin.${prop}[${index}].${key}) === "function"`,()=>{
									(typeof(func)).should.be.exactly("function");
								});
							});
						}
					}
					for(const prop of ["wordActionList"]){
						it(`plugin.${prop} instanceof WordActionList`,()=>{
							(plugin[prop] instanceof WordActionList).should.be.exactly(true);
						});
						for(const [index,obj] of plugin[prop].entries()){
							it(`typeof(plugin.${prop}[${index}]) === "object"`,()=>{
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
								it(`typeof(plugin.${prop}[${index}].${key}) === "function"`,()=>{
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