function enemyClass() {
	this.x = 75;
	this.y = 75;
	this.xv = 1;
	this.yv = 1;
	this.myPic;
	this.facingAng;
	this.readyToRemove;

	this.randDir = function() {
		var newDir = Math.PI * 2.0 * Math.random();
		var atX = this.x;
		var atY = this.y;
		var mvSpeed = Math.random() * 3 + 2;
		this.xv = mvSpeed * Math.sin(newDir);
		this.yv = mvSpeed * Math.cos(newDir);
	}

	this.reset = function(whichImage, spawnX, spawnY) {
		this.readyToRemove = false;
		this.myPic = whichImage;
		this.x = spawnX;
		this.y = spawnY;
		this.randDir();
		
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
				this.randDir();
				// this.readyToRemove = true;
				break;
		}
	}

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myPic, this.x,this.y, 0);
	}
}
