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
https://marina1017.github.io/2019-creative-code-sketch/src/03-particle/

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
### コンセプト
線がシュッと消えていくやつをつくりたかった
parcelとようやく仲良くなった(みなさまありがとう)

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

