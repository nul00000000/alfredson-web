var usedYs = [];
function validY(y) {
    for (var i = 0; i < usedYs.length; i++) {
        if (Math.abs(y - usedYs[i]) < 0.05) {
            return false;
        }
    }
    return true;
}
var testimonies = document.querySelectorAll('.testim');
for (var i = 0; i < testimonies.length; i++) {
    testimonies[i].style.setProperty('--x', (Math.random() * 75 + 5) + '%');
    var temp = Math.random();
    var tries = 0;
    while (!validY(temp) && tries < 50) {
        temp = Math.random();
        tries++;
    }
    usedYs.push(temp);
    console.log(temp + " " + testimonies[i].textContent);
    testimonies[i].style.setProperty('--y', (temp * 75 + 12.5) + '%');
}
