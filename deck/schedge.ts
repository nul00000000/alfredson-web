enum CardType {
    FIRE = "#ff6600",
    WATER = "#0000ff",
    PLANT = "#00ff00",
    SUS = "#ff0000",
    ALFREDSON = "#ff55ff",
    BEST = "#eedd00"
}

type Card = {
    id: number;
    cardType: CardType;
    imageName: string;
    localName: string;
};

let cardList: Card[] = [];

function registerCard(typ: CardType, name: string) {
    cardList.push({id: cardList.length, cardType: typ, imageName: "/assests/cards/" + name.toLowerCase() + ".png", localName: name});
}

function updateCalender() {
    let label = document.getElementById("monthLabel") as HTMLParagraphElement;
    label.textContent = "deck or something";
    let table = document.querySelector("tbody");
    for(let i = 0; i < 36; i++) { //setting color per cell
        let cell = table.children[Math.floor(i / 6)] as HTMLTableRowElement;
        let e = cell.children[i % 6] as HTMLTableCellElement;
        let img = e.children[1] as HTMLImageElement;
        if(i < cardList.length) {
            e.children[0].textContent = i + ": " + cardList[i].localName;
            img.src = cardList[i].imageName;
            e.style.backgroundColor = cardList[i].cardType;
        } else {
            e.children[0].textContent = "" + i;
            img.style.display = "none";
        }
    }
}

function onLoad(): void {
    init();
    updateCalender();
}

function changeMonth(amount): void {
    updateCalender();
}

function init() {
    registerCard(CardType.BEST, "Bigguy");
    registerCard(CardType.PLANT, "Poo");
    registerCard(CardType.SUS, "Mong");

    let tab = document.querySelector("#calender") as HTMLTableElement;
    let temp = document.querySelector("#tempCell") as HTMLTemplateElement;

    for(let j = 0; j < 6; j++) {
        let row = tab.insertRow(-1);
        for(let i = 0; i < 6; i++) {
            let cell = row.insertCell(i);
            cell.appendChild(temp.content.cloneNode(true));
        }
    }
}