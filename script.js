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

let spaceship, gun, bullets, enemies, gifts, lives, gameOver, score, level;

function resetGame() {
  spaceship = { x: canvas.width / 2 - 50, y: canvas.height - 70, width: 120, height: 70 };
  gun = { x: spaceship.x + spaceship.width / 2 - 5, y: spaceship.y - 10, width: 10, height: 30 };
  bullets = [];
  enemies = [];
  gifts = [];
  lives = 3;
  gameOver = false;
  score = 0;
  level = 1;

  document.getElementById("restartButton").style.display = "none";
  updateGame();
}

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

  ctx.drawImage(tankImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
  ctx.fillStyle = "black";
  ctx.fillRect(gun.x, gun.y, gun.width, gun.height);

  moveSpaceship();
  fireBullet();
  updateBullets();

  createEnemy();
  enemies = enemies.filter((enemy) => enemy.y < canvas.height);
  enemies.forEach((enemy, index) => {
    enemy.y += 2 + level * 0.5;
    ctx.drawImage(alienImg, enemy.x, enemy.y, enemy.width, enemy.height);

    if (checkCollision(spaceship, enemy)) {
      lives--;
      enemies.splice(index, 1);
      if (lives === 0) {
        endGame();
      }
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (checkCollision(bullet, enemy)) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(index, 1);
        score += 10;
        if (score % 50 === 0) level++;
      }
    });
  });

  createGift();
  gifts = gifts.filter((gift) => gift.y < canvas.height);
  gifts.forEach((gift, index) => {
    gift.y += 3;
    ctx.drawImage(giftImg, gift.x, gift.y, gift.width, gift.height);

    if (checkCollision(spaceship, gift)) {
      if (lives < 5) {
        lives++;
      }
      gifts.splice(index, 1);
    }
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  

  for (let i = 0; i < lives; i++) {
    ctx.drawImage(heartImg, 20 + i * 30, 70, 25, 25);
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 30);
  document.getElementById("restartButton").style.display = "block";
}

// ** HTML मध्ये Restart बटण जोडा **
const restartButton = document.createElement("button");
restartButton.id = "restartButton";
restartButton.innerText = "Restart Game";
restartButton.style.position = "absolute";
restartButton.style.top = "50%";
restartButton.style.left = "50%";
restartButton.style.transform = "translate(-50%, -50%)";
restartButton.style.padding = "10px 20px";
restartButton.style.fontSize = "20px";
restartButton.style.background = "red";
restartButton.style.color = "white";
restartButton.style.border = "none";
restartButton.style.cursor = "pointer";
restartButton.style.display = "none";
document.body.appendChild(restartButton);

restartButton.addEventListener("click", resetGame);

resetGame();
