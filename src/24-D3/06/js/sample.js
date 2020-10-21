var svgWidth = 640;	// SVG要素の横幅
var svgHeight = 640;	// SVG要素の高さ
var path = d3.geo.path()
	.projection(d3.geo.mercator()	// 投影方法を指定
		.center([137.571, 36.0654])	// 表示する経度と緯度を指定
		.scale(15000)	// スケールを指定
		.translate([200, 320])	// 表示位置を調整
	)
// 長野県のデータを読み込む
d3.json("data/nagano.json", function(error, pref) {
	d3.select("#myGraph")
		.selectAll("path")	// path要素を指定
		.data(pref.features)	// データをセット
		.enter()
		.append("path")	// pathを追加
    .attr("d", path)	// 地形のデータを設定
    .style("fill",function(d,i){
      if (d.properties.N03_004.lastIndexOf("市")>-1){
        return "#f99"
      }
      if (d.properties.N03_004.lastIndexOf("町") > -1) {
        return "#079"
      }
      if (d.properties.N03_004.lastIndexOf("村") > -1) {
        return "#ff8"
      }
      return "white";
    })
})
