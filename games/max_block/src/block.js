// 変数宣言
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hpElement = document.getElementById("hp");
const messageElement = document.getElementById("message");
const timerElement = document.getElementById("timer");
const resetButton = document.getElementById("resetButton");

const maxHp = 5;
document.getElementById("hpv").textContent = maxHp;
let balls, blocks, character, gameOver, gameStartTime;

const rows = 10;
const cols = 11;
const blockWidth = 60;
const blockHeight = 20;
const characterImage = new Image();
characterImage.src = "assets/mrK.png";

let isDragging = false;
let offsetX, offsetY;

// ループ保存用
let animationId;

const initGame = () => {
    // 前回のループを停止
    if (animationId) cancelAnimationFrame(animationId);
    balls = [];
    blocks = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            blocks.push({
                x: col * (blockWidth + 5) + 30,
                y: row * (blockHeight + 5) + 30,
                width: blockWidth,
                height: blockHeight,
                destroyed: false
            });
        }
    }
    character = { x: 300, y: 350, size: 30, isInvincible: false, isBlinking: false };
    gameOver = false;
    hp = maxHp;
    gameStartTime = Date.now();
    messageElement.textContent = "";
    updateHP();
    gameLoop();
};

const updateHP = () => {
    hpElement.style.height = (hp / maxHp) * 300 + "px";
    if (hp <= 0) {
        gameOver = true;
        messageElement.textContent = gameOverGoroku();
    }
    document.getElementById("hpv").textContent = hp;
};

const gameLoop = () => {
    // メインループ
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawCharacter();
    drawBalls();
    moveBalls();
    updateTimer();
    // ループ登録(IDはイベント抹消用に保存)
    animationId = requestAnimationFrame(gameLoop); 
};

const updateTimer = () => {
    const elapsedTime = (Date.now() - gameStartTime) / 1000;
    timerElement.textContent = `Time: ${elapsedTime.toFixed(2)}s`;
};

const drawBlocks = () => {
    ctx.fillStyle = "blue";
    blocks.forEach(block => {
        if (!block.destroyed) {
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    });
};

const drawCharacter = () => {
    if (!character.isBlinking || Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.drawImage(characterImage, character.x, character.y, character.size, character.size);
    }
};

const drawBalls = () => {
    ctx.fillStyle = "white";
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    });
};

const moveBalls = () => {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x <= 0 || ball.x >= canvas.width) ball.dx *= -1;
        if (ball.y <= 0 || ball.y >= canvas.height) ball.dy *= -1;

        if (!character.isInvincible && ball.x >= character.x &&
            ball.x <= character.x + character.size &&
            ball.y >= character.y &&
            ball.y <= character.y + character.size
        ) {
            // 玉にあたったらダメージをうける
            hp -= 1;
            updateHP();
            triggerInvincibility();
        }

        blocks.forEach(block => {
            if (!block.destroyed &&
                ball.x >= block.x &&
                ball.x <= block.x + block.width &&
                ball.y >= block.y &&
                ball.y <= block.y + block.height
            ) {
                ball.dy *= -1;
                block.destroyed = true;
                checkGameClear();
            }
        });
    });
};

const triggerInvincibility = () => {
    // ダメージうけたときに点滅
    character.isInvincible = true;
    character.isBlinking = true;
    setTimeout(() => {
        character.isBlinking = false;
        character.isInvincible = false;
    }, 1000);
};

const checkGameClear = () => {
    const allDestroyed = blocks.every(block => block.destroyed);
    if (allDestroyed) {
        gameOver = true;
        const elapsedTime = (Date.now() - gameStartTime) / 1000;

        messageElement.textContent = createGoroku(elapsedTime);
    }
};

// イベント登録
document.getElementById("game-container").addEventListener("keydown", e => {
    if (e.key === "w") {
        balls.push({ x: character.x + character.size / 2, y: character.y, radius: 5, dx: Math.random() * 4 - 2, dy: -4 });
    }
});

canvas.addEventListener("mousedown", e => {
    if (
        e.offsetX >= character.x &&
        e.offsetX <= character.x + character.size &&
        e.offsetY >= character.y &&
        e.offsetY <= character.y + character.size
    ) {
        isDragging = true;
        offsetX = e.offsetX - character.x;
        offsetY = e.offsetY - character.y;
    }
});

canvas.addEventListener("mousemove", e => {
    if (isDragging) {
        character.x = e.offsetX - offsetX;
        character.y = e.offsetY - offsetY;
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

resetButton.addEventListener("click", initGame);

initGame();

