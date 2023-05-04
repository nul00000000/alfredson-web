var playerID = 0;
var ERROR_SESSION_INVALID = 1;
var ERROR_GAME_FULL = 2;
var ERROR_PLAYER_NOT_PRESENT = 3;
var ERROR_ACTION_INVALID = 4;
var ERROR_ACTION_DATA_INVALID = 5;
var cards = [];
var Server = (function () {
    function Server(address) {
        var _this = this;
        this.socket = new WebSocket(address);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = function (e) { _this.onMessage(e); };
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
        this.socket.binaryType = "arraybuffer";
        this.packetQueue = [];
        this.outgoingPackets = [];
    }
    Server.prototype.sendPacket = function (packet) {
        this.outgoingPackets.push(packet);
    };
    Server.prototype.hasPacket = function () {
        return this.packetQueue.length > 0;
    };
    Server.prototype.readPacket = function () {
        return this.packetQueue.splice(0, 1)[0];
    };
    Server.prototype.onOpen = function (e) {
    };
    Server.prototype.onMessage = function (e) {
        var obj = JSON.parse(e.data);
        if (obj.packetType && obj.packetType == "putCard") {
            this.packetQueue.push(obj);
        }
    };
    Server.prototype.onClose = function (e) {
        console.log("close");
    };
    Server.prototype.onError = function (error) {
        console.log(error);
    };
    Server.prototype.update = function () {
        if (this.socket.readyState != WebSocket.OPEN) {
            return;
        }
        for (var i = 0; i < this.outgoingPackets.length; i++) {
            this.socket.send(JSON.stringify(this.outgoingPackets[i]));
        }
        this.outgoingPackets = [];
    };
    return Server;
}());
var card = {};
var cardTemplateContent = document.querySelector("#cardTemplate").content;
function putCard(cardID, cardSlot) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/data/cardinfo/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            card = JSON.parse(xhr.responseText);
            setText(cardSlot);
        }
    };
    var data = JSON.stringify({ id: cardID });
    xhr.send(data);
}
function init() {
    var inPlayCards = document.querySelectorAll(".cardDisplay");
    var _loop_1 = function (i) {
        inPlayCards[i].onclick = function (e) { onCardClick(e, i); };
    };
    for (var i = 0; i < inPlayCards.length; i++) {
        _loop_1(i);
    }
}
function setText(cardSlot) {
    var inPlayCards = document.querySelectorAll(".cardDisplay");
    var temp = cardTemplateContent.cloneNode(true);
    temp.querySelector("#cardArt img").src = card.cardArt;
    temp.querySelector("#cardName").textContent = card.name;
    inPlayCards[cardSlot].replaceChildren(temp);
}
function onCardClick(e, slot) {
    console.log("cock");
    putCard(Math.random() < 0.5 ? 0 : 1, slot);
}
