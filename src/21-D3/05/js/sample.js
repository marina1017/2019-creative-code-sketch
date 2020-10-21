d3.csv("mydata.csv")
  .row(function (d) {
    return {
      item1: d["商品A"],
      item2: d["商品B"],
      item3: d["商品C"],
    }
  })
  .get(function (error, data) {
    var dataSet = [];
    for (var i = 0; i < data.length; i++) {
      dataSet.push(data[i].item1);
    }
    d3.select("#myGraph")
      .selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", function (d, i) {
        return d;
      })
      .attr("height", 20)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 25;
      })
  })



