function drawBitmapCenteredWithRotation(useBitmap, atX,atY, withAng, scale) {
	scale = scale || 1;
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2 * scale, -useBitmap.height/2 * scale, useBitmap.height * scale, useBitmap.height * scale);
	canvasContext.restore();
}

function drawBitmapCenteredAnimFrame(useBitmap, atX,atY, frameNum, vertNum, frameDim) {
	var dimSize;
	if(frameDim == undefined || frameDim == 0) {
		dimSize = useBitmap.height;
	} else {
		dimSize = frameDim; 
	}
	canvasContext.drawImage(useBitmap,
		frameNum*dimSize,vertNum*dimSize,
		dimSize,dimSize,
		atX-dimSize/2,atY-dimSize/2,
		dimSize,dimSize);
}

function drawLine(fromX,fromY,toX,toY,thickness,color) {
	canvasContext.beginPath();
	canvasContext.moveTo(fromX,fromY);
	canvasContext.lineTo(toX,toY);
	canvasContext.lineWidth = thickness;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}

/*
         , - ~ ~ ~ - ,
     , '       |       ' ,
   ,           |           ,
  ,            |height      ,
 ,             |             ,
 ,_____________|_____________,
 ,   width     |             ,
  ,            |            ,
   ,           |           ,
     ,         |        , '
       ' - , _ | _ ,  '
	Height and width are full height and width (diameter) not half (radius)
*/
function drawEllipse(centerX, centerY, width, height, lineColor) {
	width = width/2;
	height = height/2;
  canvasContext.lineWidth = 1;
	
  canvasContext.beginPath();
	canvasContext.save();
	canvasContext.scale(width, height);
	canvasContext.arc(centerX/width, centerY/height, 1, 0, 1 * Math.PI);
	canvasContext.arc(centerX/width, centerY/height, 1, 1 * Math.PI, 2 * Math.PI);
	canvasContext.restore();
  canvasContext.strokeStyle = lineColor;
  canvasContext.closePath();	
  canvasContext.stroke();	
}


function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, 10, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}