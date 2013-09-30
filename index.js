var fs = require('fs');
var http = require('http');
var db = require('memdb')();
var Engine = require('engine.io-stream');
var livestream = require('level-live-stream');
var browserify = require('browserify');
var escape = require('escape-html');

var server = http.createServer(function(req,res) {
    if (req.url == '/bundle.js') {
        res.writeHead(200, {"Content-Type": "application/javascript"});
        browserify(__dirname + '/browser.js')
        .bundle({ debug: true })
        .pipe(res);
    } else if (req.url == '/style.css') {
        res.writeHead(200, {"Content-Type": "text/css"});
        fs.createReadStream(__dirname + "/style.css").pipe(res);
    } else {
        fs.createReadStream(__dirname + "/index.html").pipe(res);
    }
});

livestream.install(db);

var engine = Engine(function(stream) {
    db.liveStream().on('data', function(data) {
        stream.write(data.value);
    });
    stream.on('data', function(data) {
        db.put(new Date().toISOString(), escape(data.toString()));
    });
}).attach(server, '/engine');

server.listen(process.env.PORT || 8080)
