var wsUri = "wss://zodaland.com/ws";
var output;
var connBtn;
var sendBtn;
var disconnBtn;

function init() {
	output = document.getElementById("test");

	connBtn = document.getElementById("conn");
	connBtn.onclick = doConnect;

	disconnBtn = document.getElementById("disconn");
	disconnBtn.onclick = doDisconnect;

	sendBtn = document.getElementById("send");
	sendBtn.onclick = doSend;
}

function doConnect() {
	websocket = new WebSocket(wsUri);


	websocket.onopen = function(evt) {
		onOpen(evt);
	};
	websocket.onclose = function(evt) {
		onClose(evt);
	};
	websocket.onmessage = function(evt) {
		onMessage(evt);
	};
	websocket.onerror = function(evt) {
		onError(evt);
	}
}

function onOpen(evt) {
	writeToScreen("conn");
	websocket.send("WebSocket rocks");	
}
function onClose(evt) {
	writeToScreen("disconn");
}
function onMessage(evt) {
	writeToScreen("<span style='color:blue;'>RESPONSE : " + evt.data + "</span>");
}
function onError(evt) {
	writeToScreen("<span style='color:red;'>ERROR</span> : " + evt.data);
}
function doSend() {
	var inputText = document.getElementById("msg");
	var msg = inputText.value;

	writeToScreen("SENT : " + msg);
	websocket.send(msg);
}
function writeToScreen(msg) {
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = msg;
	output.appendChild(pre);
}



function doDisconnect() {
	websocket.close();
}

