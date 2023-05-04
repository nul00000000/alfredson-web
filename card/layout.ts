const cardBody = document.getElementById("body");

const resizeObserver = new ResizeObserver(() => {
    cardBody.style.fontSize = cardBody.offsetHeight / 100 + "px";
}).observe(cardBody);