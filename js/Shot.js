const ATTACK_SPAWN_DIST = 37; // side
const ATTACK_SPAWN_DIST_UP = 57;
const ATTACK_SPAWN_DIST_DOWN = 40;

const WAIST_HEIGHT = -12;

function shotClass(firedBy, angle) {
	this.firedBy = firedBy;
	this.x = firedBy.x;
	this.y = firedBy.y + WAIST_HEIGHT;
	this.angle = angle;
	this.picAngle = this.angle;
	this.enemiesHit = [];
	this.shotSize = 1;
	this.friendly = true;

	if(this.velocity === undefined){
		this.velocity = 0.0;
	}

	this.xv = this.velocity * Math.cos(this.angle);
	this.yv = this.velocity * Math.sin(this.angle);

	if(this.lifeTime === undefined){
		this.lifeTime = 40;
	}

	//TODO select default pic
	this.myShotPic;// = playerArrowPic; // which picture to use
	this.readyToRemove = false;

	this.checkCollision = function(){
		for(var i=0; i<enemyList.length; i++) {
			if(this.enemiesHit.indexOf(enemyList[i]) < 0 && enemyList[i].hitBy(this)){
				this.enemiesHit.push(enemyList[i]);
				if(this.vanishOnHit) {
					this.readyToRemove = true;
					return;
				}
			}
		}
	};

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
	};

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.picAngle);
	};
}

shotClassArrow.prototype = Object.create(shotClass.prototype);;
shotClassArrow.prototype.constructor = shotClassArrow;

function shotClassArrow(firedBy, angle) {
	this.velocity = 7.0;
	this.lifeTime = 40;
	this.myShotPic = playerArrowPic;
	this.vanishOnHit = true;
	this.doesStun = false;

	shotClass.call(this, firedBy, angle);
}

shotClassThrowingAxe.prototype = Object.create(shotClass.prototype);;
shotClassThrowingAxe.prototype.constructor = shotClassThrowingAxe;

function shotClassThrowingAxe(firedBy, angle) {
	this.velocity = 4.0;
	this.lifeTime = 50;
	this.myShotPic = throwingAxePic;
	this.vanishOnHit = false;
	this.doesStun = false;

	shotClass.call(this, firedBy, angle);
}

shotClassShuriken.prototype = Object.create(shotClass.prototype);;
shotClassShuriken.prototype.constructor = shotClassShuriken;

function shotClassShuriken(firedBy, angle) {
	this.velocity = 15.0;
	this.lifeTime = 20;
	this.myShotPic = shurikenPic;
	this.vanishOnHit = true;
	this.doesStun = false;

	shotClass.call(this, firedBy, angle);
}

shotClassFireball.prototype = Object.create(shotClass.prototype);
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

	shotClass.call(this, firedBy, angle);

	this.moveParent = this.move;
	this.move = function(){
		this.moveParent();
		this.facingAng += this.isSpinningRate;
	};

	this.draw = function() {
		this.shotSize = (this.lifeTime/ this.maxLifeTime - 1) * -1 + .3
		drawBitmapCenteredWithRotation(this.myShotPic, this.x,this.y, this.facingAng, this.shotSize);
	};
}

shotClassDagger.prototype = Object.create(shotClass.prototype);
shotClassDagger.prototype.constructor = shotClassDagger;

function shotClassDagger(firedBy, angle){
	sliceSound.play()

	this.myShotPic = playerSlashPic;
	this.velocity = 12.0;
	this.lifeTime = 5;
	this.vanishOnHit = false;
	this.doesStun = false;

	shotClass.call(this, firedBy, angle);
}

//shotClassMelee is a child of shotClass
shotClassMelee.prototype = Object.create(shotClass.prototype);
shotClassMelee.prototype.constructor = shotClassMelee;

function shotClassMelee(firedBy, angle){
	shotClass.call(this, firedBy, angle);

	//Move projectile's initial spawn outside of the player
	this.x += Math.cos(firedBy.prevMoveAng) * ATTACK_SPAWN_DIST;
	this.y += Math.sin(firedBy.prevMoveAng) *
						(firedBy.prevMoveAng < 0 ? ATTACK_SPAWN_DIST_UP : ATTACK_SPAWN_DIST_DOWN);
}

//shotClassSpear is a child of shotClassMelee
shotClassSpear.prototype = Object.create(shotClassMelee.prototype);
shotClassSpear.prototype.constructor = shotClassSpear;

function shotClassSpear(firedBy, angle){
	sliceSound.play()

	this.myShotPic = spearStabPic;
	this.lifeTime = 15;
	this.vanishOnHit = false;
	this.doesStun = false;

	shotClassMelee.call(this, firedBy, angle);
}

shotClassShield.prototype = Object.create(shotClassMelee.prototype);
shotClassShield.prototype.constructor = shotClassShield;

function shotClassShield(firedBy, angle){
	shieldSound.play();

	this.myShotPic = playerShieldPic;
	this.lifeTime = 60;
	this.vanishOnHit = false;
	this.doesStun = true;

	shotClassMelee.call(this, firedBy, 0);
}

var enemyProjectileCollisionTest = function(){
	if(this.enemiesHit.indexOf(playerRanged) < 0 && playerRanged.hitBy(this)){
		this.enemiesHit.push(playerRanged);

		if(this.vanishOnHit) {
			this.readyToRemove = true;
			return;
		}
	}
	if(this.enemiesHit.indexOf(playerFighter) < 0 && playerFighter.hitBy(this)){
		this.enemiesHit.push(playerFighter);

		if(this.vanishOnHit) {
			this.readyToRemove = true;
			return;
		}
	}
};

shotClassEnemyFireball.prototype = Object.create(shotClassFireball.prototype);
shotClassEnemyFireball.prototype.constructor = shotClassEnemyFireball;

function shotClassEnemyFireball(firedBy, angle) {
	shotClassFireball.call(this, firedBy, angle);

	this.friendly = false;
	this.vanishOnHit
	this.checkCollision = enemyProjectileCollisionTest;
}

shotClassEnemyArrow.prototype = Object.create(shotClassArrow.prototype);
shotClassEnemyArrow.prototype.constructor = shotClassEnemyArrow;

function shotClassEnemyArrow(firedBy, angle) {
	shotClassArrow.call(this, firedBy, angle);

	this.friendly = false;
	this.checkCollision = enemyProjectileCollisionTest;
}
