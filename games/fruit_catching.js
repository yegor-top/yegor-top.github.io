const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const resetButton = document.getElementById("resetButton");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 50;
let player, apples, obstacles, score, gameOver;

// Load personal high score
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

const userId = getUserId();
let highScore = localStorage.getItem(`highScore_${userId}`)
    ? parseInt(localStorage.getItem(`highScore_${userId}`))
    : 0;

function initGame() {
    player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - groundHeight - 50,
        width: 50,
        height: 50,
        color: "red",
        speed: 5,
        dx: 0
    };
    apples = [];
    obstacles = [];
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = `Score: 0 | High Score: ${highScore}`;
    gameOverText.style.display = "none";
    resetButton.style.display = "none";
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
    ctx.fillStyle = "#654321";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function drawApples() {
    ctx.fillStyle = "green";
    apples.forEach(apple => {
        ctx.beginPath();
        ctx.arc(apple.x, apple.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawObstacles() {
    ctx.fillStyle = "black";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 40, 40);
    });
}

function updateApples() {
    apples.forEach((apple, index) => {
        apple.y += apple.speed;
        if (apple.y > canvas.height - groundHeight) {
            apples.splice(index, 1);
        }
        if (
            apple.y + 20 > player.y &&
            apple.x > player.x &&
            apple.x < player.x + player.width
        ) {
            apples.splice(index, 1);
            score++;
            scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
        }
    });
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        if (obstacle.y > canvas.height - groundHeight) {
            obstacles.splice(index, 1);
        }
        if (
            obstacle.y + 40 > player.y &&
            obstacle.x < player.x + player.width &&
            obstacle.x + 40 > player.x
        ) {
            gameOver = true;
            gameOverText.style.display = "block";
            resetButton.style.display = "block";
            if (score > highScore) {
                highScore = score;
                localStorage.setItem(`highScore_${userId}`, highScore);
            }
            scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
        }
    });
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPlayer();
    drawApples();
    drawObstacles();
    movePlayer();
    updateApples();
    updateObstacles();
    requestAnimationFrame(update);
}

function spawnApple() {
    if (gameOver) return;
    const x = Math.random() * (canvas.width - 40) + 20;
    apples.push({ x, y: 0, speed: 2 + Math.random() * 3 });
    setTimeout(spawnApple, 1000);
}

function spawnObstacle() {
    if (gameOver) return;
    const x = Math.random() * (canvas.width - 40) + 20;
    obstacles.push({ x, y: 0, speed: 3 + Math.random() * 2 });
    setTimeout(spawnObstacle, 2000);
}

resetButton.addEventListener("click", () => {
    initGame();
    spawnApple();
    spawnObstacle();
    update();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height - groundHeight - 50;
});

initGame();
spawnApple();
spawnObstacle();
update();