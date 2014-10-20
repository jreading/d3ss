var connect = require('connect'),
    redirect = require('connect-redirection'),
    serveStatic = require('serve-static'),
    compression = require('compression'),
    http = require('http'),
    d3 = require('d3'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    phantom = require('phantom'),
    url = require('url'),
    chart = require('./chart');

var app = connect(),
    port = 1337,
    htmlStub = '<html><body><div id="main"></div></body></html>',
    raw = serveStatic('raw', {'index': ['index.html', 'index.htm']}),
    rendered = serveStatic('rendered', {'index': ['rendered.png']}),
    file;

// gzip/deflate outgoing responses
app.use(compression());

// pass the html stub to jsDom


app
.use(redirect())
.use('/viz', function(req, res){
    var qStrings = url.parse(req.url, true).query;

    jsdom.env({
        features : {
            QuerySelector : true
        },
        html: htmlStub,
        done: function(errors, window) {
            var body = window.document.querySelector('body'),
                el = window.document.querySelector('#main');

            file = chart.init(window);
            
            if (qStrings.mode === "raw") {
                res.end(file);
            } else if (qStrings.mode === "rendered") {
                fs.writeFile('raw/index.html', file, function(err) {
                    if(err) {
                        console.log('error saving document', err);
                    } else {
                        console.log('Raw file was saved');
                    }
                });

                phantom.create(function (ph) {
                    ph.createPage(function (page) {
                        page.open('http://localhost:1337/raw', function (status) {
                            page.render('rendered/rendered.png', {format: 'png', quality: '100'}, function() {
                                console.log('Rendered file was saved');
                                ph.exit();
                                fs.readFile('rendered/rendered.png', function(err, data) {
                                    res.end(data);
                                });
                            });
                        });
                    });
                });
            }
        }
    });
});

app.use('/raw', raw);
app.listen(port);

console.log('Listening on ' + port);


// page.open('/raw', function (status) {
//     page.render('/rendered/rendered.png', {format: 'png', quality: '100'});
//     phantom.exit();
// });

