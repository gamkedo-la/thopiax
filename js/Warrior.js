const PLAYER_MOVE_SPEED = 5.0;

const PLAYER_FRAME_NUM = 60;

const DASH_DURATION = 28.0;
const DASH_MAX_SPEED = 11.0;

const START_LIVES = 3;
const INVUL_FRAMES = 90;

function warriorClass() {
	this.x = 75;
	this.y = 75;
	this.prevMoveAng = 0;
	this.myWarriorPic; // which picture to use
	this.name = "Untitled Warrior";
	this.keysHeld = 0;
	this.lastMovedRight = false;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;

	this.myLives;
	this.invulTime;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

	this.dashTime;
	this.dashXV;
	this.dashYV;

	this.reloadTime;

	this.startSide;

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
	}

	this.reset = function(whichImage, warriorName, startPos) {
		this.name = warriorName;
		this.myWarriorPic = whichImage;
		this.keysHeld = 0;
		this.updateKeyReadout();
		this.startSide = startPos;
		this.myLives = START_LIVES+1; // so that first respawn won't count
		this.respawn();
	} // end of warriorReset func

	this.updateKeyReadout = function() {
		// document.getElementById("debugText").innerHTML = "Keys: " + this.keysHeld;
	}

	this.dashAtMouse = function() {
		if(this.myLives <= 0) {
			return;
		}
		if(this.dashTime <= 0) {
			var dx = mouseX - this.x;
			var dy = mouseY - this.y;
			var dist = Math.sqrt(dx*dx + dy*dy);
			if(dist > 1) {
				this.dashTime = DASH_DURATION;
				this.dashXV = dx / dist;
				this.dashYV = dy / dist;
			}
		}
	}

	this.move = function() {
		if(this.myLives <= 0) {
			return;
		}
		var nextX = this.x;
		var nextY = this.y;
		var anyKey = false;

		if(this.keyHeld_North) {
			nextY -= PLAYER_MOVE_SPEED;
			anyKey = true;
		}
		if(this.keyHeld_East) {
			nextX += PLAYER_MOVE_SPEED;
			anyKey = true;
			this.lastMovedRight = true;
		}
		if(this.keyHeld_South) {
			nextY += PLAYER_MOVE_SPEED;
			anyKey = true;
		}
		if(this.keyHeld_West) {
			nextX -= PLAYER_MOVE_SPEED;
			anyKey = true;
			this.lastMovedRight = false;
		}
		
		if(anyKey) {
			this.prevMoveAng = Math.atan2( nextY - this.y, nextX - this.x );
		}

		if(this.dashTime > 0) {
			var dashSpeed = DASH_MAX_SPEED * this.dashTime/DASH_DURATION;
			 nextX += this.dashXV * dashSpeed;
			 nextY += this.dashYV * dashSpeed;
			this.dashTime--;
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
				console.log(this.name + " WINS!");
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
					this.respawn();
				}
			}
		}
	}

	this.draw = function() {
		if(this.myLives <= 0) {
			return;
		}

		var frameSize = 50;
		var frameNum = sharedAnimCycle % PLAYER_FRAME_NUM;

		for(var i=0;i<this.myLives;i++) {
			canvasContext.drawImage(this.myWarriorPic,
			0 * frameSize, 0,
			frameSize,frameSize,
			( this.startSide == 0 ? i*(frameSize+3) + frameSize/4 :
				canvas.width - (i+1)*(frameSize+3) - frameSize/4)
			,frameSize/4,
			frameSize,frameSize);
		}
		
		if(this.invulTime > 0) {
			this.invulTime--;
			if(this.invulTime%5 < 2) {
				return;
			}
		}

		if(this.reloadTime > 0) {
			this.reloadTime--;
			canvasContext.beginPath();
			canvasContext.strokeStyle = "#cccccc";
	      	canvasContext.ellipse(this.x, this.y+5,
	      		frameSize/3, frameSize/7, 0.0, 0.0, Math.PI*2);
			canvasContext.stroke();
		}

		canvasContext.save();
		canvasContext.translate(this.x, this.y);
		if(this.lastMovedRight) {
			canvasContext.scale(-1, 1);
		}
		canvasContext.drawImage(this.myWarriorPic,
			frameNum * frameSize, 0,
			frameSize,frameSize,
			-frameSize/2, -frameSize*5/6,
			frameSize,frameSize);
		canvasContext.restore();
	}
}
