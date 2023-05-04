let playerID = 0;
const ERROR_SESSION_INVALID = 1;
const ERROR_GAME_FULL = 2;
const ERROR_PLAYER_NOT_PRESENT = 3;
const ERROR_ACTION_INVALID = 4;
const ERROR_ACTION_DATA_INVALID = 5;

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

let cards: Card[] = [];

type Packet = {
	packetType: string;
};

type CardRequest = Packet & {
    id: number;
};

type JsonRequest = Packet & {
	type: string;
	playerID: number;
	params: any[];
}

type JoinResponse = Packet & {
	errorCode: number;
	playerID: number;
}

type SetCardResponse = Packet & {
	errorCode: number;
}

type PutCardPacket = Packet & {
	cardID: number;
	slot: number;
}

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
		if(obj.packetType && obj.packetType == "putCard") {
			this.packetQueue.push(obj as PutCardPacket);
		}
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

let card = {} as Card;
let cardTemplateContent = (document.querySelector("#cardTemplate") as HTMLTemplateElement).content;

function putCard(cardID: number, cardSlot: number) {
    let xhr = new XMLHttpRequest();
	xhr.open("POST", "/data/cardinfo/", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if(xhr.readyState === 4 && xhr.status === 200) {
            card = JSON.parse(xhr.responseText) as Card;
			setText(cardSlot);
		}
	}
	let data = JSON.stringify({id: cardID} as CardRequest);
	xhr.send(data);
}

function init() {
    let inPlayCards = document.querySelectorAll(".cardDisplay");
    for(let i = 0; i < inPlayCards.length; i++) {
        (inPlayCards[i] as HTMLDivElement).onclick = (e) => {onCardClick(e, i)};
    }
}

function setText(cardSlot: number) {
    let inPlayCards = document.querySelectorAll(".cardDisplay");
    let temp = cardTemplateContent.cloneNode(true) as HTMLDivElement;
    (temp.querySelector("#cardArt img") as HTMLImageElement).src = card.cardArt;
    temp.querySelector("#cardName").textContent = card.name;
    inPlayCards[cardSlot].replaceChildren(temp);
}

function onCardClick(e: MouseEvent, slot: number) {
	console.log("cock");
    putCard(Math.random() < 0.5 ? 0 : 1, slot);
}