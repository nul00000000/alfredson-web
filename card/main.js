var card = {};
function getCard(cardID) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/data/cardinfo/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            card = JSON.parse(xhr.responseText);
            setText();
        }
    };
    var data = JSON.stringify({ id: cardID });
    xhr.send(data);
}
function stylizeString(characterType) {
    var ret = characterType.toUpperCase().charAt(0);
    for (var i = 1; i < characterType.length; i++) {
        ret += " " + characterType.toUpperCase().charAt(i);
    }
    return ret;
}
function setText() {
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
