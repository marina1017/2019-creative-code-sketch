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