const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tankImg = new Image();
tankImg.src = "580b.png"; 
const alienImg = new Image();
alienImg.src = "5f5662eb5ce3ee00048bd136.png";
const heartImg = new Image();
heartImg.src = "heart.png"; 
const giftImg = new Image();
giftImg.src = "gift.png"; 

let spaceship = { x: canvas.width / 2 - 50, y: canvas.height - 70, width: 120, height: 70 }; 
let gun = { x: spaceship.x + spaceship.width / 2 - 5, y: spaceship.y - 10, width: 10, height: 30 }; 
let bullets = [];
let enemies = [];
let gifts = [];
let score = 0;
let level = 1;
let lives = 3;
let gameOver = false;
let tankDestroyed = false;

const keys = { left: false, right: false, enter: false };

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "Enter") keys.enter = true;
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "Enter") keys.enter = false;
});

function moveSpaceship() {
  if (keys.left && spaceship.x > 0) spaceship.x -= 5;
  if (keys.right && spaceship.x < canvas.width - spaceship.width) spaceship.x += 5;

  gun.x = spaceship.x + spaceship.width / 2 - gun.width / 2;
}

let canFire = true;
function fireBullet() {
  if (keys.enter && canFire) {
    bullets.push({ x: gun.x + gun.width / 2 - 2, y: gun.y, width: 10, height: 20 });
    canFire = false;
  }
}
window.addEventListener("keyup", (e) => {
  if (e.key === "Enter") canFire = true;
});

function updateBullets() {
  bullets = bullets.filter((bullet) => bullet.y > 0);
  bullets.forEach((bullet) => {
    bullet.y -= 7;

    ctx.fillStyle = "gold";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function createEnemy() {
  if (Math.random() < 0.02) {
    enemies.push({
      x: Math.random() * (canvas.width - 40),
      y: 0,
      width: 40,
      height: 40,
    });
  }
}

function createGift() {
  if (Math.random() < 0.005) {
    gifts.push({
      x: Math.random() * (canvas.width - 40),
      y: 0,
      width: 40,
      height: 40,
    });
  }
}

function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function updateGame() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!tankDestroyed) {
    ctx.drawImage(tankImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Tank Destroyed!", canvas.width / 2 - 100, canvas.height / 2 - 30);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.style.position = "absolute";
    restartButton.style.top = `${canvas.height / 2}px`;
    restartButton.style.left = `${canvas.width / 2 - 50}px`;
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "16px";
    document.body.appendChild(restartButton);

    restartButton.addEventListener("click", () => {
      document.body.removeChild(restartButton);
      restartGame();
    });

    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(gun.x, gun.y, gun.width, gun.height);

  moveSpaceship();

  fireBullet();
  updateBullets();

  createEnemy();
  enemies = enemies.filter((enemy) => enemy.y < canvas.height);
  enemies.forEach((enemy) => {
    enemy.y += 2 + level * 0.5;
    ctx.drawImage(alienImg, enemy.x, enemy.y, enemy.width, enemy.height);

    if (checkCollision(spaceship, enemy)) {
      tankDestroyed = true;
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (checkCollision(bullet, enemy)) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemies.indexOf(enemy), 1);
        score += 10;
        if (score % 50 === 0) level++;
      }
    });
  });

  createGift();
  gifts = gifts.filter((gift) => gift.y < canvas.height);
  gifts.forEach((gift) => {
    gift.y += 3;
    ctx.drawImage(giftImg, gift.x, gift.y, gift.width, gift.height);

    if (checkCollision(spaceship, gift)) {
      if (lives < 5) {
        lives++;
      }
      gifts.splice(gifts.indexOf(gift), 1);
    }
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Level: ${level}`, 20, 60);

  for (let i = 0; i < lives; i++) {
    ctx.drawImage(heartImg, 20 + i * 30, 70, 25, 25);
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
  score = 0;
  level = 1;
  lives = 3;
  gameOver = false;
  tankDestroyed = false;
  enemies = [];
  bullets = [];
  gifts = [];
  updateGame();
}

updateGame();
