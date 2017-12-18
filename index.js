var ballX = 75; //position of where ball starts off if not reset (75,57)
var ballSpeedX = 7;
var ballY = 75; 
var ballSpeedY = 5;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP =2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS); //how many total bricks we have
var bricksLeft = 0;



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

    //Cheat or hack to test ball in any position
    // ballX = mouseX; 
    // ballY = mouseY;
    // ballSpeedX = 4; //to the right
    // ballSpeedY = -4; //up/down
}

function brickReset(){
    bricksLeft = 0; 
    var i;
    //for first 3 rows of brick columns set them to false
    //for all the ones after that we're going to make them true
    for (i=0;i < 3*BRICK_COLS; i++) {
        brickGrid[i] = false;
    }
    for (;i<BRICK_COLS * BRICK_ROWS; i++) {
        // if(Math.random() <0.5){
            brickGrid[i] =true; 
            bricksLeft++;
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

function ballMove(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX <0 && ballSpeedX <0.0){ //left side
        ballSpeedX *= -1;
    }

    if(ballX > canvas.width && ballSpeedX > 0.0){//right side
        ballSpeedX *= -1;
    }

    if(ballY <0  && ballSpeedY <0.0 ){ //top edge 
        ballSpeedY *= -1;
    }

    if(ballY > canvas.height){ //bottom 
        ballReset();
        brickReset(); 
    }
}

function isBrickAtColRow(col, row){
    var brickIndexUnderCoord = rowColToArrayIndex(col, row);
    if (col >= 0 && col <BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS ) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false; 
    }
    
}

function ballBrickHandling(){
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);  
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    //this makes it so that if the ball touches the middle of side of a brick on 1 row and another (i.e. side of 9, it doesn't just eliminate brick 8 automatically),it won't eliminate anything. This if function makes it so that only things seen towards the inside will be eliminated. 
    
    if(brickIndexUnderBall >=0 && 
        ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow <BRICK_ROWS) {
            
            if(isBrickAtColRow(ballBrickCol, ballBrickRow)){
                brickGrid[brickIndexUnderBall] = false;
                bricksLeft--;
                // console.log(bricksLeft);

                var prevBallX = ballX - ballSpeedX; 
                var prevBallY = ballY - ballSpeedY; 
                var prevBrickCol = Math.floor(prevBallX/ BRICK_W); //forumla bc we need a whole#
                var prevBrickRow = Math.floor(prevBallY / BRICK_H);
                
                var bothTestsFailed = true; 

                if (prevBrickCol != ballBrickCol){
                    if(isBrickAtColRow(prevBrickCol, ballBrickRow) ==false) {
                        ballSpeedX *= -1;   
                        bothTestsFailed = false; 
                    }
                }
                if (prevBrickRow != ballBrickRow){
                    if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false){
                        ballSpeedY *= -1;   
                        bothTestsFailed = false;
                    }
                }

                if(bothTestsFailed) { //armpit case for blocks--prevents ball from going right through.
                    ballSpeedX *= -1; 
                    ballSpeedY *= -1;

                }
                
            } //end of brick found
        } // end of valid col and row
} //end of ballBrickHandling function 

function ballPaddleHandling(){
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
           if(bricksLeft ==0){
               brickReset();
           }//out of bricks
       }//ball center inside paddle
} //end of ballPaddleHandling()

function moveAll() {
    ballMove(); // the ball is moving 
    ballBrickHandling(); // handling ball brick collision
    ballPaddleHandling(); //handling ball handling collision 
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
                    BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP, 'pink');
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