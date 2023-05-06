var boardBody = document.getElementById("bcontainer");
var resizeObserver = new ResizeObserver(function () {
    boardBody.style.fontSize = boardBody.offsetHeight / 100 + "px";
}).observe(boardBody);
