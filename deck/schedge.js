var CardType;
(function (CardType) {
    CardType["FIRE"] = "#ff6600";
    CardType["WATER"] = "#0000ff";
    CardType["PLANT"] = "#00ff00";
    CardType["SUS"] = "#ff0000";
    CardType["ALFREDSON"] = "#ff55ff";
    CardType["BEST"] = "#eedd00";
})(CardType || (CardType = {}));
var cardList = [];
function registerCard(typ, name) {
    cardList.push({ id: cardList.length, cardType: typ, imageName: "/assests/cards/" + name.toLowerCase() + ".png", localName: name });
}
function updateCalender() {
    var label = document.getElementById("monthLabel");
    label.textContent = "deck or something";
    var table = document.querySelector("tbody");
    for (var i = 0; i < 36; i++) {
        var cell = table.children[Math.floor(i / 6)];
        var e = cell.children[i % 6];
        var img = e.children[1];
        if (i < cardList.length) {
            e.children[0].textContent = i + ": " + cardList[i].localName;
            img.src = cardList[i].imageName;
            e.style.backgroundColor = cardList[i].cardType;
        }
        else {
            e.children[0].textContent = "" + i;
            img.style.display = "none";
        }
    }
}
function onLoad() {
    init();
    updateCalender();
}
function changeMonth(amount) {
    updateCalender();
}
function init() {
    registerCard(CardType.BEST, "Bigguy");
    registerCard(CardType.PLANT, "Poo");
    registerCard(CardType.SUS, "Mong");
    var tab = document.querySelector("#calender");
    var temp = document.querySelector("#tempCell");
    for (var j = 0; j < 6; j++) {
        var row = tab.insertRow(-1);
        for (var i = 0; i < 6; i++) {
            var cell = row.insertCell(i);
            cell.appendChild(temp.content.cloneNode(true));
        }
    }
}
