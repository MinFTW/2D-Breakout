const canvas = document.getElementById('app');
const ctx = canvas.getContext('2d');

const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
let PADDLE_X = (canvas.width - PADDLE_WIDTH) / 2;
const BRICK_ROW_COUNT = 3;
const BRICK_COLUMN_COUNT = 5;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

const bricks = [];
for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
  bricks[col] = [];
  for (let row = 0; row < BRICK_ROW_COUNT; row++) {
    bricks[col][row] = { x: 0, y: 0, status: 1 };
  }
}

const keyDownHandler = (event) => {
  if (event.key == 'Right' || event.key == 'ArrowRight') {
    rightPressed = true;
  } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
    leftPressed = true;
  }
};

const keyUpHandler = (event) => {
  if (event.key == 'Right' || event.key == 'ArrowRight') {
    rightPressed = false;
  } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
    leftPressed = false;
  }
};

function collisionDetection() {
  for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
      var brick = bricks[col][row];
      if (brick.status == 1) {
        if (
          x > brick.x &&
          x < brick.x + BRICK_WIDTH &&
          y > brick.y &&
          y < brick.y + BRICK_HEIGHT
        ) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

const mouseMoveHandler = (event) => {
  let relativeX = event.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    PADDLE_X = relativeX - PADDLE_WIDTH / 2;
  }
};

const drawScore = () => {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
};

const drawLives = () => {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(
    PADDLE_X,
    canvas.height - PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (var col = 0; col < BRICK_COLUMN_COUNT; col++) {
    for (var row = 0; row < BRICK_ROW_COUNT; row++) {
      if (bricks[col][row].status == 1) {
        var brickX = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
        var brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
        bricks[col][row].x = brickX;
        bricks[col][row].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawBricks();
  collisionDetection();

  if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) {
    dx = -dx;
  }

  if (y + dy < BALL_RADIUS) {
    dy = -dy;
  } else if (y + dy > canvas.height - BALL_RADIUS) {
    if (x > PADDLE_X && x < PADDLE_X + PADDLE_WIDTH) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        PADDLE_X = (canvas.width - PADDLE_WIDTH) / 2;
      }
    }
  }

  if (rightPressed) {
    PADDLE_X += 7;
    if (PADDLE_X + PADDLE_WIDTH > canvas.width) {
      PADDLE_X = canvas.width - PADDLE_WIDTH;
    }
  } else if (leftPressed) {
    PADDLE_X -= 7;
    if (PADDLE_X < 0) {
      PADDLE_X = 0;
    }
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
