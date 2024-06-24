// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

const grid = 20;
let count = 0;
let score = 0;
let snake = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: getRandomInt(0, 20) * grid,
    y: getRandomInt(0, 20) * grid
};
let touchX = 0;
let touchY = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    snake.x = canvas.width / 2;
    snake.y = canvas.height / 2;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
    score = 0;
    scoreElement.textContent = score;
    gameOverSound.play();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (++count < 4) {
        return;
    }
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        resetGame();
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    ctx.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            scoreElement.textContent = score;
            eatSound.play();
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });
}

function handleTouchStart(evt) {
    const touch = evt.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
}

function handleTouchMove(evt) {
    const touch = evt.touches[0];
    const dx = touch.clientX - touchX;
    const dy = touch.clientY - touchY;

    if (Math.abs(dx) > Math.abs(dy)) {
        snake.dx = dx > 0 ? grid : -grid;
        snake.dy = 0;
    } else {
        snake.dy = dy > 0 ? grid : -grid;
        snake.dx = 0;
    }

    touchX = touch.clientX;
    touchY = touch.clientY;
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

resetGame();
requestAnimationFrame(gameLoop);
