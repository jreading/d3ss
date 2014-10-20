var connect = require('connect'),
    serveStatic = require('serve-static'),
    compression = require('compression'),
    http = require('http'),
    d3 = require('d3'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    phantom = require('phantom');

var app = connect(),
    port = 1337,
    htmlStub = '<html><body><div id="main"></div></body></html>',
    raw = serveStatic('raw', {'index': ['index.html', 'index.htm']}),
    rendered = serveStatic('rendered', {'index': ['rendered.png']}),
    file;

// gzip/deflate outgoing responses
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
        fs.writeFile('raw/index.html', file, function(err) {
            if(err) {
                console.log('error saving document', err);
            } else {
                console.log('Raw file was saved');
            }
        });
        app.use('/raw', raw);

        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open('http://localhost:1337/raw', function (status) {
                    page.render('rendered/rendered.png', {format: 'png', quality: '100'}, function() {
                        console.log('Rendered file was saved');
                        ph.exit();
                    });
                });
            });
        });
        app.use('/rendered', rendered);
    }
});

app.listen(port);
console.log('Listening on ' + port);



// page.open('/raw', function (status) {
//     page.render('/rendered/rendered.png', {format: 'png', quality: '100'});
//     phantom.exit();
// });

