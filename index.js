var ballX = 75; //position of where ball starts off if not reset (75,57)
var ballSpeedX = 5;
var ballY = 75; 
var ballSpeedY = 5;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP =2;
const BRICK_COLS = 10;
const BRICK_ROWS =14; 
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS); //how many total bricks we have



const PADDLE_WIDTH = 100; 
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE =60;
var paddleX = 400;

var canvas, canvasContext; 

var mouseX =0; 
var mouseY=0; 

function updateMousePos(event){

    //javascript 
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement; 

    mouseX = event.clientX - rect.left - root.scrollLeft; 
    mouseY = event.clientY - rect.left - root.scrollTop;

    // var mouseX = event.clientX; 

    paddleX = mouseX- PADDLE_WIDTH/2;
}

function brickReset(){
    for (var i=0; i<BRICK_COLS * BRICK_ROWS; i++) {
        // if(Math.random() <0.5){
            brickGrid[i] =true; 
        // } else {
        //     brickGrid[i] = false; 
        // }// end of else (random check)
       
    }//end of for each brick

    // brickGrid[19]= false;
} // end of brickReset function

window.onload =function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30; 
    setInterval(updateAll, 1000/framesPerSecond);//30 times per second

    canvas,addEventListener('mousemove', updateMousePos);

    brickReset();
    ballReset(); //so the ball will start below the blue grid 
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

    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);  
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    //this makes it so that if the ball touches the middle of side of a brick on 1 row and another (i.e. side of 9, it doesn't just eliminate brick 8 automatically),it won't eliminate anything. This if function makes it so that only things seen towards the inside will be eliminated. 
    
    if(brickIndexUnderBall >=0 && 
        ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow <BRICK_ROWS) {
            
            if(brickGrid[brickIndexUnderBall]){
                brickGrid[brickIndexUnderBall] = false;
                ballSpeedY *= -1;   
            } 
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

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row; 
}

function drawBricks() {
    // if(brickGrid[0]){
    // colorRect(BRICK_W*0,0, BRICK_W-2,BRICK_H, 'blue');
    // }

    // if(brickGrid[1]){
    // colorRect(BRICK_W*1,0, BRICK_W-2,BRICK_H, 'blue');
    // }
    
    // if(brickGrid[2]){
    // colorRect(BRICK_W*2,0, BRICK_W-2,BRICK_H, 'blue');
    // }

    // if(brickGrid[3]){
    // colorRect(BRICK_W*3,0, BRICK_W-2,BRICK_H, 'blue');
    // }

    //we defined BRICK_COUNT above as 4! 

    for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++){
        for (var eachCol =0; eachCol<BRICK_COLS; eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 

            if(brickGrid[arrayIndex]){
                colorRect(BRICK_W*eachCol,BRICK_H*eachRow, 
                    BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP, 'blue');
            } //end of is this brick here?
        } // end of for each brick
    } // end of for rows loop

} // end of drawBricks function

function drawAll() {
    colorRect(0,0,canvas.width, canvas.height,'black'); //clear Screen
    colorCircle(ballX,ballY, 10, 'white'); //draw ball
    colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, 
                       PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

    drawBricks();
    


    //HOW COORDINATES OF MOUSE SHOW UP!
    // colorText(mouseBrickCol+","+mouseBrickRow+":"+brickIndexUnderMouse, 
    //           mouseX,mouseY, 'yellow' );
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

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor; 
    canvasContext.fillText(showWords, textX, textY);
}