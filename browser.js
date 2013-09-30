var Engine = require('engine.io-stream');
var engine = Engine('/engine');

var nick = (~~(Math.random() * 1e9)).toString(36);

function sendMessage(e) {
    var key = e.keyCode || e.which;
    var input = document.getElementById('chat_input');
    if (key == 13 && input.value !== '') {
        e.preventDefault();
        if (input.value.indexOf('/name ') === 0) {
            nick = input.value.replace('/name ', '');
        } else {
            engine.write(nick + '\x00' + input.value);
        }
        input.value = '';
    }
}

var i = 0;
function rowColor() {
    if (i++ % 2) return 'style="background-color: #CCCCCC"';
    else return 'style="background-color:#FFFFFF"';
}
function makeRow(sender, message) {
    return '<div class="message" ' + rowColor() + '>'
    + '<span class="sender">'
    + sender + ' >'
    + '</span>' 
    + '&nbsp;'
    + '<span class="text">'
    + message
    + '</span></div>';
}

engine.on('data', function(data) {
    var data = data.split('\x00');
    var el = document.getElementById('chat');
    el.innerHTML = makeRow(data[0], data[1]) + el.innerHTML;
});
window.engine = engine;
window.sendMessage = sendMessage;
