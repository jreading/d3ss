var d3 = require('d3');

var chart = {
    init: function(window) {
        var body = window.document.querySelector('body'),
            el = window.document.querySelector('#main');

        var chart = d3.select(el).append('svg:svg')
            .attr('width', 400).attr('height', 300);
        chart.append('circle')
            .attr('cx', 300).attr('cy', 250).attr('r', 30).attr('fill', '#26963c');
        chart.append('circle')
            .attr('cx', 100).attr('cy', 150).attr('r', 70).attr('fill', 'hotpink');
        chart.append('circle')
            .attr('cx', 200).attr('cy', 20).attr('r', 10).attr('fill', 'blue');

        // // write the client-side script manipulating the circle
        // var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

        // // append the script to page's body
        // d3.select(body)
        //     .append('script')
        //     .html(clientScript)

        return window.document.documentElement.outerHTML;
    }
};

module.exports = chart;