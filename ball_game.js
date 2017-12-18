var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1
var dy = -2;
var ballRadius = 10;
var color = "#FF0000";
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
//Bricks dimensions and information
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var morePoints = 5;

for(var i = 0; i < brickRowCount; i++){
  bricks[i] = [];
  for(var j = 0; j < brickColumnCount; j++){
    bricks[i][j] = {x: 0, y: 0, status: true};
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  //auto pilot
  paddleX = x - paddleWidth/2;
  if(paddleX < 0){
    paddleX = 0;
  }else if(paddleX + paddleWidth > canvas.width){
    paddleX = canvas.width - paddleWidth;
  }
  //end of auto pilot
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks(){
  for(var i = 0; i < brickRowCount; i++){
    for(var j = 0; j < brickColumnCount; j++){
      if(bricks[i][j].status){
        bricks[i][j].x = (j*(brickWidth+brickPadding))+brickOffsetLeft;
        bricks[i][j].y = (i*(brickHeight+brickPadding))+brickOffsetTop;
        ctx.beginPath();
        ctx.rect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  brickCollision();
  checkCollision();
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
  x += dx;
  y += dy;
}

function checkCollision() {
  if (y + dy < ballRadius) {
    dy = -dy;
    changeColor();
  }else if(y + dy > canvas.height - ballRadius - paddleHeight){
    if(x + dx > paddleX && x + dx < paddleX + paddleWidth){
      dy = -dy
    }else if(y + dy > canvas.height - ballRadius){
      alert("GAME OVER");
      document.location.reload();
    }
  }
  if (x < ballRadius || x > canvas.width - ballRadius) {
    dx = -dx;
    changeColor();
  }
}

function brickCollision(){
  for(var i = 0; i < brickRowCount; i++){
    for(var j = 0; j < brickColumnCount; j++){
      var brick = bricks[i][j];
      if(brick.status
      && x > brick.x
      && x < brick.x + brickWidth
      && y - ballRadius < brick.y + brickHeight
      && y + ballRadius> brick.y){
        changeColor();
        dy = -dy;
        brick.status = false;
        score += morePoints;
        if(score / morePoints == brickColumnCount * brickRowCount){
          dy = 0;
          dx = 0;
          alert("You win!");
          document.location.reload();
        }
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

//Picks random color
function changeColor() {
  var rColor = "#";
  var possible = 'ABCDEF0123456789';

  for (var i = 0; i < 6; i++) {
    rColor += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  color = rColor;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(draw, 10);