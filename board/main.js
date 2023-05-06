var overlay;
var cardView;
var draggedCard;
var cards = {};
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
        this.packetQueue.push(obj);
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
var cardTemplateContent = document.querySelector("#cardTemplate").content;
function getCardByID(cardID, callback) {
    if (cards[cardID]) {
        callback(cards[cardID]);
    }
    else {
        var xhr_1 = new XMLHttpRequest();
        xhr_1.open("POST", "/data/cardinfo/", true);
        xhr_1.setRequestHeader("Content-Type", "application/json");
        xhr_1.onreadystatechange = function () {
            if (xhr_1.readyState === 4 && xhr_1.status === 200) {
                var card = JSON.parse(xhr_1.responseText);
                cards[cardID] = card;
                callback(card);
            }
        };
        var data = JSON.stringify({ id: cardID });
        xhr_1.send(data);
    }
}
function putCard(cardID, cardSlot) {
    server.sendPacket({ packetType: "putCard", cardID: cardID, slot: cardSlot });
}
function setText(card, cardSlot) {
    var inPlayCards = document.querySelectorAll(".cardDisplay");
    var temp = cardTemplateContent.cloneNode(true);
    temp.querySelector("#pcardArt img").src = card.cardArt;
    temp.querySelector("#pcardName").textContent = card.name;
    inPlayCards[cardSlot].replaceChildren(temp);
    if (cardSlot >= 3) {
        inPlayCards[cardSlot].draggable = true;
    }
}
function overlayClick() {
    overlay.style.visibility = "hidden";
    cardView.style.visibility = "hidden";
}
function stylizeString(characterType) {
    var ret = characterType.toUpperCase().charAt(0);
    for (var i = 1; i < characterType.length; i++) {
        ret += " " + characterType.toUpperCase().charAt(i);
    }
    return ret;
}
function setCardText(card) {
    document.querySelector("#characterType").textContent = stylizeString(card.characterType);
    document.querySelector("#cardArt img").src = card.cardArt;
    document.querySelector("#cardName").textContent = card.name;
    document.querySelector("#healthBubble div").textContent = card.health + "HP";
    document.querySelector("#cardType").textContent = card.cardType;
    document.querySelector("#originStory").textContent = "ORIGIN STORY: " + card.originStory;
    document.querySelector("#attack").textContent = "ATTACK: " + card.attack;
    document.querySelector("#attackDamage").textContent = "" + card.attackDamage;
    document.querySelector("#defense").textContent = "DEFENSE: " + card.defense;
    document.querySelector("#defenseDamage").textContent = "" + card.defenseDamage;
    document.querySelector("#special").textContent = "ARCHENEMY BONUS: " + card.special;
}
function onCardClick(e, cardSlot) {
    var slot = cardSlot >= 3 ? cardSlot - headOffset : cardSlot + headOffset;
    if (boardCards[slot] < 0) {
        if (cardSlot >= 3 && cardSlot <= 5) {
            putCard(Math.random() < 0.5 ? 0 : 1, slot);
        }
    }
    else {
        getCardByID(boardCards[slot], function (card) { setCardText(card); overlay.style.visibility = "visible"; cardView.style.visibility = "visible"; });
    }
}
function onCardDrop(cardSlot) {
    var slot = cardSlot >= 3 ? cardSlot - headOffset : cardSlot + headOffset;
    var fslot = draggedCard >= 3 ? draggedCard - headOffset : draggedCard + headOffset;
    server.sendPacket({ packetType: "attack", fromSlot: fslot, toSlot: slot });
}
function startGame() {
    document.querySelector("#enemySide").style.filter = "brightness(100%)";
}
var server;
var isHead;
var headOffset;
var boardCards = [-1, -1, -1, -1, -1, -1];
function init() {
    overlay = document.querySelector("#overlay");
    cardView = document.querySelector("#container");
    var inPlayCards = document.querySelectorAll(".cardDisplay");
    var _loop_1 = function (i) {
        inPlayCards[i].onclick = function (e) { onCardClick(e, i); };
        if (i < 3) {
            inPlayCards[i].ondragover = function (e) { e.preventDefault(); };
            inPlayCards[i].ondrop = function (e) { e.preventDefault(); onCardDrop(i); };
        }
        else {
            inPlayCards[i].ondragstart = function (e) { draggedCard = i; };
        }
    };
    for (var i = 0; i < inPlayCards.length; i++) {
        _loop_1(i);
    }
    server = new Server("wss://schedge.net/alphro/");
    server.sendPacket({ packetType: "verify" });
    requestAnimationFrame(loop);
}
function loop(delta) {
    var _loop_2 = function () {
        var p = server.readPacket();
        if (p.packetType == "gameStart") {
            isHead = p.head;
            if (isHead) {
                headOffset = 3;
            }
            else {
                headOffset = 0;
            }
            startGame();
        }
        else if (p.packetType == "putCard") {
            var putCard_1 = p;
            var slot_1 = putCard_1.slot >= 3 ? putCard_1.slot - headOffset : putCard_1.slot + headOffset;
            if (putCard_1.cardID < 0) {
                var inPlayCards = document.querySelectorAll(".cardDisplay");
                inPlayCards[putCard_1.slot].replaceChildren();
                inPlayCards[putCard_1.slot].draggable = false;
            }
            else {
                getCardByID(putCard_1.cardID, function (card) { return setText(card, slot_1); });
            }
            boardCards[putCard_1.slot] = putCard_1.cardID;
        }
        else if (p.packetType == "cardStatus") {
            var cardStatus = p;
            var slot = cardStatus.slot >= 3 ? cardStatus.slot - headOffset : cardStatus.slot + headOffset;
            var healthCounters = document.querySelectorAll(".cardHP");
            healthCounters[slot].textContent = "" + cardStatus.health;
        }
        console.log(p);
    };
    while (server.hasPacket()) {
        _loop_2();
    }
    server.update();
    requestAnimationFrame(loop);
}
