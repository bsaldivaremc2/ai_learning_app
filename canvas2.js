// canvas related variables
// you can change these variables
var canvasWidth             = 150;
var canvasHeight            = 150;
var canvasStrokeStyle       = "white";
var canvasLineJoin          = "round";
var canvasLineWidth         = 12;
var canvasBackgroundColor   = "black";
var canvasId                = "canvas";

// variables to hold coordinates and dragging boolean
var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

//---------------------
// Create canvas
//---------------------
var canvasBox = document.getElementById('canvas_box');
var canvas    = document.createElement("canvas");

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

ctx = canvas.getContext("2d");

//---------------------
// MOUSE DOWN function
//---------------------
$("#canvas").mousedown(function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  drawing = true;
  addUserGesture(mouseX, mouseY);
  drawOnCanvas();
});

//---------------------
// TOUCH START function
//---------------------
canvas.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
      e.preventDefault();
    }

  var rect  = canvas.getBoundingClientRect();
  var touch = e.touches[0];

  var mouseX = touch.clientX - rect.left;
  var mouseY = touch.clientY - rect.top;

  drawing = true;
  addUserGesture(mouseX, mouseY);
  drawOnCanvas();

}, false);

//---------------------
// MOUSE MOVE function
//---------------------
$("#canvas").mousemove(function(e) {
  if(drawing) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    addUserGesture(mouseX, mouseY, true);
    drawOnCanvas();
  }
});

//---------------------
// TOUCH MOVE function
//---------------------
canvas.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
      e.preventDefault();
    }
  if(drawing) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];

    var mouseX = touch.clientX - rect.left;
    var mouseY = touch.clientY - rect.top;

    addUserGesture(mouseX, mouseY, true);
    drawOnCanvas();
  }
}, false);

//---------------------
// MOUSE UP function
//---------------------
$("#canvas").mouseup(function(e) {
  drawing = false;
});

//---------------------
// TOUCH END function
//---------------------
canvas.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
      e.preventDefault();
    }
  drawing = false;
}, false);

//----------------------
// MOUSE LEAVE function
//----------------------
$("#canvas").mouseleave(function(e) {
  drawing = false;
});

//---------------------
// TOUCH LEAVE function
//---------------------
canvas.addEventListener("touchleave", function (e) {
  if (e.target == canvas) {
      e.preventDefault();
    }
  drawing = false;
}, false);

//----------------------
// ADD CLICK function
//----------------------
function addUserGesture(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickD.push(dragging);
}

//----------------------
// RE DRAW function
//----------------------
function drawOnCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = canvasStrokeStyle;
  ctx.lineJoin    = canvasLineJoin;
  ctx.lineWidth   = canvasLineWidth;

  for (var i = 0; i < clickX.length; i++) {
    ctx.beginPath();
    if(clickD[i] && i) {
      ctx.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      ctx.moveTo(clickX[i]-1, clickY[i]);
    }
    ctx.lineTo(clickX[i], clickY[i]);
    ctx.closePath();
    ctx.stroke();
  }
}

//----------------------
// CLEAR CANVAS function
//----------------------
function clearCanvas(id) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  clickX = new Array();
  clickY = new Array();
  clickD = new Array();
}

function boundingBox() {
  var minX = Math.min.apply(Math, clickX) - 20;
  var maxX = Math.max.apply(Math, clickX) + 20;
  
  var minY = Math.min.apply(Math, clickY) - 20;
  var maxY = Math.max.apply(Math, clickY) + 20;

  var tempCanvas = document.createElement("canvas"),
  tCtx = tempCanvas.getContext("2d");

  tempCanvas.width  = maxX - minX;
  tempCanvas.height = maxY - minY;

  tCtx.drawImage(canvas, minX, minY, maxX - minX, maxY - minY, 0, 0, maxX - minX, maxY - minY);

  var imgBox = document.getElementById("canvas_image");
  imgBox.src = tempCanvas.toDataURL();

  return tempCanvas;
}
