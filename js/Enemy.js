const STUN_TIME = 80;


var distToRangedPlayer = function(x, y){
	var distRangedX = Math.abs(x - playerRanged.x);
	var distRangedY = Math.abs(y - playerRanged.y);
	
	return Math.sqrt(distRangedX*distRangedX + distRangedY*distRangedY);
}

var distToFighterPlayer = function(x, y){
	var distFighterX = Math.abs(x - playerFighter.x);
	var distFighterY = Math.abs(y - playerFighter.x);
	
	return Math.sqrt(distFighterX*distFighterX + distFighterY*distFighterY);
}


function enemyClass() {
	this.x = 75;
	this.y = 75;
	this.xv = 0;
	this.yv = 0;
	this.myPic = demonPic;
	this.facingAng;
	this.readyToRemove;
	this.mvSpeed = 4;
	this.moving;
	this.probMove;
	this.targetX; 
	this.targetY;
	this.stunTime;
	var hitEnemySound = new SoundOverlapsClass("audio/hitEnemy")

	this.randDir = function() {
		var newDir = Math.PI * 2.0 * Math.random();
		var atX = this.x;
		var atY = this.y;
		var mvSpeed = Math.random() * 3 + 2;
		this.xv = mvSpeed * Math.sin(newDir);
		this.yv = mvSpeed * Math.cos(newDir);
	}

	this.reset = function(spawnX, spawnY) {
		this.readyToRemove = false;
//		this.myPic = whichImage;
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
		var nextY = this.y+this.yv*worldTiltYDampen;

		if(this.stunTime>0) {
			this.stunTime--;
			return;
		}

		if(!AIH.onTileGround( nextX, nextY )) {
			this.randPos();
		} else if(this.arrived()) {
			this.decide();
		} else {
			this.x = nextX;
			this.y = nextY;
		}
	}

	this.hitBy = function(someShotOrPlayer) {
		var dx = someShotOrPlayer.x - this.x;
		var dy = someShotOrPlayer.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);

		if(dist < this.myPic.width*0.7) {
			if(someShotOrPlayer.myLives != undefined) {
				if(this.stunTime > 0) {
					return false;
				} else {
					this.stunTime = STUN_TIME;
				}
				console.log("bumped player!");
			}else if(someShotOrPlayer.doesStun) {
				this.stunTime = STUN_TIME;
			} else {
				setTimeout(hitEnemySound.play(), 200)
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



	//------------ AI --------------//
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
		} while(!AIH.onTileGround(this.targetX, this.targetY) && brk-- > 0);
		//
		var xDiff = this.targetX - this.x;
		var yDiff = this.targetY - this.y;
		var maxDiff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
		this.xv = this.mvSpeed * (xDiff / maxDiff);
		this.yv = this.mvSpeed * (yDiff / maxDiff);
	}
	//
	//------------ END -------------//
}


enemyNinjaClass.prototype = new enemyClass();
enemyNinjaClass.prototype.constructor = enemyNinjaClass;

function enemyNinjaClass() {
	enemyClass.call(this);
	this.moveCounter = 100;
	this.mvSpeed = 8;
	this.projectileSpeed = 6;
	this.projectileLife = 100;
	this.rangedCooldown = 60;
	this.rangedCooldownTimer = 60;
	this.target;
	this.myPic = demonNinjaPic;
	
	this.rangedAttack = function(targetX, targetY){
		if(this.rangedCooldownTimer > 0){
			this.rangedCooldownTimer--;
			return;
		}
		var fromEnemy = this;
		//Make sure to manage cooldown timers
		var newShot = new enemyShotClass();
		newShot.reset(playerFireballPic, this, this.projectileSpeed, targetX, targetY, this.projectileLife, false, false);
		newShot.isSpinningRate = 0.7;
		shotList.push(newShot);
		this.rangedCooldownTimer = this.rangedCooldown;
	}
	
	this.decide = function() {
		if(this.moveCounter >= 100) {
			this.randPos();
			this.moveCounter = 0;
		} else {
			var distRanged = distToRangedPlayer(this.x, this.y);
			var distFighter = distToFighterPlayer(this.x, this.y);
			
			var distNearestPlayer = distFighter < distRanged ? distFighter : distRanged;
			
			this.moveCounter += Math.max((100 - distNearestPlayer/2)/15, 0.35);
			
			if(distFighter < distRanged){
				this.rangedAttack(playerFighter.x, playerFighter.y);
			} else {
				this.rangedAttack(playerRanged.x, playerRanged.y);
			}
		}
	}
}
