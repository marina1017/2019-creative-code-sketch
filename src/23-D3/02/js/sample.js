var svgHeight = 240;	// SVG要素の高さ
var offsetX = 30;
var offsetY = 10;
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
    return i * 25 + offsetX;		// X座標を出現順番×25にする
  })
  .attr("y", function (d, i) {	// Y座標を指定する
    return svgHeight - d - offsetY;	// Y座標を計算
  })

barElements.enter()
  .append("text")
  .attr("class", "barNum")
  .attr("x", function (d, i) {
    return i * 25 + 10 + offsetX;
  })
  .attr("y", svgHeight - 5 - offsetY)
  .text(function (d, i) {
    return d
  })

//メモリを表示するためにスケールを設定
var yScale = d3.scale.linear()
  //元のデータ範囲
  .domain([0, 300])
  //実際の出呂奥サイズ
  .range([300, 0])

// メモリを設定し表示する
d3.select("#myGraph").append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + offsetX + "," + ((svgHeight - 300) - offsetY) + ")")
  .call(
    d3.svg.axis()
      .scale(yScale)
      .orient("left")
  )

// 横方向の線を表示する
d3.select("#myGraph")
  .append("rect")
  .attr("class", "axis_x")
  .attr("width", 320)
  .attr("height", 1)
  .attr("transform", "translate(" + offsetY + "," + (svgHeight - offsetY) + ")")

// 棒のラベルを表示する
barElements.enter()
  .append("text")
  .attr("class", "barName")
  .attr("x", function (d, i) {
    return i * 25 + 10 + offsetX;
  })
  .attr("y", svgHeight - offsetY + 15)
  .text(function (d, i) {
    return ["A", "B", "C", "D", "E"][i];
  })