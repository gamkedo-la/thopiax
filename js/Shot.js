function shotClass() {
	this.x = 75;
	this.y = 75;
	this.xv = 1;
	this.yv = 1;
	this.myShotPic; // which picture to use
	this.facingAng;
	this.readyToRemove;

	this.reset = function(whichImage, firedBy, mvSpeed, atX, atY) {
		var startX = firedBy.x;
		var startY = firedBy.y;
		this.readyToRemove = false;
		this.myShotPic = whichImage;
		this.x = startX;
		this.y = startY;
		var dx = atX-startX;
		var dy = atY-startY;
		var magnitude = Math.sqrt(dx*dx + dy*dy);
		this.facingAng = Math.atan2(dy,dx);
		this.xv = mvSpeed * dx / magnitude;
		this.yv = mvSpeed * dy / magnitude;
	} // end of warriorReset func

	this.move = function() {
		var nextX = this.x+this.xv;
		var nextY = this.y+this.yv;

		var walkIntoLevelPieceIndex = getLevelPieceIndexAtPixelCoord(nextX, nextY);
		var walkIntoLevelPieceType = TILE_GROUND;

		if(walkIntoLevelPieceIndex != undefined) {
			walkIntoLevelPieceType = worldData[walkIntoLevelPieceIndex].kind;
		}

		switch(walkIntoLevelPieceType) {
			case TILE_GROUND:
				this.x = nextX;
				this.y = nextY;
				break;
			default:
				this.readyToRemove = true;
				break;
		}
	}

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.facingAng);
	}
}
