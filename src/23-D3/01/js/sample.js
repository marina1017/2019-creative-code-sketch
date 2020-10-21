var svgHeight = 240;	// SVG要素の高さ
var barElements;	// 棒グラフの棒の要素を格納する変数
var dataSet = [120, 70, 175, 80, 220];
// グラフを描画
barElements = d3.select("#myGraph")
  .selectAll("rect")	// rect要素を指定
  .data(dataSet)	// データを要素に連結

// データの追加
barElements.enter()	// データ数だけ繰り返す
  .append("rect")	// データの数だけrect要素が追加される
  .attr("class", "bar")	// CSSクラスを指定
  .attr("height", function (d, i) {	// 横幅を指定。2番目のパラメーターに関数を指定
    return d;	// データ値をそのまま縦幅として返す
  })
  .attr("width", 20)	// 横幅を指定
  .attr("x", function (d, i) {
    return i * 25;		// X座標を出現順番×25にする
  })
  .attr("y", function (d, i) {	// Y座標を指定する
    return svgHeight - d;	// Y座標を計算
  })

barElements.enter()
  .append("text")
  .attr("class", "barNum")
  .attr("x", function (d, i) {
    return i * 25 + 10
  })
  .attr("y", svgHeight - 5)
  .text(function (d, i) {
    return d
  })
