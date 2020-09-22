var dataSet = []

d3.csv("mydata.csv", function (error, data) {
  var dataSet = [];
  for (var i = 0; i < data.length; i++) {
    dataSet.push(data[i].item1);
  }
  console.log(dataSet)

  d3.select("#myGraph")
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", function (d, i) {
      return i * 25;
    })
    .on("click", function () {
      d3.select(this)
        .style("fill", "cyan")
    })
    .attr("height", "20px")
    .attr("width", "0px")
    .transition()
    .delay(function (d, i) {
      return i * 500;
    })
    .duration(2500)
    .attr("width", function (d, i) {
      return d + "px"
    })


  // メモリを表示するためにリニアスケールを設定
  var xScale = d3.scale.linear()
    // 元のデータ範囲
    .domain([0, 300])
    // 表示される範囲
    .range([0, 300])

  d3.select("#myGraph")
    // グループ化する
    .append("g")
    // スタイルシートクラスを設定
    .attr("class", "axis")
    .attr("transform", "translate(10," + ((1 + dataSet.length) * 20 + 5) + ")")
    // call()でメモリを表示する関数を呼び出す
    .call(d3.svg.axis()
      // スケールを適用する
      .scale(xScale)
      // メモリの表示位置を下側に指定
      .orient("bottom")
    )
  d3.select("#updateButton").on("click", function () {
    for (var i = 0; i < dataSet.length; i++) {
      dataSet[i] = Math.floor(Math.random() * 320);	// 0〜320未満の値を生成
    }
    d3.select("#myGraph")	// SVG要素を指定
      .selectAll("rect")	// SVGでの四角形を示す要素を指定
      .data(dataSet)	// データを設定
      .transition()	// 切り替えて表示する
      .attr("width", function (d, i) {	// 横幅を配列の内容に応じて計算
        return d + "px";	// データの値をそのまま横幅とする
      })
  })
});







