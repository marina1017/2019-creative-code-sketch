// ボタンがクリックされたら該当するCSVファイルを読み込む
d3.selectAll("button").on("click", function () {
  var csvFile = this.getAttribute("data-src");	// data-src属性を読み出す(つまりCSVファイル名)
  // CSVファイルを読み込みグラフを表示
  d3.csv(csvFile, function (error, data) {
    var dataSet = [];	// データを格納する配列を用意する
    for (var i = 0; i < data.length; i++) {	// データの行数分だけ繰り返す
      dataSet.push(data[i]["商品A"]);	// 商品Aのラベルのデータだけ抽出する
    }
    // グラフを描画
    barElements = d3.select("#myGraph")
      .selectAll("rect")
      .data(dataSet)

    // データの追加が行われる場合
    barElements.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", function (d, i) {
        return d;
      })
      .attr("height", 20)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 25
      })

    //データの更新が行われる場合
    barElements
      .attr("width", function (d, i) {
        return d;
      })

    //データの削除が行われる場合
    barElements
      .exit()
      .remove()
  });
})