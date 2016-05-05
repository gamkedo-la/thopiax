const ATTACK_SPAWN_DIST = 37; // side
const ATTACK_SPAWN_DIST_UP = 57;
const ATTACK_SPAWN_DIST_DOWN = 40;

const WAIST_HEIGHT = -12;

function shotClass2(firedBy, angle) {
	console.log("Shot class 2");

	this.x = firedBy.x;
	this.y = firedBy.y + WAIST_HEIGHT;
	this.angle = angle;
	this.picAngle = angle;
	this.enemiesHit = [];
	
	if(this.velocity === undefined){
		this.velocity = 1.0;
	}
	
	this.xv = this.velocity * Math.cos(this.angle);
	this.yv = this.velocity * Math.sin(this.angle);
	
	if(this.lifeTime === undefined){
		this.lifeTime = 40;
	}
	
	//TODO select default pic
//	this.myShotPic = playerArrowPic; // which picture to use
	this.readyToRemove = false;
//	this.vanishOnHit = true;
//	this.doesStun = false;
	
	this.checkCollision = function(){
		for(var i=0; i<enemyList.length; i++) {
			if(this.enemiesHit.indexOf(enemyList[i]) < 0 && enemyList[i].hitBy(this)){
				this.enemiesHit.push(enemyList[i]);
				console.log("hit one");
				
				if(this.vanishOnHit) {
					this.readyToRemove = true;
					return;
				}
			}
		}
	}

	this.move = function() {
		this.lifeTime--;
		if(this.lifeTime < 0) {
			this.readyToRemove = true;
			return;
		}
		
		this.checkCollision();
		
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
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.picAngle);
	}
}

shotClassArrow.prototype = Object.create(shotClass2.prototype);;
shotClassArrow.prototype.constructor = shotClassArrow;

function shotClassArrow(firedBy, angle) {
	this.velocity = 7.0;
	this.lifeTime = 40;
	this.myShotPic = playerArrowPic;
	this.vanishOnHit = true;
	this.doesStun = false;
	
	shotClass2.call(this, firedBy, angle);
}


shotClassFireball.prototype = Object.create(shotClass2.prototype);
shotClassFireball.prototype.constructor = shotClassFireball;

function shotClassFireball(firedBy, angle) {
	fireStaffSound.play()
	
	this.velocity = 3.5;
	this.lifeTime = 120;
	this.maxLifeTime = this.lifeTime;
	this.myShotPic = playerFireballPic;
	this.vanishOnHit = false;
	this.doesStun = false;
	this.isSpinningRate = 0.7;

	shotClass2.call(this, firedBy, angle);
	
	this.moveParent = this.move;
	this.move = function(){
		this.moveParent();
		this.facingAng += this.isSpinningRate;
	}
	
	this.draw = function() {
		var shotSize = (this.lifeTime/ this.maxLifeTime - 1) * -1 + .3
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.facingAng, shotSize);
	}
}

shotClassEnemyFireball.prototype = Object.create(shotClassFireball.prototype);
shotClassEnemyFireball.prototype.constructor = shotClassEnemyFireball;

function shotClassEnemyFireball(firedBy, angle) {
	shotClassFireball.call(this, firedBy, angle);
	
	this.checkCollision = function(){
		if(this.enemiesHit.indexOf(playerRanged) < 0 && playerRanged.hitBy(this)){
			this.enemiesHit.push(playerRanged);
			
			if(this.vanishOnHit) {
				this.readyToRemove = true;
				return;
			}
		}
	}
}

//*
function shotClass() {
	this.x = 75;
	this.y = 75;
	this.xv = 1;
	this.yv = 1;
	this.lifeTime;
	this.myShotPic; // which picture to use
	this.facingAng;
	this.readyToRemove;
	this.vanishOnHit;
	this.doesStun;
	this.isSpinningRate;

	this.reset = function(whichImage, firedBy, mvSpeed, atX, atY, lifeFrames, useFacing, vanishOnHit, useRot, stuns) {
		var startX = firedBy.x + (useFacing ? Math.cos(firedBy.prevMoveAng) * ATTACK_SPAWN_DIST : 0);
		var faceUp = firedBy.prevMoveAng < 0;
		//console.log(faceUp);
		var startY = firedBy.y + (useFacing ? Math.sin(firedBy.prevMoveAng) *
					(faceUp ? ATTACK_SPAWN_DIST_UP : ATTACK_SPAWN_DIST_DOWN) : 0)
					+ WAIST_HEIGHT;
		this.readyToRemove = false;
		this.myShotPic = whichImage;
		this.isSpinningRate = 0.0;
		this.x = startX;
		this.y = startY;
		var dx = atX-startX;
		var dy = atY-startY;
		var magnitude = Math.sqrt(dx*dx + dy*dy);
		if(useFacing) {
			if(useRot) {
				this.facingAng = firedBy.prevMoveAng;
			} else {
				this.facingAng = 0;
			}
		} else {
			this.facingAng = Math.atan2(dy,dx);
		}
		this.xv = mvSpeed * dx / magnitude;
		this.yv = mvSpeed * dy / magnitude;
		this.lifeTime = lifeFrames;
		this.maxLifeTime = lifeFrames;
		this.vanishOnHit = vanishOnHit;
		if(stuns == undefined) {
			stuns = false;
		}
		this.doesStun = stuns;
	} // end of warriorReset func

	this.move = function() {
		this.lifeTime--;
		if(this.lifeTime < 0) {
			this.readyToRemove = true;
			return;
		}

		for(var i=0; i<enemyList.length; i++) {
			if(enemyList[i].hitBy(this) && this.vanishOnHit) {
				this.readyToRemove = true;
				return;
			}
		}

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

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.facingAng);
	}
}
//*/