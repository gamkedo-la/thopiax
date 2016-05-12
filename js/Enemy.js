const STUN_TIME = 80;


var distToRangedPlayer = function(x, y){
	var distRangedX = Math.abs(x - playerRanged.x);
	var distRangedY = Math.abs(y - playerRanged.y);

	return Math.sqrt(distRangedX*distRangedX + distRangedY*distRangedY);
};

var distToFighterPlayer = function(x, y){
	var distFighterX = Math.abs(x - playerFighter.x);
	var distFighterY = Math.abs(y - playerFighter.x);

	return Math.sqrt(distFighterX*distFighterX + distFighterY*distFighterY);
};


function enemyClass(spawnX, spawnY) {
	this.x = spawnX;
	this.y = spawnY;
	this.xv = 0;
	this.yv = 0;
	this.myPic = spiderPic;
	this.animSheetDim = 0;
	this.facingOptions = 0;

	this.facingAng;
	this.readyToRemove = false;
	this.mvSpeed = 3;
	this.targetX = this.x;
	this.targetY = this.y;
	this.stunTime = 0;
	this.lives = 1;
	this.hitEnemySound = new SoundOverlapsClass("audio/hitEnemy")

	this.randDir = function() {
		var newDir = Math.PI * 2.0 * Math.random();
		var atX = this.x;
		var atY = this.y;
		var mvSpeed = Math.random() * 3 + 2;
		this.xv = mvSpeed * Math.sin(newDir);
		this.yv = mvSpeed * Math.cos(newDir);
	};

	this.act = function() {
		if(this.lives <= 0){
			this.readyToRemove = true;
			return;
		}

		var nextX = this.x+this.xv;
		var nextY = this.y+this.yv*worldTiltYDampen;

		if(this.stunTime>0) {
			this.stunTime--;
			return;
		}

		if(!AIH.onTileGround( nextX, nextY )) {
			this.hitTerrain();
		} else if(this.arrived()) {
			this.decide();
		} else {
			this.move(nextX, nextY);
		}
	};
	
	this.move = function(xIn, yIn){
		this.x = xIn;
		this.y = yIn;
	};
	
	this.hitTerrain = function(){
		this.randPos();
	};

	this.hitBy = function(someShotOrPlayer) {
		var dx = someShotOrPlayer.x - this.x;
		var dy = someShotOrPlayer.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);

		//
		// tmp code splice by dalath
		var dimSizeCap;
		if(this.animSheetDim != 0) {
			dimSizeCap = this.animSheetDim;
		} else {
			dimSizeCap = Math.min(this.myPic.height, 50);
		}
		//
		if(dist < dimSizeCap*0.7) { 
			if(someShotOrPlayer.myLives != undefined) {
				if(this.stunTime > 0) {
					return false;
				} else {
					this.stunTime = STUN_TIME;
				}
			}else if(someShotOrPlayer.doesStun) {
				this.stunTime = STUN_TIME;
			} else {
				this.gotHit(someShotOrPlayer.firedBy);
			}
			return true;
		}
		return false;
	};

	this.gotHit = function(firedBy) {
		setTimeout(this.hitEnemySound.play(), 200)

		this.lives--;
		if(!this.lives && firedBy){
			firedBy.killCount++;
			if (firedBy == playerRanged && classIndexP2 == 1) {
				playerRanged.speedBoost = 5;
				playerRanged.abilityCD = 50;
			}
		}
	};

	this.draw = function() {
		var frameToShow = 0;
		var stepVertTile = 0;

		if(this.animSheetDim != 0) {
			if(this.xv != 0 || this.yv != 0 ) {
				this.facingAng = Math.atan2(this.yv,this.xv);
				stepVertTile = Math.floor(sharedAnimCycle/10)%4;
				if(stepVertTile==3) {
					stepVertTile = 1;
				}
			} else {
				stepVertTile = 0;
			}
			frameToShow = Math.round( this.facingAng * this.facingOptions / (2 * Math.PI) );
			if(frameToShow<0) {
				frameToShow+=this.facingOptions;
			}
		}

		if(this.stunTime<=0) {
			drawBitmapCenteredAnimFrame(this.myPic, this.x,this.y,
				frameToShow,stepVertTile, this.animSheetDim);
		} else {
			var stunShakeRange = 3;
			var stunLeft = 1 + stunShakeRange * (STUN_TIME - this.stunTime) / STUN_TIME;
			drawBitmapCenteredAnimFrame(this.myPic,
				this.x+Math.random()*stunLeft-Math.random()*stunLeft,
				this.y+Math.random()*stunLeft-Math.random()*stunLeft,
				frameToShow,0, this.animSheetDim);
		}
	};



	//------------ AI --------------//
	//----------- START ------------//
	//
	this.decide = function() {
		this.randPos();
	};

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
	};

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
	};
	//
	//------------ END -------------//
}


enemyNinjaClass.prototype = new enemyClass();
enemyNinjaClass.prototype.constructor = enemyNinjaClass;

function enemyNinjaClass(spawnX, spawnY) {
	enemyClass.call(this, spawnX, spawnY);
	this.moveCounter = 100;
	this.mvSpeed = 5;
	this.projectileSpeed = 6;
	this.projectileLife = 100;
	this.rangedCooldown = 60;
	this.rangedCooldownTimer = 60;
	this.target;
	this.myPic = basicEnemyPic;
	this.lives = 2;
	this.animSheetDim = 0;

	this.rangedAttack = function(targetX, targetY){
		if(this.rangedCooldownTimer > 0){
			this.rangedCooldownTimer--;
			return;
		}

		var angle = Math.atan2(targetY-this.y,targetX-this.x);
		var newShot = new shotClassEnemyFireball(this, angle);
		shotList.push(newShot);

		this.rangedCooldownTimer = this.rangedCooldown;
	};

	this.decide = function() {
		if(this.moveCounter >= 100) {
			do{
				this.randPos();
				this.moveCounter = 0;
			}while(distToRangedPlayer(this.targetX, this.targetY) < 200
			    || distToFighterPlayer(this.targetX, this.targetY) < 200);
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
	};

	this.hitTerrain = function(){
		this.targetX = this.x;
		this.targetY = this.y;
		this.xv = 0;
		this.yv = 0;
		if(distToRangedPlayer(this.targetX, this.targetY) < 200
		 || distToFighterPlayer(this.targetX, this.targetY) < 200){
			 this.moveCounter = 100;
		}else{
			this.decide();
		}
	};
	
	this.gotHitOld = this.gotHit;
	
	this.gotHit = function(firedBy) {
		this.gotHitOld(firedBy);
		
		this.moveCounter = 100;
	};
}

enemySkeletonClass.prototype = new enemyNinjaClass();
enemySkeletonClass.prototype.constructor = enemySkeletonClass;

function enemySkeletonClass(spawnX, spawnY) {
	enemyNinjaClass.call(this, spawnX, spawnY);
	this.mvSpeed = 4;
	this.myPic = skeletonPic;
	this.animSheetDim = 50;
	this.facingOptions = 4;
	this.lives = 6;
}

enemyMinotaurClass.prototype = new enemyClass();
enemyMinotaurClass.prototype.constructor = enemyMinotaurClass;

function enemyMinotaurClass(spawnX, spawnY) {
	enemyClass.call(this, spawnX, spawnY);
	this.chargeSpeed = 10;
	this.walkSpeed = 2;
	this.mvSpeed = this.walkSpeed;
	this.cooldown = 150;
	this.cooldownTimer = 150;
	this.bounceTimer = 45;
	this.bounceDuration = 30;
	this.target;// = playerFighter;
	this.targetIsMoving = true;
	this.myPic = demonPic;
	this.animSheetDim = 100;
	this.facingOptions = 8;
	this.lives = 6;

	this.chargeAttackStart = function(){
		this.targetIsMoving = false;
		this.mvSpeed = this.chargeSpeed;
		this.cooldownTimer = this.cooldown * (Math.random() + 1);
		
		this.target = {
			x: this.target.x,
			y: this.target.y
		}
	};

	this.chargeAttackStop = function(){
		this.targetIsMoving = true;
		
		var distRanged = distToRangedPlayer(this.x, this.y);
		var distFighter = distToFighterPlayer(this.x, this.y);
		this.target = distFighter < distRanged ? playerFighter : playerRanged;
		
		this.targetX = this.target.x;
		this.targetY = this.target.y;
		
		this.mvSpeed = this.walkSpeed;
	};
	
	this.decide = function() {
		console.log("decide");
		this.chargeAttackStop();
	};

	this.hitTerrain = function(){
		console.log("hit");
		this.chargeAttackStop();
		this.randPos();
		
		if(this.bounceTimer <= 0){
			this.bounceTimer = this.bounceDuration;
		}
	};
	
	this.move = function(xIn, yIn) {
		console.log("move");
		this.x = xIn;
		this.y = yIn;
		
		this.cooldownTimer--;
		
		if(this.bounceTimer > 0)
		{
			this.bounceTimer--;
			return;
		}
		
		if(this.cooldownTimer <= 0 && this.targetIsMoving){
			this.chargeAttackStart();
		}
		
		if(this.targetIsMoving) {
			var distRanged = distToRangedPlayer(this.x, this.y);
			var distFighter = distToFighterPlayer(this.x, this.y);
			
			this.target = distFighter < distRanged ? playerFighter : playerRanged;
		}
		
		this.targetX = this.target.x;
		this.targetY = this.target.y;
		
		var angle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
		this.xv = this.mvSpeed * Math.cos(angle);
		this.yv = this.mvSpeed * Math.sin(angle);
	};
	
	this.gotHitOld = this.gotHit;
	
	this.gotHit = function(firedBy) {
		this.gotHitOld(firedBy);
		
		this.chargeAttackStop();
	};
	
	this.randPos();
}
