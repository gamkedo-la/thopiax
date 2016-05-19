const PLAYER_MOVE_SPEED = 5.0;

const PLAYER_FRAME_NUM = 60;

const DASH_DURATION = 28.0;
const DASH_MAX_SPEED = 11.0;
const BERSERK_COOLDOWN = 50.0;
const MAGE_CD = 1.0;
const HEAL_CD = 1000.0;

const START_LIVES = 100;
const INVUL_FRAMES = 50;

var healZoneIsUp = false;

var healZone = {
	isUp: false,
	x: 0,
	y: 0,
	diameter: 200,
	timer: 0
};

function warriorClass() {
	this.x = 75;
	this.y = 75;
	this.prevMoveAng = 0;
	this.myWarriorPic;
	this.myWarriorPicBack;
	this.myWarriorPicStand;
	this.name = "Untitled Warrior";
	this.keysHeld = 0;
	this.lastMovedRight = false;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;

	this.myLives;
	this.invulTime;
	this.killCount = 0;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

	this.dashTime;
	this.dashXV;
	this.dashYV;
	this.dashHookAtX;
	this.dashHookAtY;
	this.isMoving;

	this.speedBoost = 0;

	this.abilityCD;
	this.abilityCDMax = 1;
	this.reloadTime;
	this.reloadTime2;
	this.windup;
	this.maxWindup;
	this.frozenTime;
	this.radius;
	this.circleColor;

	this.startSide;

	this.ai;

	this.rightHandWeapon;
	this.leftHandWeapon;

	var dashSound = new SoundOverlapsClass("audio/dash")

	this.setupInput = function(upKey, rightKey, downKey, leftKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
	}

	this.respawn = function() {
		this.myLives--;
		this.dashTime = 0;
		this.x = 300 + this.startSide * 200;
		this.y = 300;
		this.invulTime = INVUL_FRAMES;
		this.reloadTime = 0;
		this.reloadTime2 = 0;
		this.abilityCD = 0;
		this.killCount = 0;
	}

	this.reset = function(whichImage, whichImageBack, whichImageStand,
		warriorName, startPos) {
		this.name = warriorName;
		this.myWarriorPic = whichImage;
		this.myWarriorPicBack = whichImageBack;
		this.myWarriorPicStand = whichImageStand;
		this.keysHeld = 0;
		this.startSide = startPos;
		this.myLives = START_LIVES+1; // so that first respawn won't count
		this.ai = new AIH(this);
		this.respawn();
	} // end of warriorReset func
	
	this.windupCircle = function () {
		this.windup --;

		drawEllipse(this.x, this.y,
		            this.radius*2,
		            this.radius*worldTiltYDampen*2,
		            this.circleColor);
		drawEllipse(this.x, this.y,
	              (this.radius - this.radius * (this.windup)/this.maxWindup)*2,
		            (this.radius*worldTiltYDampen - this.radius*worldTiltYDampen*(this.windup)/this.maxWindup)*2,
		            this.circleColor);
		


		if (this.windup == 1) {
			for(var i=0; i<enemyList.length; i++) {
				if(dampPointDist(this, enemyList[i]) < this.radius){
					enemyList[i].gotHit(this);
					//Battle Axe Heal
					if (rightHandIndexP1 === RIGHT_P1_AXE) {
						this.myLives += 5;
						if (this.myLives > 100) {
							this.myLives = 100;
						}
					}
				}
			}
			if(soundIsOn){
				sliceSound.play();
			}
		}
	}

	this.dashAtPoint = function(atMouse) {
		if(this.myLives <= 0) {
			return;
		}
		
		var dash = false;
		
		if(this.name === "Ranged Dudette" && this.reloadTime2 <= 0){
			this.reloadTime2 = DASH_DURATION;
			this.dashHookAtX = mouseX;
			this.dashHookAtY = mouseY;
			dash = true;
		} else if(this.name === "Melee Dude"){
			this.dashHookAtX = this.x + Math.cos( this.prevMoveAng ) * 100;
			this.dashHookAtY = this.y + Math.sin( this.prevMoveAng ) * 100;
		}
		
		if(dash){//this.dashTime <= 0) {
			var dist = distanceBetween(this.dashHookAtX, this.dashHookAtY, this.x, this.y);
			if(dist > 1) {
				this.dashTime = DASH_DURATION;
				this.dashXV = (this.dashHookAtX - this.x) / dist;
				this.dashYV = (this.dashHookAtY - this.y) / dist;
				if(soundIsOn){
					dashSound.play();
				}
			}
		}
	}

	this.assassinHeal = function(){
		if(classIndexP2 === CLASS_P2_ASSASSIN && this.name == "Ranged Dudette"){
			this.myLives++;
			if(this.myLives > 100){
				this.myLives = 100;
			}
		}
	}
	
	this.paladinHeal = function(){
		if(classIndexP1 === CLASS_P1_PALADIN){
			this.myLives += 1/30;
			if(this.myLives > 100){
				this.myLives = 100;
			}
		}
	}

	this.createHealZone = function() {
		if (this.reloadTime2 <= 0 && this.myLives > 0) {
			this.reloadTime2 = HEAL_CD;
			healZone.x = mouseX;
			healZone.y = mouseY;
			healZone.timer = 100;
			healZone.isUp = true;
			return true;
		}
		return false;
	}
	
	this.drawCooldown = function(){
		if(this.name == "Ranged Dudette" && leftHandIndexP2 === LEFT_P2_SCROLL && this.reloadTime2 > 0){
			drawEllipsePart(this.x, this.y, 50, 50*worldTiltYDampen, "#44FF44", this.reloadTime2/HEAL_CD);
		} else if(this.name == "Melee Dude" && this.abilityCD > 0){
			drawEllipsePart(this.x, this.y, 50, 50*worldTiltYDampen, "#44FF44", this.abilityCD/this.abilityCDMax);
		}
	}

	this.move = function(_isAI) { // _isAI provided by a check of controlIndexP 1|2   .../-dalath
		if(this.myLives <= 0) {
			if(!_isAI && this.x < 9000){
				activePlayers--;
			}
			this.x = 10000;
			this.y = 10000;
			return;
		}

		for(var i=0; i<enemyList.length; i++) {
			if(this.invulTime <= 0 && enemyList[i].hitBy(this)) {
				this.myLives -= 10;
				this.invulTime = INVUL_FRAMES;
				if (classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette") {
					this.myLives -=10;
					this.abilityCD = MAGE_CD;
				}
			}
		}

		if(this.frozenTime != undefined && this.frozenTime > 0) {
			this.isMoving = false;
			return;
		}

		var nextX = this.x;
		var nextY = this.y;
		var anyKey = false;

		if(_isAI) {
			this.ai.action();
			anyKey = this.ai.moved;
			nextX += this.ai.moveX;
			nextY += this.ai.moveY;
		} else {
			if(this.keyHeld_North) {
				nextY -= (PLAYER_MOVE_SPEED*worldTiltYDampen) + this.speedBoost;
				anyKey = true;
				if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_East) {
				nextX += PLAYER_MOVE_SPEED + this.speedBoost;
				anyKey = true;
				this.lastMovedRight = true;
				if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_South) {
				nextY += (PLAYER_MOVE_SPEED*worldTiltYDampen) + this.speedBoost;
				anyKey = true;
				if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_West) {
				nextX -= PLAYER_MOVE_SPEED + this.speedBoost;
				anyKey = true;
				this.lastMovedRight = false;
				if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
		}

		this.isMoving = anyKey;
		if(anyKey) {
			this.prevMoveAng = Math.atan2( nextY - this.y, nextX - this.x );
		}

		if(this.dashTime > 0) {
			var dashSpeed = DASH_MAX_SPEED * this.dashTime/DASH_DURATION;
			 nextX += this.dashXV * dashSpeed;
			 nextY += this.dashYV * dashSpeed;
			this.dashTime--;
			this.isMoving = true;
		}

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
			case TILE_GOAL:
				loadLevel(levelOne);
				break;
			case TILE_DOOR:
				if(this.keysHeld > 0) {
					this.keysHeld--; // one less key
					worldData[walkIntoLevelPieceIndex].kind = TILE_GROUND;
				}
				break;
			case TILE_KEY:
				this.keysHeld++; // one more key
				worldData[walkIntoLevelPieceIndex].kind = TILE_GROUND;
				break;
			case TILE_WALL:
				this.dashTime = 0;
				if(leftHandIndexP2 === LEFT_P2_HOOK){
//					this.reloadTime2 = 0;
				}
			default:
				break;
		}
	}


	this.hitBy = function(enemyShot) {
		var dx = enemyShot.x - this.x;
		var dy = enemyShot.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);

		if(dist < enemyShot.myShotPic.height*0.7 * enemyShot.shotSize) { // note: .height so it works for animated strips
			this.myLives-= 10;
			this.invulTime = INVUL_FRAMES;
			return true;
		}
		return false;
	}



	this.draw = function() {
		if(this.myLives <= 0) {
			return;
		}
		
		this.drawCooldown();

		var frameSize = 50;
		var frameNum = sharedAnimCycle % PLAYER_FRAME_NUM;

		if (this.startSide == 0) {
			canvasContext.fillStyle = 'White';
			canvasContext.fillText("Kills: " + this.killCount ,20, 20);
			canvasContext.drawImage(healthBarPic, 20,30)
			for(var i=0;i<this.myLives;i++) {
				colorRect(22 + i, 32, 1, 20, "green");
			}
		} else {
			canvasContext.fillStyle = 'White';
			canvasContext.fillText("Kills: " + this.killCount,740, 20);
			canvasContext.drawImage(healthBarPic, 680,30)
			for(var i=0;i<this.myLives;i++) {
				colorRect(781 - i, 32, 1, 20, "green");
			}
		}

		if(this.dashTime > 0 && this.name == "Ranged Dudette") {
			drawLine(this.x, this.y-10,this.dashHookAtX, this.dashHookAtY,2,'#333333');
		}

		if (healZone.isUp) {
			if(dampPointDist(healZone, this) < 100 && this.myLives < 100){
				this.myLives++;
			}
		}
		
		if(this.invulTime > 0) {
			this.invulTime--;
			
			//This is the code that implements blinking and also slows down cooldowns
			if(this.invulTime%5 < 2) {
				if(this.name == "Ranged Dudette" && leftHandIndexP2 != LEFT_P2_HOOK){
					this.reloadTime2--;
				}
				return;
			}
		}
		
		//-----This is all delayed during invul frames-----//
		if(this.reloadTime > 0) {
			this.reloadTime--;
			
			//Mage faster cooldown standing still
			if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette" && this.abilityCD == 0){
				this.reloadTime-= 1;
			}
		}
		if(this.reloadTime2 > 0) {
			this.reloadTime2--;
			
			//Mage faster cooldown standing still
			if(classIndexP2 == CLASS_P2_MAGE && this.name == "Ranged Dudette" && this.abilityCD == 0 && leftHandIndexP2 != LEFT_P2_HOOK){
				this.reloadTime2-= 1;
			}
		}
		if(this.abilityCD > 0) {
			this.abilityCD--;
		}

		canvasContext.save();
		canvasContext.translate(this.x, this.y);
		if(this.lastMovedRight) {
			canvasContext.scale(-1, 1);
		}

		if(this.isMoving) {
			canvasContext.drawImage(this.myWarriorPic,
				frameNum * frameSize, 0,
				frameSize,frameSize,
				-frameSize/2, -frameSize*5/6,
				frameSize,frameSize);
		} else if(this.prevMoveAng >= 0.0){
			canvasContext.drawImage(this.myWarriorPicStand,
				-frameSize/2, -frameSize*5/6);
		} else {
			canvasContext.drawImage(this.myWarriorPicBack,
				-frameSize/2, -frameSize*5/6);
		}

		canvasContext.restore();

		if(this.frozenTime != undefined && this.frozenTime > 0) {
			this.frozenTime--;
		}
		if (this.windup > 0) {
			this.windupCircle()
		}
		//-----End of invul frame delayed section-----//
	}
}
