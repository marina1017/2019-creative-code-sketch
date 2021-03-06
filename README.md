# 環境構築
## 必要なもの
yarn

## コマンド
### 依存しているライブラリのインストール
yarn

### ビルドするとき
package.jsonに設定しているように、それぞれの作品ごとにビルドできるようにしてある。
#### デバッグ時

`yarn d08`
のようにコマンドを叩くと、Parcelがいい感じにローカルサーバーをたてて確認できる。

#### 作り終わったら
`yarn 08`
のようにコマンドを叩くと,sketches配下に出力されるように設定してある。

#### 作品群
github pagesで公開している。
`https://marina1017.github.io/2019-creative-code-sketch/sketches/03-particle/`
のようにそれぞれのディレクトリ配下においている。


# 作ったもの

## 第二回 色

### コンセプト
光の三原色と同様に、WebGLの世界でも三色が重なると本当に白になるのか調べてみた

### 作品
#### CodePen
https://codepen.io/marina1017/pen/abbEPqj

#### github-page
https://marina1017.github.io/2019-creative-code-sketch/src/02-color/

### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/02-color

## 第三回 パーティクル
### コンセプト
dat.GUIをつかって制御できるパーティクルを目指した。
マウスで空間をぐるぐる回せるようにした
geometryの「geometry.verticesNeedUpdate」はレンダリング後に毎回falseになることに気が付かず、geometryの位置をうごかすことにやたら苦労した。
https://stackoverflow.com/questions/24531109/three-js-vertices-does-not-update

### 使用技術
WebGL(Treee.js)
dat.GUI

## 作品
#### github-page
https://marina1017.github.io/2019-creative-code-sketch/sketches/03-particle/

### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/03-particle

## わからなかったこと
あいかわらず
https://marina1017.github.io/2019-creative-code-sketch/sketches/03-particle/
だとよみこめない。

読み込んでいるindex.htmlでよみこんでいるファイル名は正しそうだが・・

### エラーメッセージ

```
Uncaught ReferenceError: THREE is not defined
    at Object.parcelRequire.js/OrbitControls.js (OrbitControls.86a60464.js:127)
    at newRequire (OrbitControls.86a60464.js:47)
    at OrbitControls.86a60464.js:81
    at OrbitControls.86a60464.js:120
```

## 第４回　線
### ビルドの仕方
開発環境の場合

```
yarn d04
```

`https://marina1017.github.io/2019-creative-code-sketch/sketches/04-line/`にまとめる場合

```
yarn 04
```
### コンセプト
線がシュッと消えていくやつをつくりたかった
parcelとようやく仲良くなった(みなさまありがとう)

### 使った技術
parcel(ようやく理想的な姿に・・・・・)
yarn(パッケージ管理がようやくいい感じに・・・・・)
three.js
orbitcontrols.js
dat.gui.js
three.meshline.js < NEW!


### 作品
https://marina1017.github.io/2019-creative-code-sketch/sketches/04-line/

### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/04-line

### 躓いたところ・わからなかったところ
#### three.meshlineのimportにやたらめったらはまった 
下記のPRがマージされるまではaddAttribute()を.setAttribute()に変更する必要があることがわかった。
https://github.com/spite/THREE.MeshLine/pull/92/files
今回はnode_moduleの中身を変更することで対応した。もう少し早く気づけばPRチャンスだったなと思った。

#### materialを複数設定する場合、設定できなくて困った
下記のように`materials`を作ってそれぞれの配列に、異なるmaterialを入れようとしたが、なぜか一個だけしか反映されなかった。
本当は一色だけじゃなくて、ランダムにすべての線が異なる感じで出したかったのだができなかった・・・・・

```
var materials = [];
for(var i = 0; i < NUM; i++) {
const material = new MeshLineMaterial({
    transparent: true,
    lineWidth: 0.3,
    color: new THREE.Color('#ff0000'),
    opacity: 0.5,
    //常に行の2倍でなければならない
    dashArray: 4,
    //ゼロからダッシュを開始
    dashOffset: 0, 
    //可視の長さの範囲最小：0.99、最大：0.5
    dashRatio: 0.985, 
  });
  material.transparent = true
  materials[i] = material
}


var lineMesh = new THREE.Mesh( 
      //第1引数は,ジオメトリ
      geometries[i],
      //第2引数は,マテリアル
      materials[i]);
```

## 第5回　動画
### ビルドの仕方
開発環境の場合

```
yarn d05
```

`https://marina1017.github.io/2019-creative-code-sketch/sketches/05-movie/`にまとめる場合

```
yarn 05
```
### コンセプト
360度動画を使ってオブジェクトに貼り付けてぐるぐる回せるようにした
本当はNHKの動画ライブラリがすごいので、その紹介をしたかったのだが、残念ながらNHKの動画ライブラリに360度動画がなかったので「https://360rtc.com/」をつかわせていただいた

### 使った技術
parcel
yarn
three.js
orbitcontrols.js



### 作品
https://marina1017.github.io/2019-creative-code-sketch/sketches/05-movie/

### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/05-movie

### 躓いたところ・わからなかったところ
#### ParcelでjsファイルからTextureを読み込めない問題
一回videoタグで読み込ませて、jsからそのurlを取り出し、Texture画像として取り込む作戦にしたらできた。(もっといい方法がありそう)
CSSで動画を透明にすることで、存在するけど見せないようにした、がほんとにこれでいいのかはよくわからなかった。

```
<video id="video_place" src="test2.mp4" autoplay width="10" height="10"></video>
```

#### 動画がミュートするとなぜかとまる 
video.muted = ture にするとなんかしらないが、動画がとまるので音量を小さくした。ほんとはミュートしたいのに・・・・・
音量を0にすると動画がとまるので0.01とかを設定してみる
(もっといい方法ありそう)

ローカルで音量を0.01にした場合は音量がほぼ聞こえなくなるのに
Parcelでビルド(?)したあとは音量がもとに戻ってしまう・・・・なんでだろう？


## 第6回　動画
Lottieと和解した。動画はLottieの素材動画からお借りしている。

## サンプル
https://marina1017.github.io/2019-creative-code-sketch/src/06-logo/

## コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/06-logo

### うまくいかなかった原因
#### jsonまわり
なんかindex.htmlからjsonを読み込ませようとすると、ブラウザから拒否される
名前は忘れてしまったがクロスサイトスクリプト防止の為？だったかな(忘れてしまった)

parcelでサーバーをたてて確認しようとするも、jsからjsonを読み込むパスの生成がうまく行かずに断念
結局github pagesにpushして確認することにした。

#### CSSまわり
Lottieの扱い方はらくなのだが、CSSがわで指定するdivに画面サイズを指定しなければならないことに気がつくまでに時間がかかってしまった

####  CDNまわり
https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie.js
Lottieの名前がbodymovinなのかLottieなのか、曖昧ですごく困った・・・・


## 第7回　カメラ

### コンセプト
本当は、被写界深度をわかりやすくする作品をつくりたかった。作りたい気持ちはあった・・・・・・
postprocessingという拡張ライブラリ？の公式のexampleのコードが古くて何もわからなくて虚無になった。
ようやくpostprocessingを動かせるコードになったのでとりあえずきらめく回転する立方体ができあがった。
これから研究していきたい

## 作品
https://marina1017.github.io/2019-creative-code-sketch/sketches/07-camera/

## コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/07-camera

## 第８回　フリー
とりあえずBlenderで四角を作ってモデルの読み込みができるかを試した

### 作品
https://marina1017.github.io/2019-creative-code-sketch/sketches/08-free/

### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/08-free/

## コメント
BlenderのUIが変わりすぎて浦島太郎状態になった(いつのまにかオシャンになってしまっていた・・・)。
ショートカットもすべて頭から吹き飛んでしまっているので思い出していきたい。
Parcelでjsから画像とかモデルを読み込めない問題で手詰まりをよくする(クロスドメイン制約も・・・)。しょうがないので確認するたびにgithubで確認している
正直だるい。なんとかならないものでしょうか。みなさんどうしてるいんですか？
だれか、parcelでビルド(？)したときに、モデルに勝手につけられる名前を知る方法を教えてほしいです・・・・・・・・・・
いまのところ、画像や動画の場合はhtmlで事前に読み込ませておいて、jsで割り当てられた名前を取得してパスを通しているが、daeやjsonファイルの場合は本当にどうすればいいのかわからなかった。

## 第９回 ３Dモデル
### コード
https://github.com/marina1017/2019-creative-code-sketch/tree/master/src/09-3Dmodel

### 仕上がり
https://marina1017.github.io/2019-creative-code-sketch/src/09-3Dmodel/
https://marina1017.github.io/2019-creative-code-sketch/src/09-MMD/

### 困ったこと
exampleが古いのと、exampleにのってる必要なjsファイルをのっけてもビルドできないなどいろいろ問題があって苦戦した。
とてもつらい・・・・
https://www.autumn-color.com/archives/2048


ようやく動くサンプルをみつけられたがprcelでビルドすると動かせない・・・・
https://www.autumn-color.com/archives/2048

#### エラー内容
Uncaught ReferenceError: regeneratorRuntime is not defined
Async/Await構文がparcelでうまいこと変換できないぽい(多分・・・・)


#### 解決方法?
.babelrcを設定すればいいらしいので.babelrcをpacakge.jsonと同じ階層にいれてみたが、かわらない
だれか解決方法を知っている人ぜひおしえてほしい
というかbabelってなに・・・・という感じ
https://takamints.hatenablog.jp/entry/not-to-convert-async-function-with-parcel

しょうがないのでlive-serverをつかって開発をすすめた

```
live-server ./
```

## SwiftでARKit
iOS13にSceneDelegate.swiftが存在していて対応方法探すのにじかんかかった

https://qiita.com/edasan/items/68cbe9ab63d48ee71594

### とりあえずモデルを出す

### 平面検出→平面にモデルを乗せる