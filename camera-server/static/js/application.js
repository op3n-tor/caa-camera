var img = document.getElementById("liveImg");  
var arrayBuffer;

var adress = location.href.match( /\/\/[^\/]+/ )[0].substr(2);       //アクセスしてきたアドレス (例 192.168.1.100:1234)

var ws = new WebSocket("ws://" + adress + "/echo"); 
ws.binaryType = 'arraybuffer';                                       //受信データの設定

ws.onopen = function(){
  img.src = "static/img/default.jpg"
};

ws.onmessage = function(evt){
	arrayBuffer = evt.data;
        //受信したデータを復号しbase64でエンコード
	img.src = "data:image/jpeg;base64," + encode(new Uint8Array(arrayBuffer));
};

window.onbeforeunload = function(){
    //ウィンドウ（タブ）を閉じたらサーバにセッションの終了を知らせる
    ws.close(1000);
};

//base64でのエンコードらしい
function encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}
