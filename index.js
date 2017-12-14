var ballX = 75; 
var ballSpeedX = 5;
var ballY = 75; 
var ballSpeedY = 5;
var canvas, canvasContext; 

const PADDLE_WIDTH = 100; 
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE =60;
var paddleX = 400;

function updateMousePos(event){

    //javascript 
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement; 

    var mouseX = event.clientX - rect.left - root.scrollLeft; 
    // var mouseY = event.clientY - rect.left - root.scrollTop;

    var mouseX = event.clientX; 

    paddleX = mouseX- PADDLE_WIDTH/2;
}

window.onload =function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30; 
    setInterval(updateAll, 1000/framesPerSecond);//30 times per second

    canvas,addEventListener('mousemove', updateMousePos);
}

function updateAll() {
    moveAll(); 
    drawAll();
}

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}


function moveAll() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX <0){ //left side
        ballSpeedX *= -1;
    }

    if(ballX > canvas.width){//right side
        ballSpeedX *= -1;
    }

    if(ballY <0){ //top edge 
        ballSpeedY *= -1;
    }

    if(ballY > canvas.height){ //bottom 
        ballReset();
    }

    var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE; 
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS; 
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH; 
    if(ballY > paddleTopEdgeY && //below the top of paddle
       ballY < paddleBottomEdgeY && //above bottom of paddle
       ballX > paddleLeftEdgeX && //right of the left side of the paddle       
       ballX < paddleRightEdgeX)//left of the right side of the paddle 
       { 
           ballSpeedY *= -1;

           var centerOfPaddleX = paddleX + PADDLE_WIDTH/2; 
           var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
           ballSpeedX = ballDistFromPaddleCenterX * 0.35; //between 0-1 to make it less steep

       }
}

function drawAll() {
    colorRect(0,0,canvas.width, canvas.height,'black'); //clear Screen
    colorCircle(ballX,ballY, 10, 'white'); //draw ball
    colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, 
                       PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
}

function colorRect(topLeftX, topLeftY, boxWidth,boxHeight, fillColor){
    canvasContext.fillStyle = fillColor; 
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth,boxHeight);

}

function colorCircle(centerX,centerY, radius, fillColor){
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath(); //This line makes it so that the ball looks like a ball and not a line
    canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
    canvasContext.fill();
}