var connect = require('connect'),
    http = require('http'),
    d3 = require('d3'),
    jsdom = require('jsdom'),
    fs = require('fs');

var app = connect();
var port = 1337;
var htmlStub = '<html><body><div id="main"></div></body></html>';
var file;


// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// pass the html stub to jsDom
jsdom.env({
    features : {
        QuerySelector : true
    },
    html: htmlStub,
    done: function(errors, window) {
        var body = window.document.querySelector('body');
        var el = window.document.querySelector('#main');
        d3.select(el)
            .append('svg:svg')
            .attr('width', 600).attr('height', 300)
            .append('circle')
                .attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c');

        file = window.document.documentElement.outerHTML;
    }
});

// respond to all requests
app.use(function(req, res){
  res.end(file);
});

//create node.js http server and listen on port
http.createServer(app).listen(port);
console.log("Listening on " + port);