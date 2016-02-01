# ppy_bot
っぴーのつどいから生まれたslack向けフレームワーク

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
Slack内で何らかのチームに参加した状態で https://api.slack.com/web にアクセスすると、ページ下部にトークンを生成できる項目があります。

「Create token」のボタンを押して、トークンを生成後、そのトークンをコピペしておきます

次に、作っておいたslackToken.jsのファイルを以下のフォーマットでトークンを記述して保存します。

```js:slackToken.js
export default "XXXX-XXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX";
```

## src/BotListディレクトリにbot定義ファイルを用意する
まず、aoba_suzukaze.jsをコピーするなどしてバックアップとっておきます(保険)

次に、変数botの中につらつらと記述しているプロパティ各種を、自分好みにレイアウトします。
各プロパティの説明は以下のようになります。

| プロパティ | 型 | 必須条件 | 説明 |
|------------|----|----------|------|
|id|String|必須|botのidを英数で指定します。「@○○」の形で反応できる名称です。|
|name|String|必須|botのニックネームを指定します。TL上で表示される名前の一部に使用されます。|
|disabled|Boolean|任意(初期値false)|このBotを一時的に実行しないようにするかどうかの設定です。スクリプト動作中もプラグイン等で外部からいつでも変更可能です。|
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

