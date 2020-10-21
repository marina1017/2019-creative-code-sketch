//ツリーレイアウトのデータセット
var dataSet = {
 name:"本社",
 children: [
   {name:"経理部"},
   {name:"業務部"},
   {name:"開発室",
    children:[
      {name: "情報課"},
      {name: "品質課"},
      {name: "開発課",
      children:[
        {name:"ウェブ"},
        {name:"アプリ"},
      ]
    },
  ]},
 ]
}
//　グラフ関係のデータを変数に設定
//svg要素の幅
var svgWidth = 640;
//svg要素の高さ
var svgHeight = 480;
//　ルートノードの左からのオフセット
var offsetLeft = svgWidth/2-100;
//上からのオフセット
var offsetTop = 50;
//下からのオフセット
var offsetBottom = 40;
var nSize = 25;

//　ツリーレイアウトを指定
var tree = d3.layout.tree()
  //全体のサイズを指定
  .size([svgWidth,svgHeight-offsetTop - offsetBottom])
  .nodeSize([120,110])

//TreeNodeを指定
var nodes = tree.nodes(dataSet)

// ノード間を繋ぐ線を表示
d3.select("#myGraph")
  //path要素を対象にする
  .selectAll("path")
  //ノードをデータセットとして設定
  .data(tree.links(nodes))
  .enter()
  //パスを生成する
  .append("path")
  //スタイルシートを設定
  .attr("class", "line")
  //ノード間をつなぐ
  .attr("d", d3.svg.diagonal())
  //全体にずらす
  .attr("transform", "translate(" + offsetLeft+"," + offsetTop + ")")

//ノードに●を表示
d3.select("#myGraph")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("cx", function (d) { return d.x + offsetLeft })
  .attr("cy", function (d) { return d.y + offsetTop })
  .attr("r", nSize)

//　ノードにテキストを表示
d3.select("#myGraph")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", function (d) { return d.x + offsetLeft })
  .attr("y", function (d) { return d.y + offsetTop })
  .attr("dy", 6)
  .text(function(d){ return d.name})