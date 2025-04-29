const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');

const grid = 20;
let snake, apple, count, speed, score;

function initGame() {
    snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    apple = {
        x: getRandomInt(0, 20) * grid,
        y: getRandomInt(0, 20) * grid
    };
    count = 0;
    score = 0;
    speed = parseInt(difficultySelect.value);
    updateScore();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateScore() {
    scoreDisplay.textContent = `分數：${score}`;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (++count < speed) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // 牆壁穿越
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // 畫蘋果
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // 畫蛇
    ctx.fillStyle = 'lime';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // 吃到蘋果
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            updateScore();
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        // 撞到自己
        if (snake.cells.length > 4) {
            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    alert(`💀 遊戲結束！你的分數是：${score}`);
                    initGame();  // 重開遊戲
                    return;
                }
            }
        }
    });
}

// 鍵盤操作
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// 按鈕重新開始
restartBtn.addEventListener('click', () => {
    initGame();
});

initGame();
requestAnimationFrame(gameLoop);
