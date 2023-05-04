var usedYs = [];
function validY(y) {
    for (var i = 0; i < usedYs.length; i++) {
        if (Math.abs(y - usedYs[i]) < 0.1) {
            return false;
        }
    }
    return true;
}
var testimonies = document.querySelectorAll('.testim');
for (var i = 0; i < testimonies.length; i++) {
    testimonies[i].style.setProperty('--x', (Math.random() * 75 + 5) + '%');
    var temp = Math.random();
    while (!validY(temp)) {
        temp = Math.random();
    }
    usedYs.push(temp);
    console.log(temp + " " + testimonies[i].textContent);
    testimonies[i].style.setProperty('--y', (temp * 75 + 12.5) + '%');
}
