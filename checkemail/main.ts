var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get("id");
var a = document.querySelector("#resend") as HTMLAnchorElement;

a.onclick = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8383/resendemail");
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(id);
};