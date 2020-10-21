d3.json("mydata.json", function (error, data) {
  var dataSet = [];
  for (var i = 0; i < data.length; i++) {
    dataSet.push(data[i].sales[0])
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



