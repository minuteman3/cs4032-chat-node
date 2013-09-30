var fs = require('fs');
var http = require('http');
//var level = require('level');
var db = require('memdb')();
var Engine = require('engine.io-stream');
var livestream = require('level-live-stream');
var browserify = require('browserify');

var server = http.createServer(function(req,res) {
    if (req.url == '/bundle.js') {
        res.writeHead(200, {"Content-Type": "application/javascript"});
        browserify(__dirname + '/browser.js')
        .bundle({ debug: true })
        .pipe(res);
    } else {
        fs.createReadStream(__dirname + "/index.html").pipe(res);
    }
});


//var db = level(__dirname + '/db', {
    //valueEncoding: 'json'
//});

livestream.install(db);

var engine = Engine(function(stream) {
    db.liveStream().on('data', function(data) {
        console.log(data.value);
        stream.write(data.value);
    });
    stream.on('data', function(data) {
        db.put(new Date().toISOString(), data.toString());
    });
}).attach(server, '/engine');

server.listen(process.env.PORT || 8080)
