var svgWidth = 640;	// SVG要素の横幅
var svgHeight = 640;	// SVG要素の高さ
var degree = 0;	// 回転角度
var earthSize = 280;//地球のサイズ

var earth = d3.geo.orthographic()   // 投影方法をOrthographicに設定
  .translate([svgWidth / 2, svgHeight / 2])	// 画面での表示位置を調整
  .clipAngle(90)	// クリップ範囲を指定
  .scale(earthSize)	// スケールを指定
  .rotate([degree, -25])	// 回転角度を指定

var path = d3.geo.path()	// パスと投影方法を設定
  .projection(earth)

// 地球のデータを読み込む
d3.json("data/world.json", function (error, world) {
  d3.select("#myGraph")
    .append("circle")
    .attr("cx", svgWidth/2)
    .attr("cy", svgHeight/2)
    .attr("r", earthSize)
    .style("fill","blue")
  
  var earthPath = d3.select("#myGraph")
    .selectAll("path")	// path要素を指定
    .data(world.features)	// データをセット
    .enter()
    .append("path")	// pathを追加
    .attr("d", path)	// 地形のデータを設定
    .style("fill", function (d, i) {
      if (d.properties.name == "Antarctica") {	// 南極の場合の処理
        return "#fff";
      }
      if (d.properties.name == "Japan") {	// 日本の場合の処理
        return "red";
      }
      return "#eee";	// 日本以外は灰色に
    })
  // タイマーを使って地球を回転させる
  d3.timer(function () {
    earth.rotate([degree, -25]);	// 角度を設定
    degree = degree + 0.2;	// 2度ずつ動かす
    earthPath.attr("d", path)	// 地形のデータを設定
  });
})
