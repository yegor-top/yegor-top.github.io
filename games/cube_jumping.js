const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerX = 200;
let playerY = canvas.height - 100;
let gravity = 0.5;
let jumpPower = -18; // Constant jump power
let isJumping = false;
let playerVelocityY = 0;
let groundHeight = 50;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

let blocks = [
    { x: 0, y: canvas.height - groundHeight, width: canvas.width, height: groundHeight }
];

let obstacles = [];
let obstacleSpeed = 3;
let obstacleSize = 50;

let stars = [];
let starSize = 40;
let starSpeed = 3;
let starImage = new Image();
starImage.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Full_Star_Yellow.svg';

let blockSpeed = 2;
let blockOffset = 0;

let clouds = [];
let cloudSpeed = 1;

let speedMultiplier = 1;
const speedIncrementInterval = 10000; // 10 секунд

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawPlayer();
    drawBlocks();
    drawObstacles();
    drawStars();
    drawClouds();
    checkCollisions();
    updateScore();

    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    playerVelocityY += gravity; // Убираем влияние speedMultiplier на гравитацию
    playerY += playerVelocityY;

    if (playerY >= canvas.height - groundHeight - 50) {
        playerY = canvas.height - groundHeight - 50;
        isJumping = false;
        playerVelocityY = 0;
    }

    if ((keys[' '] || keys['ArrowUp']) && !isJumping) {
        isJumping = true;
        playerVelocityY = jumpPower; // Высота прыжка остаётся постоянной
    }

    blockOffset -= blockSpeed * speedMultiplier;
    if (blockOffset <= -canvas.width) {
        blockOffset = 0;
    }
}

function drawPlayer() {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(playerX, playerY, 50, 50);
}

function drawBlocks() {
    ctx.fillStyle = '#654321';
    blocks.forEach(block => {
        ctx.fillRect(block.x + blockOffset, block.y, block.width, block.height);
        ctx.fillRect(block.x + blockOffset + canvas.width, block.y, block.width, block.height);
    });
}

function createObstacleAndStar() {
    if (Math.random() < 0.02) {
        let height = canvas.height - groundHeight - obstacleSize;
        let isSquare = Math.random() > 0.5;
        obstacles.push({
            x: canvas.width,
            y: height,
            size: obstacleSize,
            type: isSquare ? 'square' : 'triangle'
        });
        if (Math.random() < 0.5) {
            stars.push({
                x: canvas.width,
                y: height - 60
            });
        }
    }
}

function createClouds() {
    if (Math.random() < 0.02) {
        let cloudY = Math.random() * (canvas.height / 2);
        clouds.push({
            x: canvas.width,
            y: cloudY,
            size: Math.random() * 30 + 50
        });
    }
}

function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed * speedMultiplier;

        if (obstacle.type === 'square') {
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        } else {
            ctx.fillStyle = '#0000FF';
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.size, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.size / 2, obstacle.y - obstacle.size + 10);
            ctx.closePath();
            ctx.fill();
        }

        if (obstacle.x + obstacle.size < 0) obstacles.splice(index, 1);
    });
}

function drawStars() {
    stars.forEach((star, index) => {
        star.x -= starSpeed * speedMultiplier;
        ctx.drawImage(starImage, star.x - starSize / 2, star.y - starSize / 2, starSize, starSize);
        if (star.x + starSize < 0) stars.splice(index, 1);
    });
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    clouds.forEach((cloud, index) => {
        cloud.x -= cloudSpeed * speedMultiplier;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();

        if (cloud.x + cloud.size < 0) clouds.splice(index, 1);
    });
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'square') {
            if (
                playerX + 50 > obstacle.x &&
                playerX < obstacle.x + obstacle.size &&
                playerY + 50 > obstacle.y &&
                playerY < obstacle.y + obstacle.size
            ) {
                gameOver();
            }
        } else {
            if (
                playerX + 50 > obstacle.x &&
                playerX < obstacle.x + obstacle.size &&
                playerY + 50 > obstacle.y &&
                playerY < obstacle.y + obstacle.size
            ) {
                let triangleTopY = obstacle.y - obstacle.size + 10;

                if (playerY <= triangleTopY) {
                    gameOver();
                }
            }
        }
    });

    stars.forEach((star, index) => {
        if (
            playerX + 50 > star.x - starSize / 2 &&
            playerX < star.x + starSize / 2 &&
            playerY + 50 > star.y - starSize / 2 &&
            playerY < star.y + starSize / 2
        ) {
            stars.splice(index, 1);
            score += 1;
        }
    });
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('highScore').innerText = 'High Score: ' + highScore;
}

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        document.getElementById('gameOverText').style.display = 'block';
        document.getElementById('resetButton').style.display = 'block';

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
    }
}

function restartGame() {
    isGameOver = false;
    playerX = 200;
    playerY = canvas.height - 100;
    playerVelocityY = 0;
    isJumping = false;
    blockOffset = 0;
    obstacles = [];
    stars = [];
    clouds = [];
    score = 0;
    speedMultiplier = 1;
    document.getElementById('gameOverText').style.display = 'none';
    document.getElementById('resetButton').style.display = 'none';
    gameLoop();
}

let keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

document.getElementById('resetButton').addEventListener('click', restartGame);

setInterval(createObstacleAndStar, 100);
setInterval(createClouds, 100);

setInterval(() => {
    if (!isGameOver) {
        speedMultiplier *= 1.01;
    }
}, speedIncrementInterval);

gameLoop();