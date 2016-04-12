const STUN_TIME = 80;

function enemyClass() {
	this.x = 75;
	this.y = 75;
	this.xv = 0;
	this.yv = 0;
	this.myPic;
	this.facingAng;
	this.readyToRemove;
	this.mvSpeed = 4;
	this.moving;
	this.probMove;
	this.targetX; 
	this.targetY;
	this.stunTime;

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
		//this.randDir();
		this.moving = false;
		this.probMove = 0.20;
		this.targetX = this.x; 
		this.targetY = this.y;
		this.decide();
		this.stunTime = 0;
	} // end of warriorReset func

	this.move = function() {
		var nextX = this.x+this.xv;
		var nextY = this.y+this.yv;

		if(this.stunTime>0) {
			this.stunTime--;
			return;
		}

		if(!this.onTileGround( nextX, nextY )) {
			this.randPos();
		} else if(this.arrived()) {
			this.decide();
		} else {
			this.x = nextX;
			this.y = nextY;
		}
	}

	this.hitBy = function(someShot) {
		var dx = someShot.x - this.x;
		var dy = someShot.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);

		if(dist < this.myPic.width*0.7) {
			if(someShot.doesStun) {
				this.stunTime = STUN_TIME;
			} else {
				this.readyToRemove = true;
			}
			return true;
		}
		return false;
	}

	this.draw = function() {
		if(this.stunTime<=0) {
			drawBitmapCenteredWithRotation(this.myPic, this.x,this.y, 0);
		} else {
			var stunShakeRange = 4;
			var stunLeft = 1 + stunShakeRange * (STUN_TIME - this.stunTime) / STUN_TIME;
			drawBitmapCenteredWithRotation(this.myPic, 
				this.x+Math.random()*stunLeft-Math.random()*stunLeft,
				this.y+Math.random()*stunLeft-Math.random()*stunLeft, 0);
		}
	}



	//------ Added by dalath -------//
	//----------- START ------------//
	//
	this.decide = function() {
		var rnd = Math.random();
		if(rnd < this.probMove) {
			this.randPos();
			this.probMove -= 0.15;	
		} else {
			this.probMove += 0.001;
		}
		
	}

	this.arrived = function() {
		var xDone = Math.abs(( this.x + this.xv ) - this.targetX) < this.mvSpeed;
		var yDone = Math.abs(( this.y + this.yv ) - this.targetY) < this.mvSpeed;
		if(xDone && yDone) {
			this.x = this.targetX;
			this.y = this.targetY;
			this.xv = 0;
			this.yv = 0;
			return true;
		} 
		return false;
	}

	this.randPos = function() {
		var brk = 100;
		do {
			this.targetX = Math.random() * canvas.width;
			this.targetY = Math.random() * canvas.height;
		} while(!this.onTileGround(this.targetX, this.targetY) && brk-- > 0);
		//
		var xDiff = this.targetX - this.x;
		var yDiff = this.targetY - this.y;
		var maxDiff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
		this.xv = this.mvSpeed * (xDiff / maxDiff);
		this.yv = this.mvSpeed * (yDiff / maxDiff);
	}

	this.onTileGround = function(_x, _y) {
		var walkIntoLevelPieceIndex = getLevelPieceIndexAtPixelCoord(_x, _y);
		var walkIntoLevelPieceType = TILE_GROUND;
		if(walkIntoLevelPieceIndex != undefined) {
			walkIntoLevelPieceType = worldData[walkIntoLevelPieceIndex].kind;
		}
		//
		return walkIntoLevelPieceType == TILE_GROUND;
	}
	//
	//------------ END -------------//

}
