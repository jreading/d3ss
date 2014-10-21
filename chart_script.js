var tau = 2 * Math.PI;

var arc = d3.svg.arc()
    .innerRadius(80)
    .outerRadius(100)
    .startAngle(0);

setTimeout(function() {
    d3.select("#foreground")
        .datum({endAngle: 0})
        .transition()
        .duration(1000)
        .call(arcTween, (score/100) * tau);

    d3.select("#text")
        .transition()
        .duration(1000)
        .attr("fill", bgColor);
}, 500);

function arcTween(transition, newAngle) {
  transition.attrTween("d", function(d) {
    var interpolate = d3.interpolate(0, newAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      return arc(d);
    };
  });
}