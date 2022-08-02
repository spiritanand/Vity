const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const allTimeScoreBoard = document.querySelector(".scores-tbl-content");
let lastHole, timeUp = false, started = false, score = 0;
let allPlayers = JSON.parse(localStorage.getItem("items")) || [];
let currentPlayer = {};
let difficulty;
let max, min;

populateAllScoreBoard();
document.nameForm.addEventListener("submit", submitted);
moles.forEach(mole => mole.addEventListener("click", bonk));

function submitted(e) {
    e.preventDefault();
    currentPlayer.name = this.playerName.value;
    currentPlayer.score = 0;
    startGame();
    this.reset();
}

function startGame() {
    if (started) return;
    started = true;
    score = 0;
    scoreBoard.textContent = score;
    timeUp = false;
    peep();
    setTimeout(endGame, 10000);
}

function randTime(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

function randHole(holes) {
    const index = Math.floor(Math.random() * 6);
    const hole = holes[index];
    if (hole === lastHole) return randHole(holes);
    lastHole = hole;

    return hole;
}

function peep() {
    const time = randTime(1000, 300);
    const hole = randHole(holes);

    const mole = hole.querySelector(".mole");
    mole.classList.add("up");
    setTimeout(() => {
        mole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

function bonk(e) {
    if (!e.isTrusted) return;

    this.classList.remove("up");
    score++;
    scoreBoard.textContent = score;
    currentPlayer.score = score;
}

function populateAllScoreBoard() {
    allPlayers.sort((a, b) => a.score > b.score ? -1 : 1);
    allPlayers = allPlayers.slice(0,10);
    let i = 1;
    allTimeScoreBoard.innerHTML = allPlayers.map(player => {
        return `<tr>
                <td>${i++}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            </tr>`
    }).join("");
}

function endGame() {
    timeUp = true;
    started = false;
    scoreBoard.textContent = `0`;
    setTimeout(updateScoreBoard, 5100);
}

function updateScoreBoard(){
    allPlayers.push(currentPlayer);
    populateAllScoreBoard();
    localStorage.setItem("items", JSON.stringify(allPlayers));
}
