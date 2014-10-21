var connect = require("connect"),
    serveStatic = require("serve-static"),
    compression = require("compression"),
    http = require("http"),
    d3 = require("d3"),
    jsdom = require("jsdom"),
    fs = require("fs"),
    phantom = require("phantom"),
    url = require("url"),
    chart = require("./chart");

var app = connect(),
    port = 1337,
    htmlStub = "<html><body><div id=\"main\"></div></body></html>",
    root = serveStatic("./"),
    file;

app.use(root);
app.use(compression());
app.use("/viz", function(req, res){
    var qStrings = url.parse(req.url, true).query;

    jsdom.env({
        features : {
            QuerySelector: true
        },
        html: htmlStub,
        done: function(errors, window) {
            file = chart.init(window, qStrings);
            if (qStrings.mode === "raw") {
                res.end(file);
            } else if (qStrings.mode === "rendered") {
                phantom.create(function (ph) {
                    ph.createPage(function (page) {
                        page.setContent(file);
                        page.renderBase64("png", function(data) {
                            res.setHeader("Content-Type", "image/png");
                            res.end(new Buffer(data, "base64"));
                            ph.exit();
                        });
                    });
                });
            }
        }
    });
});

app.listen(port);
console.log("Listening on " + port);