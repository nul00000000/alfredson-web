const boardBody = document.getElementById("bcontainer");

const resizeObserver = new ResizeObserver(() => {
    boardBody.style.fontSize = boardBody.offsetHeight / 100 + "px";
}).observe(boardBody);
