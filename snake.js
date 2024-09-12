const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerNameInput = document.getElementById('playerName');
const highScoreList = document.getElementById('highScoreList');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 }; // Corrected line without the extra ]
let dx = 1;
let dy = 0;
let score = 0;
let gameRunning = true; // Flag to check if the game is currently running

function drawGame() {
    if (gameRunning) {
        moveSnake();
        if (isGameOver()) {
            gameRunning = false;
            updateHighScores();
            alert('Game Over! Your score was ' + score + '. Press Space to restart.');
        } else {
            clearCanvas();
            drawFood();
            drawSnake();
            setTimeout(drawGame, 100);
        }
    }
}

function clearCanvas() {
    ctx.fillStyle = '#a3c9a8'; // Matches the canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize));
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            placeFood();
        }
    });
}

function isGameOver() {
    const head = snake[0];

    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;

    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    gameRunning = true;
    placeFood();
    drawGame();
}

function updateHighScores() {
    const playerName = playerNameInput.value || "Anonymous";
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Add the new score to the list
    highScores.push({ name: playerName, score: score });

    // Sort the scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 5 scores
    highScores.splice(5);

    // Save the updated high scores
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Display the high scores
    displayHighScores();
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScoreList.innerHTML = highScores
        .map(score => `<li>${score.name}: ${score.score}</li>`)
        .join('');
}

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 32: // Space bar
            if (!gameRunning) {
                resetGame();
            }
            break;
        case 37: // Left arrow
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 38: // Up arrow
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 39: // Right arrow
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
        case 40: // Down arrow
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
    }
});

// Initialize the game
displayHighScores();
drawGame();
