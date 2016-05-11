const PLAYER_MOVE_SPEED = 5.0;

const PLAYER_FRAME_NUM = 60;

const DASH_DURATION = 28.0;
const DASH_MAX_SPEED = 11.0;
const BERSERK_COOLDOWN = 50.0;
const MAGE_CD = 100.0;
const HEAL_CD = 1000.0;

const START_LIVES = 100;
const INVUL_FRAMES = 50;

var healZoneIsUp = false;

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
	this.reloadTime;
	this.reloadTime2;
	this.windup;
	this.radius;
	this.circleColor;

	this.startSide;

	this.ai;

	this.healX;
	this.healY;
	this.healCooldown = 0;
	this.healTimer = 0;

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
	}

	this.reset = function(whichImage, whichImageBack, whichImageStand,
		warriorName, startPos) {
		this.name = warriorName;
		this.myWarriorPic = whichImage;
		this.myWarriorPicBack = whichImageBack;
		this.myWarriorPicStand = whichImageStand;
		this.keysHeld = 0;
		this.updateKeyReadout();
		this.startSide = startPos;
		this.myLives = START_LIVES+1; // so that first respawn won't count
		this.ai = new AIH(this);
		this.respawn();
	} // end of warriorReset func

	this.updateKeyReadout = function() {
		// document.getElementById("debugText").innerHTML = "Keys: " + this.keysHeld;
	}

	this.windupCircle = function () {
		this.windup --;

		drawEllipse(this.x, this.y+5,
	      		this.radius, this.radius*worldTiltYDampen,this.circleColor);

		if (this.windup == 1) {
			for(var i=0; i<enemyList.length; i++) {
				var dx = this.x - enemyList[i].x;
				var dy = (this.y+5) - enemyList[i].y;
				if(Math.abs(dx) < this.radius && Math.abs(dy) < this.radius*worldTiltYDampen) {
					enemyList[i].gotHit(this);
					//Battle Axe Heal
					if (rightHandIndexP1 == 2) {
						this.myLives += 1;
						if (this.myLives > 100) {
							this.myLives = 100;
						}
					}
				}
			}
			sliceSound.play()
		}
	}

	this.dashAtDirectionFaced = function() {
    this.dashAtPoint(this.x + Math.cos( this.prevMoveAng ) * 100,this.y + Math.sin( this.prevMoveAng ) * 100);
	}
	// and
	this.dashAtMouse = function() {
	    this.dashAtPoint(mouseX, mouseY);
	}
	// both using:
	this.dashAtPoint = function(toX, toY) {
	    if(this.myLives <= 0) {
	        return;
	    }
	    if(this.dashTime <= 0) {
	        this.dashHookAtX = toX;
					this.dashHookAtY = toY;
	        var dx = toX - this.x;
	        var dy = toY - this.y;
	        var dist = Math.sqrt(dx*dx + dy*dy);
	        if(dist > 1) {
	            this.dashTime = DASH_DURATION;
	            this.dashXV = dx / dist;
	            this.dashYV = dy / dist;
	            dashSound.play()
	        }
	    }
	}



	this.createHealZone = function() {
		if (this.healCooldown == 0 && this.myLives > 0) {
			this.healCooldown = HEAL_CD;
			this.healX = mouseX;
			this.healY = mouseY;
			this.healTimer = 100;
			healZoneIsUp = true;
		}
	}

	this.move = function() {
		if(this.myLives <= 0) {
			return;
		}
		var nextX = this.x;
		var nextY = this.y;
		var anyKey = false;

		if(document.getElementById(this.name).checked) {
			this.ai.action();
			anyKey = this.ai.moved;
			nextX += this.ai.moveX;
			nextY += this.ai.moveY;
		} else {
			if(this.keyHeld_North) {
				nextY -= (PLAYER_MOVE_SPEED*worldTiltYDampen) + this.speedBoost;
				anyKey = true;
				if(classIndexP2 == 2 && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_East) {
				nextX += PLAYER_MOVE_SPEED + this.speedBoost;
				anyKey = true;
				this.lastMovedRight = true;
				if(classIndexP2 == 2 && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_South) {
				nextY += (PLAYER_MOVE_SPEED*worldTiltYDampen) + this.speedBoost;
				anyKey = true;
				if(classIndexP2 == 2 && this.name == "Ranged Dudette") {
					this.abilityCD = MAGE_CD;
				}
			}
			if(this.keyHeld_West) {
				nextX -= PLAYER_MOVE_SPEED + this.speedBoost;
				anyKey = true;
				this.lastMovedRight = false;
				if(classIndexP2 == 2 && this.name == "Ranged Dudette") {
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
					this.updateKeyReadout();
					worldData[walkIntoLevelPieceIndex].kind = TILE_GROUND;
				}
				break;
			case TILE_KEY:
				this.keysHeld++; // one more key
				this.updateKeyReadout();
				worldData[walkIntoLevelPieceIndex].kind = TILE_GROUND;
				break;
			case TILE_WALL:
				this.dashTime = 0;
			default:
				break;
		}

		if(this.invulTime <= 0) {
			for(var i=0; i<enemyList.length; i++) {
				if(enemyList[i].hitBy(this)) {
					this.myLives -= 10;
					this.invulTime = INVUL_FRAMES;
					if (classIndexP2 == 2 && this.name == "Ranged Dudette") {
						this.myLives -=10;
						this.abilityCD = MAGE_CD;
					}
				}
			}
		}
	}


	this.hitBy = function(enemyShot) {
		var dx = enemyShot.x - this.x;
		var dy = enemyShot.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);

		if(dist < enemyShot.myShotPic.height*0.7) { // note: .height so it works for animated strips
			this.myLives-= 10;
			return true;
		}
		return false;
	}



	this.draw = function() {
		if(this.myLives <= 0) {
			return;
		}

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

		if(this.invulTime > 0) {
			this.invulTime--;
			if(this.invulTime%5 < 2) {
				return;
			}
		}

		if(this.reloadTime > 0) {
			this.reloadTime--;
			//drawEllipse(this.x, this.y+5,
	    //  		frameSize/3, frameSize/7,"#cccccc");
		}
		if(this.reloadTime2 > 0) {
			this.reloadTime2--;
		}
		if(this.abilityCD > 0) {
			this.abilityCD--;
		}
		//mage
		if(classIndexP2 == 2 && this.name == "Ranged Dudette" && this.abilityCD == 0) {
			this.reloadTime = 0;
			this.reloadTime2 = 0;
			this.healTimer = HEAL_CD / 10;
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

		if (this.windup > 0) {
			this.windupCircle()
		}
		if (playerRanged.healCooldown > 0) {
			playerRanged.healCooldown --;
		}
		if (healZoneIsUp) {
			if (this.healX > this.x - 100 && this.healX < this.x + 100) {
		    if (this.healY > this.y - 100 && this.healY < this.y + 100) {
					if(this.myLives < 100) {
						this.myLives ++;
					}
				}
		  }
		}

	}
}
