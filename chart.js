var d3 = require('d3'),
    fs = require('fs');

var chart = {
    init: function(window, options) {
        var body = window.document.querySelector('body'),
            el = window.document.querySelector('#main'),
            bgcolor;


        var bgColor = function() {
            if (options.score >= 90) {
                return "green";
            }
            if (options.score >= 70) {
                return "orange";
            }
            if (options.score >= 0) {
                return "red";
            }
        };


        var chart = d3.select(el)
            .append('svg:svg')
            .attr('width', 400)
            .attr('height', 400)
            .append("g")
            .attr("transform", "translate(200,200)");

        var τ = 2 * Math.PI; // http://tauday.com/tau-manifesto

        var angle = options.mode === "raw" ? 0 : (options.score/100) * τ;

        var arc = d3.svg.arc()
            .innerRadius(80)
            .outerRadius(100)
            .startAngle(0);

        var background = chart.append("path")
            .datum({endAngle: τ})
            .style("fill", "#ddd")
            .attr("d", arc);

        var foreground = chart.append("path")
            .datum({endAngle: angle})
            .style("fill", bgColor)
            .attr("d", arc)
            .attr("id", "foreground");

        var textLabel = chart
            .append("g")
            .attr("transform", "translate(" + -53 + "," + 35 +")")
            .attr("class", "label");

        textLabel
            .append("text")
            .text(options.score)
            .attr("font-family","sans-serif")
            .attr("font-size", "100px")
            .attr("fill", bgColor);

        // // write the client-side script manipulating the circle
        
        var clientScript = fs.readFileSync('node_modules/d3/d3.min.js');
        clientScript += "var score = " + options.score + ";";
        clientScript += fs.readFileSync('chart_script.js');

        if (options.mode === "raw") {
            d3.select(body)
                .append('script')
                .html(clientScript);
        }

        return window.document.documentElement.outerHTML;
    }
};

module.exports = chart;