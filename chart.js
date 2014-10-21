var d3 = require('d3'),
    fs = require('fs');

var chart = {
    init: function(window, options) {
        var body = window.document.querySelector('body'),
            el = window.document.querySelector('#main'),
            bgcolor, bgcolorInit, chart, τ, angle, arc, background, foreground, textLabel, textVal, clientScript;


        bgColor = function() {
            if (options.score >= 66) {
                return "green";
            }
            if (options.score >= 33) {
                return "orange";
            }
            if (options.score >= 0) {
                return "red";
            }
        };

        bgcolorInit = options.mode === "raw" ? "#ddd": bgColor;

        chart = d3.select(el)
            .append('svg:svg')
            .attr('width', 400)
            .attr('height', 400)
            .append("g")
            .attr("transform", "translate(200,200)");

        τ = 2 * Math.PI; // http://tauday.com/tau-manifesto

        angle = options.mode === "raw" ? 0 : (options.score/100) * τ;

        arc = d3.svg.arc()
            .innerRadius(80)
            .outerRadius(100)
            .startAngle(0);

        background = chart.append("path")
            .datum({endAngle: τ})
            .style("fill", "#ddd")
            .attr("d", arc);

        foreground = chart.append("path")
            .datum({endAngle: angle})
            .style("fill", bgColor)
            .attr("d", arc)
            .attr("id", "foreground");

        textLabel = chart
            .append("g")
            .attr("transform", "translate(" + 0 + "," + 35 +")")
            .attr("class", "label");

        textVal = textLabel
            .append("text")
            .text(options.score)
            .style("text-anchor", "middle")
            .style("letter-spacing", "-2")
            .attr("id", "text")
            .attr("font-family","sans-serif")
            .attr("font-size", "100px")
            .attr("fill", bgcolorInit)
            .transition()
            .duration(750);

        if (options.mode === "raw") {
            clientScript = "var score = " + options.score + ";";
            clientScript += "var bgColor = '" + bgColor() + "';";
            clientScript += fs.readFileSync("chart_script.js");
            d3.select(body)
                .append("script")
                .attr("src","node_modules/d3/d3.min.js");
            d3.select(body)
                .append("script")
                .html(clientScript);
        }

        return window.document.documentElement.outerHTML;
    }
};

module.exports = chart;