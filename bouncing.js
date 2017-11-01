// helper functions. NOT part of the answer
var canvas = document.getElementById("canV"); 
var ctx = canvas.getContext("2d");
var mouseButton = 0;
canvas.addEventListener('mousedown',function(event){mouseButton = event.which;});
canvas.addEventListener('mouseup'  ,function(){mouseButton = 0;});
canvas.addEventListener("contextmenu", function(e){ e.preventDefault();}, false);
var currentSurface = ctx;
var createImage = function (w, h) {// create an canvas image of size w,h and attach context 2d
    var image = document.createElement("canvas");  
    image.width = w;
    image.height = h !== undefined?h:w; 
    currentSurface = image.ctx = image.getContext("2d"); 
    return image;
}  
var setColour = function (fillC, strokeC, lineW) { 
    currentSurface.fillStyle = fillC !== undefined ? fillC : currentSurface.fillStyle;
    currentSurface.strokeStyle = strokeC !== undefined ? strokeC : currentSurface.strokeStyle;
    currentSurface.lineWidth = lineW !== undefined ? lineW : currentSurface.lineWidth;
}
var circle = function(x,y,r,how){
    currentSurface.beginPath();
    currentSurface.arc(x,y,r,0,Math.PI*2);
    how = how.toLowerCase().replace(/[os]/g,"l"); // how to draw
    switch(how){
        case "f":  // fill
            currentSurface.fill();
            break;
        case "l":
            currentSurface.stroke();
            break;
        case "lf":
            currentSurface.stroke();
            currentSurface.fill();
            break;
        case "fl":
            currentSurface.fill();
            currentSurface.stroke();
            break;
    }
}
function createGradImage(size,col1,col2){
    var image = createImage(size);
    var g = currentSurface.createLinearGradient(0,0,0,currentSurface.canvas.height);
    g.addColorStop(0,col1);
    g.addColorStop(1,col2);
    currentSurface.fillStyle = g;
    currentSurface.fillRect(0,0,currentSurface.canvas.width,currentSurface.canvas.height);    
    return image;
}
function createColouredBall (ballR,col) {
    var ball = createImage(ballR*2);
    var unit = ballR/100;
    setColour("black");
    circle(ballR,ballR,ballR,"f");
    setColour("hsl("+col+",100%,30%)");
    circle(ballR-unit*3,ballR-unit*3,ballR-unit*7,"f");
    setColour("hsl("+col+",100%,50%)");
    circle(ballR-unit*10,ballR-unit*10,ballR-unit*16,"f");
    setColour("White");
    circle(ballR-unit*50,ballR-unit*50,unit*16,"f");
    
    return ball;
}
//===================================    
//    _                          
//   /_\  _ _  ____ __ _____ _ _ 
//  / _ \| ' \(_-< V  V / -_) '_|
// /_/ \_\_||_/__/\_/\_/\___|_|  
//                              
// ==================================
// Answer code

// lazy coder variables
var w = canvas.width;
var h = canvas.height;

// ball is simulated 5cm 
var pixSize = 0.24; // in millimeters for simulation

// Gravity is 9.8 ms^2 so convert to pixels per frame squared
// Assuming constant 60 frames per second. ()
var gravity = 9800*pixSize/60; 
gravity *= 0.101; // because Earth's gravity is stupidly large let's move to Pluto

// ball 5cm 
var ballR = (25/pixSize)/2;          // radius is 2.5cm for 5cm diamiter ball
var ballX = w/2;                     // get center of canvas
var ballY = ballR+3;                 // start at the top
var ballDX = (Math.random()-0.5)*15; // start with random x speed
ballDX += ballDX < 0 ? -5 : 5;       // make sure it's not too slow
var ballDY = 0;                      // star with no downward speed;
var ballLastX = ballX;
var ballLastY = ballY;

//create an image of the Ball
var ball = createColouredBall(ballR,Math.floor(Math.random()*360)); // create an image of ball

// create a background. Image is small as it does not have much detail in it
var background = createGradImage(16,"#5af","#08C");
// time to run for


// Function to draw ball without motion blur
// draws the ball with out motion blurred. 
// image is the image to draw
// px and py are the x and y position to draw the ball
var drawImage = function(image , px, py){
    ctx.drawImage(image, px, py);
}


// draws the ball motion blurred. This introduces extra complexity
var drawMotionBlur = function(image, px, py, dx, dy, steps){
    var i, sx, sy;
    sx = dx / steps;
    sy = dy / steps;
    px -= dx; // move back to start position
    py -= dy; 
    ctx.globalAlpha = 1 / (steps * 0.8); // set alpha to slightly higher for each step
    for(i = 0; i < steps; i+= 1){
        ctx.drawImage(image, px + i * sx, py + i * sy);
    }
    ctx.globalAlpha = 1; // reset alpha
    
}
// style for text
ctx.fillStyle = "white";
ctx.strokeStyle = "black";
ctx.textAlign = "center";
ctx.lineJoin = "round"; // stop some letters getting ears.
ctx.lineWidth = 3;
ctx.textBaseline = "bottom";
var textCenterX = w/2;
var maxHeight = Infinity;
var lastMaxHeight = ballY;
var slowMotion = false;  // slow motion flag
var frameTravel = true;  // use frame travel in collision test 
const bSteps = 10;  // the fixed motion blur steps
var update = function(){
    var str, blurSteps;
    blurSteps = 10;  // motion blur ball render steps. This varies depending on the the collision inter frame time. 
     
    if(mouseButton === 1){
        slowMotion = ! slowMotion;
        mouseButton = 0;
    }
    if(mouseButton === 3){
        frameTravel = ! frameTravel;
        ballX = w / 2;                     // get center of canvas
        ballY = ballR + 3;                 // start at the top
        ballDY = 0;                      // start at 0 y speed
        mouseButton = 0;
    }
    // clear the canvas with background canvas image
    ctx.drawImage(background, 0, 0, w, h);
    
    ballDY += gravity; // acceleration due to grav
    // add deltas to ball position
    ballX += ballDX; 
    ballY += ballDY;
    // test for collision on left and right walls. Need to 
    // adjust for motion blur
    if (ballX < ballR) {
        ballDX = -ballDX; // refect delta x
        if (frameTravel) { // if using frame travel time
            // blur the outward traveling ball only for the time it has been traveling away
            blurSteps = Math.ceil(10 * ((ballX - ballR) / -ballDX));
            // get position it should have traveled since
            ballX -= (ballX - ballR) * 2;
        }else{
            ballX = ballR; // move ball to touching wall
            blurSteps = 1; // there is no outward motion
        }
    } else
    if (ballX > w - ballR) {
        ballDX = -ballDX;
        if (frameTravel) { // if using frame travel time
            // blur the outward traveling ball only for the time it has been traveling away
            blurSteps = Math.ceil(10 * ((ballX - (w - ballR)) / -ballDX));
            ballX -= (ballX - (w - ballR)) * 2;
        }else{
            ballX = w - ballR; // move ball to touching wall
            blurSteps = 1; // there is no outward motion
        }
    }

    // Test ball hit ground
    if (ballY > h - ballR) {
        ballDY = -ballDY;
        // to show max height
        lastMaxHeight = maxHeight;
        maxHeight = Infinity;
        if (frameTravel) { // if using frame travel time
            // blur the outward traveling ball only for the time it has been traveling away
            blurSteps = Math.ceil(10 * ((ballY - (h - ballR)) / -ballDY));
            ballY -= (ballY - (h - ballR)) * 2;
        }else{
            ballY = h - ballR; // move ball to touching wall
            blurSteps = 1; // there is no outward motion
        }
    }     
   
    // draw the ball motion blured
    drawMotionBlur(
        ball,                    // image to draw
        ballX - ballR,             // offset radius
        ballY - ballR,
        ballDX * (blurSteps / bSteps),  // speed and adjust for bounced
        ballDY * (blurSteps / bSteps),
        blurSteps                // number of blurs
    );

    // show max height. Yes it is min but everything is upside down.
    maxHeight = Math.min(maxHeight,ballY);
    lastMaxHeight = Math.min(ballY,lastMaxHeight);

    // show max height
    ctx.font = "12px arial black";
    ctx.beginPath();
    ctx.moveTo(0, lastMaxHeight - ballR);
    ctx.lineTo(w, lastMaxHeight - ballR);
    ctx.stroke();
    ctx.fillText("Max height.", 40, lastMaxHeight - ballR + 6);


    str = ""; // display status string
    if(slowMotion){   // show left click help
        str += "10fps."
        ctx.fillText("click for 60fps.", textCenterX, 43);
    }else{
        str += "60fps."
        ctx.fillText("click for 10fps.", textCenterX, 43);
    }

    if(frameTravel){ // show mode and right click help
        str += " Mid frame collision.";
        ctx.fillText("Right click for Simple collision", textCenterX,55);
    }else{
        str += " Simple collision.";
        ctx.fillText("Right click for mid frame collision", textCenterX,55);
    }

    // display help text
    ctx.font = "18px arial black";  
    ctx.strokeText(str, textCenterX, 30);
    ctx.fillText(str, textCenterX, 28);

    if(slowMotion){
        setTimeout(update, 100); // show in slow motion
    }else{
        requestAnimationFrame(update); // request next frame (1/60) seconds from now
    }

    // all done
}
update(); // to start the ball rolling