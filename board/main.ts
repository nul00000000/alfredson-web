// let playerID = 0;
// const ERROR_SESSION_INVALID = 1;
// const ERROR_GAME_FULL = 2;
// const ERROR_PLAYER_NOT_PRESENT = 3;
// const ERROR_ACTION_INVALID = 4;
// const ERROR_ACTION_DATA_INVALID = 5;

let overlay: HTMLDivElement;
let cardView: HTMLDivElement;

let draggedCard: number;

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

let cards: {[cardID: number]: Card} = {};

type CardRequest = {
    id: number;
};

type Packet = {
	packetType: string;
};

type PutCardPacket = Packet & {
	cardID: number;
	slot: number;
}

type AttackPacket = Packet & {
	fromSlot: number;
	toSlot: number;
}

type CardStatusPacket = Packet & {
	slot: number;
	health: number;
}

type VerifyPacket = Packet;

type GameStartPacket = Packet & {
	head: boolean;
};

class Server {
	socket: WebSocket;
	packetQueue: (Packet)[];
	outgoingPackets: (Packet)[];
	constructor(address: string) {
		this.socket = new WebSocket(address);
		this.socket.onopen = this.onOpen;
		this.socket.onmessage = (e: MessageEvent) => {this.onMessage(e);};
		this.socket.onclose = this.onClose;
		this.socket.onerror = this.onError;
		this.socket.binaryType = "arraybuffer";
		this.packetQueue = [];
		this.outgoingPackets = [];
	}

	//prefix should be set before sendPacket is called
	sendPacket(packet: (Packet)): void {
		this.outgoingPackets.push(packet);
	}

	hasPacket(): boolean {
		return this.packetQueue.length > 0;
	}

	readPacket(): Packet {
		return this.packetQueue.splice(0, 1)[0];
	}

	onOpen(this: WebSocket, e: Event) {
		
	}

	onMessage(e: MessageEvent) {
		let obj = JSON.parse(e.data);
		this.packetQueue.push(obj);
	}

	onClose(this: WebSocket, e: CloseEvent) {
		console.log("close");
	}

	onError(this: WebSocket, error: Event) {
		console.log(error);
	}

	update() {
		if(this.socket.readyState != WebSocket.OPEN) {
			return;
		}
		for(var i = 0; i < this.outgoingPackets.length; i++) {
			this.socket.send(JSON.stringify(this.outgoingPackets[i]));
		}
		this.outgoingPackets = [];
	}
}

let cardTemplateContent = (document.querySelector("#cardTemplate") as HTMLTemplateElement).content;

function getCardByID(cardID: number, callback: (card: Card) => any) {
	if(cards[cardID]) {
		callback(cards[cardID]);
	} else {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/data/cardinfo/", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4 && xhr.status === 200) {
				let card = JSON.parse(xhr.responseText) as Card;
				cards[cardID] = card;
				callback(card);
			}
		}
		let data = JSON.stringify({id: cardID} as CardRequest);
		xhr.send(data);
	}
}

function putCard(cardID: number, cardSlot: number) {
	server.sendPacket({packetType: "putCard", cardID: cardID, slot: cardSlot} as PutCardPacket);
}

function setText(card: Card, cardSlot: number) {
    let inPlayCards = document.querySelectorAll(".cardDisplay");
    let temp = cardTemplateContent.cloneNode(true) as HTMLDivElement;
    (temp.querySelector("#pcardArt img") as HTMLImageElement).src = card.cardArt;
    temp.querySelector("#pcardName").textContent = card.name;
    inPlayCards[cardSlot].replaceChildren(temp);
	if(cardSlot >= 3) {
		(inPlayCards[cardSlot] as HTMLDivElement).draggable = true;
	}
}

function overlayClick() {
	overlay.style.visibility = "hidden";
	cardView.style.visibility = "hidden";
}

function stylizeString(characterType: string): string {
    let ret = characterType.toUpperCase().charAt(0);
    for(let i = 1; i < characterType.length; i++) {
        ret += " " + characterType.toUpperCase().charAt(i);
    }
    return ret;
}

function setCardText(card: Card) {
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

function onCardClick(e: MouseEvent, cardSlot: number) {
	let slot = cardSlot >= 3 ? cardSlot - headOffset : cardSlot + headOffset;
	if(boardCards[slot] < 0) {
		if(cardSlot >= 3 && cardSlot <= 5) {
			putCard(Math.random() < 0.5 ? 0 : 1, slot);
		}
	} else {
		getCardByID(boardCards[slot], (card: Card) => {setCardText(card); overlay.style.visibility = "visible"; cardView.style.visibility = "visible";});
	}
}

function onCardDrop(cardSlot: number) {
	let slot = cardSlot >= 3 ? cardSlot - headOffset : cardSlot + headOffset;
	let fslot = draggedCard >= 3 ? draggedCard - headOffset : draggedCard + headOffset;
	server.sendPacket({packetType: "attack", fromSlot: fslot, toSlot: slot} as AttackPacket);
}

function startGame() {
	(document.querySelector("#enemySide") as HTMLDivElement).style.filter = "brightness(100%)";
}

let server: Server;
let isHead: boolean;
let headOffset: number;

let boardCards = [-1, -1, -1, -1, -1, -1];

function init() {
	overlay = document.querySelector("#overlay") as HTMLDivElement;
	cardView = document.querySelector("#container") as HTMLDivElement;
    let inPlayCards = document.querySelectorAll(".cardDisplay");
    for(let i = 0; i < inPlayCards.length; i++) {
        (inPlayCards[i] as HTMLDivElement).onclick = (e) => {onCardClick(e, i)};
		if(i < 3) {
			(inPlayCards[i] as HTMLDivElement).ondragover = (e) => {e.preventDefault()};
			(inPlayCards[i] as HTMLDivElement).ondrop = (e) => {e.preventDefault(); onCardDrop(i);};
		} else {
			(inPlayCards[i] as HTMLDivElement).ondragstart = (e) => {draggedCard = i};
		}
    }
	server = new Server("wss://schedge.net/alphro/");
	server.sendPacket({packetType: "verify"});

	requestAnimationFrame(loop);
}

function loop(delta: number) {
	while(server.hasPacket()) {
		let p = server.readPacket();
		if(p.packetType == "gameStart") {
			isHead = (p as GameStartPacket).head;
			if(isHead) {
				headOffset = 3;
			} else {
				headOffset = 0;
			}
			startGame();
		} else if(p.packetType == "putCard") {
			let putCard = p as PutCardPacket;
			let slot = putCard.slot >= 3 ? putCard.slot - headOffset : putCard.slot + headOffset;
			if(putCard.cardID < 0) {
				let inPlayCards = document.querySelectorAll(".cardDisplay");
				inPlayCards[putCard.slot].replaceChildren();
				(inPlayCards[putCard.slot] as HTMLDivElement).draggable = false;
			} else {
				getCardByID(putCard.cardID, (card: Card) => setText(card, slot));
			}
			boardCards[putCard.slot] = putCard.cardID;
		} else if(p.packetType == "cardStatus") {
			let cardStatus = p as CardStatusPacket;
			let slot = cardStatus.slot >= 3 ? cardStatus.slot - headOffset : cardStatus.slot + headOffset;
			let healthCounters = document.querySelectorAll(".cardHP");
			healthCounters[slot].textContent = "" + cardStatus.health;
		}
		console.log(p);
	}

	server.update();
	requestAnimationFrame(loop);
}