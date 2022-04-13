let width = 10;
let appleIndex = 0;
let direction = 1;

window.addEventListener("keydown", checkKey, false);

window.addEventListener('DOMContentLoaded', () => {
    reset();
});

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
};

function reset() {
    document.getElementById("resetModal").style.display = "none";
    score = 0;
    currentSnake = [41, 42];
    let random = Math.floor(Math.random() * 100);
    while (currentSnake.includes(random)) random = Math.floor(Math.random() * 100);

    const gameBoard = document.getElementsByClassName('game-board')[0];
    let child = gameBoard.firstChild
    while(child) {
        gameBoard.removeChild(child);
        child = gameBoard.firstChild;
    };

    for (let i = 0; i < 100; i++) {
        window.localStorage.removeItem(`rectangle${i}`);
        let rectangle = document.createElement('div'); rectangle.id = `rectangle${i}`; rectangle.className = "grid-item";
        if (i === random) rectangle.classList.add('food'); type = 'food';
        if (i !== random && !currentSnake.includes(i)) rectangle.classList.add('empty'); type = 'empty';
        if (currentSnake.includes(i)) rectangle.classList.add('snake'); type = 'snake';
        localStorage.setItem(`rectangle${i}`, JSON.stringify({ id: i, type }));
        gameBoard.appendChild(rectangle);
    }
    document.getElementById("startModal").style.display = "block";
};

function startGame() {
    document.getElementById("startModal").style.display = "none";
    direction = 1;
    edgeL = []; edgeR = [];

    for (i = 0; i < 10; i++) {
        edgeL.push(i*10); edgeR.push(i*10+9); 
    }

    runningGame = setInterval(async () => {
        moveOutcome();
    }, 200);
};

function checkKey(e) {
    keyCode = e.keyCode

    switch (keyCode) {
        case 87 || 38: //w
            direction = -width
            break;
        case 65 || 37: //a
            direction = -1
            break;
        case 83 || 40: //s
            direction = +width
            break;
        case 68 || 39: //d
            direction = 1
          break;
    };
};

async function moveOutcome() {
    let squares = document.getElementsByClassName('grid-item');
    if(checkForHits(squares)) {
        let modal = document.getElementById("resetModal");
        modal.style.display = "block";
        await clearInterval(runningGame);
        if(score > localStorage.getItem('highscore')) localStorage.setItem('highscore', score);
        replaceText('score', score);
        replaceText('highscore', localStorage.getItem('highscore'));
        return modal.style.display = "block";

    } else {
        moveSnake(squares);
    };
};

function checkForHits(squares) {
    if (
      (edgeR.includes(currentSnake[0]) && direction === 1) ||
      (edgeL.includes(currentSnake[0])  && direction === -1) ||
      ((currentSnake[0] + width) > 99 && direction === +width) ||
      (currentSnake[0] - width < 0 && direction === -width) 
    ) {
        return true;
    } else {
        return false;
    };
};

function randomApple(squares) {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add("food");
};

function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("food")) {
        squares[currentSnake[0]].classList.remove("food");
        squares[currentSnake[0]].classList.remove("empty");
        squares[currentSnake[0]].classList.add('snake');
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        randomApple(squares);
        score++;
    };
};

function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.add("empty");
    squares[tail].classList.remove("snake");
    currentSnake.unshift(currentSnake[0] + direction);
    eatApple(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
    squares[currentSnake[0]].classList.remove("empty");
};
