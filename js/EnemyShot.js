
enemyShotClass.prototype = new shotClass();
enemyShotClass.prototype.constructor = enemyShotClass;


function enemyShotClass(){
	shotClass.call(this);
	this.move = function() {
		this.lifeTime--;
		if(this.lifeTime < 0) {
			this.readyToRemove = true;
			return;
		}
/*
		for(var i=0; i<enemyList.length; i++) {
			if(enemyList[i].hitBy(this) && this.vanishOnHit) {
				this.readyToRemove = true;
				return;
			}
		}
*/
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

		this.facingAng += this.isSpinningRate;
	}
}
