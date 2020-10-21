var svg1 = d3.selectAll(".bar")
  .style("fill", function (d, i) {
    console.log(i)
    if (i == 2) {
      console.log(i)
      return "red";
    }
  })