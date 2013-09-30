var Engine = require('engine.io-stream');
var engine = Engine('/engine');

var nick = (~~(Math.random() * 1e9)).toString(36);

function sendMessage(e) {
    var key = e.keyCode || e.which;
    var input = document.getElementById("chat_input");
    if (key == 13 && input.value !== "") {
        e.preventDefault();
        engine.write(nick + ">  " + input.value);
        input.value = "";
    }
}

engine.on('data', function(data) {
    document.getElementById('chat').innerHTML = '<p>'+data+'</p>' + document.getElementById('chat').innerHTML;
});

window.engine = engine;
window.sendMessage = sendMessage;
