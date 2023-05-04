type Card = {
    id: number;
	name: string;
	characterType: string;
	health: number;
	cardType: string;
	originStory: string;
	attack: string;
	attackDamage: number;
	defense: string;
	defenseDamage: number;
	special: string;
	cardArt: string;
};

type CardRequest = {
    id: number;
};

let card = {} as Card;

function getCard(cardID: number) {
    let xhr = new XMLHttpRequest();
	xhr.open("POST", "/data/cardinfo/", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if(xhr.readyState === 4 && xhr.status === 200) {
            card = JSON.parse(xhr.responseText) as Card;
			setText();
		}
	}
	let data = JSON.stringify({id: cardID} as CardRequest);
	xhr.send(data);
}

function stylizeString(characterType: string): string {
    let ret = characterType.toUpperCase().charAt(0);
    for(let i = 1; i < characterType.length; i++) {
        ret += " " + characterType.toUpperCase().charAt(i);
    }
    return ret;
}

function setText() {
    document.querySelector("#characterType").textContent = stylizeString(card.characterType);
    (document.querySelector("#cardArt img") as HTMLImageElement).src = card.cardArt;
    document.querySelector("#cardName").textContent = card.name;
    document.querySelector("#healthBubble div").textContent = card.health + "HP";
    document.querySelector("#cardType").textContent = card.cardType;
    document.querySelector("#originStory").textContent = "ORIGIN STORY: " + card.originStory;
    document.querySelector("#attack").textContent = "ATTACK: " +  card.attack;
    document.querySelector("#attackDamage").textContent = "" + card.attackDamage;
    document.querySelector("#defense").textContent = "DEFENSE: " + card.defense;
    document.querySelector("#defenseDamage").textContent = "" + card.defenseDamage;
    document.querySelector("#special").textContent = "ARCHENEMY BONUS: " + card.special;
}