// CSVファイルを読み込む
d3.csv("mydata.csv", function (error, data) {
  var dataSet = [];	// データを格納する配列を用意する
  for (var i = 0; i < data.length; i++) {	// データの行数分だけ繰り返す
    dataSet.push(data[i]["商品A"]);	// 商品Aのラベルのデータだけ抽出する
  }
  // 要素とデータが対応した状態で設定される
  d3.select("#myGraph")
    .selectAll("rect")	// rect要素を指定
    .data(dataSet)	// データを要素に連結
    .enter()	// データ数だけ繰り返す
    .append("rect")	// データの数だけrect要素が追加される
    .
})