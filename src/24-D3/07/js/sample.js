//フォースレイアウトのデータセット
var dataSet = {
  nodes: [
    { name: "Apple" },
    { name: "Google" },
    { name: "Amazon" },
    { name: "Microsoft" },
  ],
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 0 },
  ]
}

//フォースレイアウトの設定
var force = d3.layout.force()
  //ノードを指定
  .nodes(dataSet.nodes)
  //ノードとノードを結ぶリンク線を指定
  .links(dataSet.links)
  //表示領域のサイズを指定
  .size([320, 320])
  //距離を指定
  .linkDistance(90)
  //強さを指定
  .linkStrength(5)
  //重力を指定
  .gravity(0.0001)
  .start()

//　ノードとノードを結ぶ線を描画
var link = d3.select("#myGraph")
  .selectAll("line")
  .data(dataSet.links)
  .enter()
  //線を追加
  .append("line")
  // 先のCSSクラスを指定
  .attr("class","forceLine")

//ノードを示す円を描画
var node = d3.select("#myGraph")
  .selectAll("circle")
  .data(dataSet.nodes)
  .enter()
  // circleを追加
  .append("circle")
  //　半径を設定
  .attr("r", 10)
  //ノードをドラッグ可能にする
  .call(force.drag)

  //再描画時(tickイベント発生時)に線を描画
force.on("tick", function () {
  link
    //ソースとターゲットの要素座標を指定
    .attr("x1", function (d) {
      console.log(d)
      return d.source.x;
    })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; })
  
  node
    //ノードの座標を指定
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
  })