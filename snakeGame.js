let type;
var keyPressed = null;

window.addEventListener("keydown", checkKey, false);

window.addEventListener('DOMContentLoaded', () => {
    reset();
});

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
};

async function reset() {

    let random = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
    while (random[0] === random[1]) random[1] = Math.floor(Math.random() * 100);

    const gameBoard = document.getElementsByClassName('game-board')[0];
    let child = gameBoard.firstChild
    while(child) {
        gameBoard.removeChild(child);
        child = gameBoard.firstChild;
    };

    for (let i = 0; i < 100; i++) {
        window.localStorage.removeItem(`rectangle${i}`);
        let rectangle = document.createElement('div'); rectangle.id = `rectangle${i}`; rectangle.className = "grid-item";
        if (i === random[0]) rectangle.classList.add('snake'); type = 'snake';
        if (i === random[1]) rectangle.classList.add('food'); type = 'food';
        if (i !== random[0] && i !== random[1]) rectangle.classList.add('empty'); type = 'empty';
        localStorage.setItem(`rectangle${i}`, JSON.stringify({ id: i.toString(16), type }));
        gameBoard.appendChild(rectangle);
    }
    localStorage.setItem(`size`, 1);
    await gameInit();
};

function gameInit() {
    let snake = localStorage.getItem(document.getElementsByClassName('snake')[0].id);
    let food = localStorage.getItem(document.getElementsByClassName('food')[0].id);
    let snakeSize = JSON.parse(localStorage.getItem(`size`));
    var edgeL = []; var edgeR = [];

    for (i = 0; i < 10; i++) {
        edgeL.push(i*10); edgeR.push(i*10+9); 
    }

    var runningGame = setInterval(async () => {
        if (keyPressed === 'w' || keyPressed === 'a' || keyPressed === 's' || keyPressed === 'd') {
            var { newValue, newRectangle, oldRectangle } = move(keyPressed);
        
            if (newValue < 0 && keyPressed == 'w') {
                snakeSize = 0;
                localStorage.setItem(`size`, snakeSize);
                await updateSnake(oldRectangle);
                await alert('Game Over')
                return await clearInterval(runningGame);
            };

            if (newRectangle > 99  && keyPressed == 's') {
                snakeSize = 0;
                localStorage.setItem(`size`, snakeSize);
                await updateSnake(oldRectangle);
                await alert('Game Over')
                return await clearInterval(runningGame);
            };

            if (edgeR.includes(newValue-1) && keyPressed == 'd') {
                snakeSize = 0;
                localStorage.setItem(`size`, snakeSize);
                await updateSnake(newRectangle, oldRectangle);
                await alert('Game Over')
                return await clearInterval(runningGame);
            };

            if (edgeL.includes(newValue+1) && keyPressed == 'a') {
                snakeSize = 0;
                localStorage.setItem(`size`, snakeSize);
                await updateSnake(newRectangle, oldRectangle);
                await alert('Game Over')
                return await clearInterval(runningGame);
            };

            if (localStorage.getItem(newRectangle.id) == localStorage.getItem(document.getElementsByClassName('food')[0].id)) {
                snakeSize++; 
                localStorage.setItem(`size`, snakeSize);
                random = Math.floor(Math.random() * 100);
                while (localStorage.getItem(newRectangle.id) == random) {
                    random = Math.floor(Math.random() * 100);
                };
                oldRectangle.classList.remove('snake'); oldRectangle.classList.add('empty');
                newRectangle.classList.add('snake');  newRectangle.classList.remove('food');
                document.getElementById(`rectangle${random}`).classList.add('food');
                localStorage.setItem(`rectangle${random}`, JSON.stringify({ id: random.toString(16), type: 'food' }));
                localStorage.setItem(newRectangle.id, JSON.stringify({ id: newRectangle.id.toString(16), type: 'snake' }));
                localStorage.setItem(oldRectangle.id, JSON.stringify({ id: oldRectangle.id.toString(16), type: 'empty' }));
            };
        };
    }, 200)

    if (snakeSize <= 0) return;
};

function checkKey(e) {
    keyCode = e.keyCode

    switch (keyCode) {
        case 87 || 38: //w
            keyPressed = 'w'
            break;
        case 65 || 37: //a
            keyPressed = 'a'
            break;
        case 83 || 40: //s
            keyPressed = 's'
            break;
        case 68 || 39: //d
            keyPressed = 'd'
          break;
    }
};

function move(direction) {
    let step;
    if (!direction) direction = null;

    switch (direction) {
        case 'w':
            step = -10;
            break;
        case 'a':
            step = -1;
            break;
        case 's':
            step = 10;
            break;
        case 'd':
            step = 1;
            break;
    }

    let oldRectangle = document.getElementsByClassName('snake')[0]; let oldValue = parseInt(oldRectangle.id.toString().replace(/\D/g,''));
    newValue = oldValue + step;
    newRectangle = document.getElementById(`rectangle${newValue}`);
    updateSnake(oldRectangle, newRectangle)

    return {
        newValue,
        newRectangle,
        oldRectangle
    };
};

function updateSnake(Block1, Block2) { 

    if(!Block2) {
        Block1.classList.add('snake');  Block1.classList.remove('empty');
    } else {
        Block1.classList.remove('snake'); Block1.classList.add('empty');
        Block2.classList.add('snake');  Block2.classList.remove('empty');
        Block1Value = parseInt(Block1.id.toString().replace(/\D/g,''));
        Block2Value = parseInt(Block2.id.toString().replace(/\D/g,''));
        localStorage.setItem(`${Block1.id}`, JSON.stringify({ id: Block1Value.toString(16), type: 'empty' }));
        localStorage.setItem(`${Block2.id}`, JSON.stringify({ id: Block1Value.toString(16), type: 'snake' }));
        
    }
};