//////////TOOLS FOR USE IN OTHER SCRIPTS//////////

var worldTiltYDampen = 5.0/7.0;

//Find the distance between two coordinates
function distanceBetween(x1, y1, x2, y2){
	var distX = Math.abs(x1 - x2);
	var distY = Math.abs(y1 - y2);

	return Math.sqrt(distX*distX + distY*distY);
}

//Point class
function point(_x, _y) {
	this.x = _x;
	this.y = _y;
}

//Find the distance between two points
function distanceBetweenPoints(p1, p2){
	var distX = Math.abs(p1.x - p2.x);
	var distY = Math.abs(p1.y - p2.y);

	return Math.sqrt(distX*distX + distY*distY);
}

function dampPointDist(p1, p2){
	var distX = Math.abs(p1.x - p2.x);
	var distY = Math.abs(p1.y - p2.y)/(worldTiltYDampen);

	return Math.sqrt(distX*distX + distY*distY);
}
