import PriorityListItem from "./PriorityListItem.js";

class PriorityList{
	constructor(){
		this._list = [];
	}
	
	get list(){
		return this._list;
	}
	
	set length(value){
		this._list.length = value;
	}
	get length(){
		return this._list.length;
	}
	
	register(item){
		if(!(item instanceof PriorityListItem)){
			throw new TypeError("PriorityListItem型のみが登録できます。");
		}
		const list = this.list;
		
		// 優先度が指定して無ければ末尾に突っ込む
		if(item.priority === null){
			list.push(item);
			return;
		}
		
		// null以外の優先度付きアイテムの長さを取得する
		let listLength = list.length;
		while(listLength){
			if(list[listLength-1].priority !== null) break;
			--listLength;
		}
		
		// 何も入って無ければ先頭に突っ込む
		if(listLength === 0){
			list.unshift(item);
			return;
		}
		
		// 要素があれば先頭から検索して突っ込む
		for(let i=0;i<listLength;++i){
			if(list[i].priority>item.priority){
				list.splice(i,0,item);
				return;
			}
		}
		
		// どこにも掛からなかったらnullの直前に入れる
		list.splice(listLength,0,item);
	}
	
	unregister(item){
		for(const [index,value] of this.list.entries()){
			if(value !== item) continue;
			this.list.splice(index,1);
			break;
		}
	}
	
	static from(iterable){
		const list = new PriorityList();
		for(let item of iterable){
			if(item instanceof PriorityListItem){
				list.register(item);
			}
			else{
				list.register(new PriorityListItem(item));
			}
		}
		return list;
	}
	
	*entries(){
		let i=0;
		for(let value of this.list){
			yield [i++,value];
		}
	}
	
	[Symbol.iterator](){
		return this.list[Symbol.iterator]();
	}
}

export default PriorityList;
