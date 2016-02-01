import should from "should";
import PaizaAPI from "../../../../release/Plugin/Paiza/PaizaAPI.js";

function tester(){
	describe(`PaizaAPI`,_=>{
		describe(`存在チェック`,_=>{
			it(`typeof(PaizaAPI) === "function"`,()=>{
				(typeof(PaizaAPI)).should.be.exactly("function");
			});
			["id","language","sourceCode","intervalDelay","timeout","apiKey","send","createRunners","getRunnersStatus","getRunnersDetails"].forEach(name=>{
				it(`prototype.${name}`,()=>{
					PaizaAPI.prototype.should.have.property(name);
				});
			});
			[].forEach(name=>{
				it(`PaizaAPI.${name}`,()=>{
					PaizaAPI.should.have.property(name);
				});
			});
		});
		
		describe(`アクセスチェック`,_=>{
			it(`javascript: console.log(1)`,callback=>{
				(async _=>{
					const paiza = new PaizaAPI({
						language: "javascript",
						sourceCode: `console.log(1)`,
					});
					const result = await paiza.send();
					(result.stdout).should.be.exactly("1\n");
					callback();
				})().catch(err=>{
					console.log(err);
					(typeof(err)).should.be.exactly("object");
					callback();
				});
			});
			it(`javascript: (()=>{"use strict"; let sum = 0; for(let i=0;i<10;++i) sum+= i; console.log(sum);})();`,callback=>{
				(async _=>{
					const paiza = new PaizaAPI({
						language: "javascript",
						sourceCode: `(()=>{"use strict"; let sum = 0; for(let i=0;i<10;++i) sum+= i; console.log(sum);})();`,
					});
					const result = await paiza.send();
					(result.stdout).should.be.exactly("45\n");
					callback();
				})().catch(err=>{
					console.log(err);
					(typeof(err)).should.be.exactly("object");
					callback();
				});
			});
		});
	});
}

export default tester;