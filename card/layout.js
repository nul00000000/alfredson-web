var cardBody = document.getElementById("body");
var resizeObserver = new ResizeObserver(function () {
    cardBody.style.fontSize = cardBody.offsetHeight / 100 + "px";
}).observe(cardBody);
