//////////TOOLS FOR USE IN OTHER SCRIPTS//////////

//Find the distance between two points
var distanceBetween = function(x1, y1, x2, y2){
	var distX = Math.abs(x1 - x2);
	var distY = Math.abs(y1 - y2);

	return Math.sqrt(distX*distX + distY*distY);
};
