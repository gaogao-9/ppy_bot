# ppy_bot
っぴーのつどいから生まれたslack向けbotフレームワーク

# 雑な使い方説明

  1. git cloneしてローカルに落とす
  2. npm installして必要なモジュールの類を手に入れてくる
  3. ルートディレクトリ(package.jsonとかが置いてあるディレクトリ)に「slackToken.js」を用意する（後述）
  4. src/BotList内のaoba_suzukaze.jsを参考に、そのディレクトリ内にbot定義ファイルを用意する（後述）
  5. src/Plugin/Paiza/*.jsを参考に、そのディレクトリ内にプラグイン定義ファイルを用意する（後述）
  6. test/src/Plugin/Paiza/testPaizaAPI.jsを参考に、プラグイン用のテストファイルを用意する（後述）
  7. npm testして動作確認する
  8. node release/index.jsを実行すると、botが起動します。
   
# (後述)の説明まとめ

## slackToken.jsを用意する
Slack内で何らかのチームに参加した状態で https://hogeppy.slack.com/apps/manage/A0F7YS25R-bots にアクセスすると、トークンを生成できる項目があります。

「Add Configuration」のボタンを押して、情報を入力。トークンを生成後、そのトークンをコピペしておきます

次に、作っておいたslackToken.jsのファイルを以下のフォーマットでトークンを記述して保存します。

```js:slackToken.js
export default "XXXX-XXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX";
```

## src/BotListディレクトリにbot定義ファイルを用意する
まず、aoba_suzukaze.jsをコピーするなどしてバックアップとっておきます(保険)

次に、ファイル名を自分の好きな名前に変更します。オススメの命名はbotのidと同一にしておくことです。

次に、変数botの中につらつらと記述しているプロパティ各種を、自分好みにレイアウトします。
各プロパティの説明は以下のようになります。

| プロパティ | 型 | 必須条件 | 説明 |
|------------|----|----------|------|
|id|String|必須|botのidを英数で指定します。「@○○」の形で反応できる名称です。|
|name|String|必須|botのニックネームを指定します。TL上で表示される名前の一部に使用されます。|
|disabled|Boolean|任意(初期値false)|このBotを一時的に実行しないようにするかどうかの設定です。スクリプト動作中もプラグイン等で外部からいつでも変更可能です。|
|priority|NullableInteger|任意(初期値null)|Bot毎の実行順番を制御します。数字が大きい方が先に実行されます。負数も指定可能です。nullを指定すると最も遅く実行されます。|
|messages|Object|必須|発言のリストを定義するためのコンテナです(後述)|
|intervalActionList|Array|必須|指定した時間での実行や、一定間隔での実行のためのActionを定義するリストです(後述)|
|commandActionList|Array|必須|少なくとも1つの自分宛てのリプライ(@○○の形のやつ)が来た時のためのActionを定義するリストです(後述)|
|wordActionList|Array|必須|何らかの発言が行われる際に毎回呼ばれるActionを定義するリストです(後述)|

### messagesについて
キーの命名は自由に行うことが出来ます。また、キーの数に制限はありません。
サンプルでは "reply" と "ping" という名前を使用していますが、 "gao" でも "hocho" でも "しゃけのせーし" でも構いません。

バリューにはString-Arrayを指定します。**必ず**文字列型配列でなければなりません。

適当なキーで命名したリストを、「createSequentialMessageObject」や「createRandomMessageObject」の第一引数で指定して使用します。

createSequentialなんとかは、実行するたびに指定したリストのテキストを**先頭から順番に**返していく関数です。
createRandomなんとかは、実行するたびに指定したリストのテキストを**ランダムに**返していく関数です。

## ○○ActionListについて
BotInfo型もしくはPluginInfo型のオブジェクトについています。
簡単にいえば、botを書くときもpluginを書くときもインターフェースが同様なので、ここでまとめて記述します。

## intervalActionListについて
中身はObject-Array-Objectという構成です。一番内側のObjectについてだけ説明します。

一番内側のObjectでは、「check」「next」「message」が必須プロパティとなっています。「priority」が任意プロパティとなっています。
Node.jsを立ち上げた後のタイミングや、何らかの原因で通信が遮断され再接続された場合のように、Streamingに初めて接続したタイミングで、「check」に指定した関数が走ります。

「check」に指定した関数はBooleanを返すように設計してください。
「check」の戻り値がtrueであれば「message」を実行して、返されるMessageObjectを発言としてSlackに投稿します。

「check」の戻り値に関わらず、↑の実行直後に「next」が実行されます。
「next」では、「message」を再び呼び出すタイミングを「Dateオブジェクト」で返してください。
ただし、Node.jsが走るサーバーは内部時間がGMTなことが多く、日本人の我々にはつらいです。
その際に、「[DateWithOffset](https://www.npmjs.com/package/date-with-offset)」モジュールを利用すると、時間計算を日本時間で行えるため楽になります。

また、「check」「next」「message」関数には、第一引数に各種情報が入ったObjectが与えられます。

| プロパティ | 型 | 説明 |
|------------|----|------|
|this|  |BotInfo(botオブジェクトから生成されたクラス)が入っています。Pluginの場合は代わりにPluginInfoが入っています。|
|actions|Object|「check」「next」「message」の関数自身が入っているオブジェクトです。|
|actionDate|DateWithOffset|この関数が呼ばれたタイミングの日本時間基準のDateオブジェクトが与えられます。|

## commandActionListについて
インターフェースはほぼintervalActionListと一緒なので↑を参考にしていただければと思います。注意すべきは「next」関数は存在しません。

また、第一引数に与えられるObjectの種類が異なります。

| プロパティ | 型 | 説明 |
|------------|----|------|
|this|  |BotInfo(botオブジェクトから生成されたクラス)が入っています。Pluginの場合は代わりにPluginInfoが入っています。|
|actions|Object|「check」「message」の関数自身が入っているオブジェクトです。|
|param|Object|streamingのmessageイベントの情報がほぼそのまま(後述)入っています。詳しくは[Slack公式サイトのMessageイベントページ](https://api.slack.com/events/message)で。|
|msgObjList|ObjectArray|この関数が呼ばれるまでの間に他のcommandAction/wordActionによって発言することが確実になっているMessageObjectの一覧が与えられます。同一アカウントによる多重投稿防止に役立てください。|
|replyList|StringArray|メッセージ中に含まれているリプライのname情報([a-z0-9_]+の方)一覧が重複を許して入っています。|
|botList|BotInfoArray|登録されている全Botがリストで格納されています。|
|pluginList|PluginInfoArray|登録されている全Botがリストで格納されています。|
|targetBot|BotInfo|(PluginInfo限定)プラグイン呼び出し元となるbotのオブジェクトが入っています。|

### paramについて
注意すべきは、paramの「text」は、いつかのリプライシンボル(@○○形式のやつ)や、チャンネルシンボル(#○○形式のやつ)等を取り除いたテキストが入っています。
これらシンボルを取り除く前のtextが欲しい場合は「param.rawText」でアクセスしてください。

## wordActionListについて
インターフェースはcommonActionListと全く同じです。第一引数に与えられるObjectの種類も一緒です。

何らかの発言が飛ぶたびに実行されるため、制約が緩いです。エゴサしてリプを飛ばす等のことがしたい場合はこちらに記述してください。

# Plugin作成について
Botの作成方法とほとんど一緒ですが、Bot作成時にはあったmessages系が削除されているなど、オブジェクトとしては若干軽量になっています。
Pluginの読み込みは「src/Plugin/*/index.js」を読み込みます。index.js以外のファイルは読み込まないので自由にライブラリを持ち込んでください。

実行される流れは、botのcommandAction or wordActionが実行された時に、同一種類のPluginイベントが続けざまに発火する流れになっています。

例えば、私が「@bot1 @bot2 @bot3すき」と、3体のbotに~~浮気~~愛のリプを飛ばした際に、commandActionが「@bot1で2個」「@bot2で0個」「@bot3で1個」発火した場合は、PluginはcommandActionを「targetBotが@bot1で2回」「targetBotが@bot3で1回」の合計3回発火します。

## テスト記述を用意する
BotListに関しては可能な範囲で動的にテストしていますが、Pluginはなかなか個別でのテストが難しいのが現状です。
「test/src/Plugin/Paiza/testPaizaAPI.js」のように、専用のテスト記述を追加して書くことをオススメします。「mocha & should」の環境で記述できます。
