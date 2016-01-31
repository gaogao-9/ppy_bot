import should from "should";
import HtmlSpecialChars from "../../../release/util/HtmlSpecialChars.js";

function tester(){
	describe(`HtmlSpecialChars`,_=>{
		describe(`存在チェック`,_=>{
			it(`typeof(HtmlSpecialChars) === "function"`,()=>{
				(typeof(HtmlSpecialChars)).should.be.exactly("function");
			});
			["escapeList","unescapeList","escapeRegExp","unescapeRegExp","escape","unescape"].forEach(name=>{
				it(`prototype.${name}`,()=>{
					HtmlSpecialChars.prototype.should.have.property(name);
				});
			});
			[].forEach(name=>{
				it(`HtmlSpecialChars.${name}`,()=>{
					HtmlSpecialChars.should.have.property(name);
				});
			});
		});
		describe(`インスタンスチェック`,_=>{
			const param = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;'
			};
			let h = null;
			it(`インスタンスの生成`,()=>{
				h = new HtmlSpecialChars(param);
			});
			it(`エスケープ処理`,()=>{
				const escapedStr = h.escape(`<script>alert("XSS");</script>`);
				escapedStr.should.be.exactly(`&lt;script&gt;alert("XSS");&lt;/script&gt;`);
			});
			it(`アンエスケープ処理`,()=>{
				const unescapedStr = h.unescape(`&lt;script&gt;alert("XSS");&lt;/script&gt;`);
				unescapedStr.should.be.exactly(`<script>alert("XSS");</script>`);
			});
		});
	});
}

export default tester;