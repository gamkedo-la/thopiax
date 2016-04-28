function drawBitmapCenteredWithRotation(useBitmap, atX,atY, withAng, scale) {
	scale = scale || 1;
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2 * scale, -useBitmap.height/2 * scale, useBitmap.height * scale, useBitmap.height * scale);
	canvasContext.restore();
}

function drawLine(fromX,fromY,toX,toY,thickness,color) {
	canvasContext.beginPath();
	canvasContext.moveTo(fromX,fromY);
	canvasContext.lineTo(toX,toY);
	canvasContext.lineWidth = thickness;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}

function drawEllipse(centerX, centerY, width, height, lineColor) {
  canvasContext.lineWidth = 1;
  canvasContext.beginPath();
  canvasContext.moveTo(centerX - width*0.5, centerY); // A1
  canvasContext.bezierCurveTo(
    centerX - width*0.5, centerY + height*0.5, // C1
    centerX + width*0.5, centerY + height*0.5, // C2
    centerX + width*0.5, centerY); // A2
  canvasContext.bezierCurveTo(
    centerX + width*0.5, centerY - height*0.5, // C3
    centerX - width*0.5, centerY - height*0.5, // C4
    centerX - width*0.5, centerY); // A1
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