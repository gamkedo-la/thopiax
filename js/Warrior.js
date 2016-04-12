const PLAYER_MOVE_SPEED = 5.0;

const PLAYER_FRAME_NUM = 60;

const DASH_DURATION = 28.0;
const DASH_MAX_SPEED = 11.0;

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

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

	this.dashTime;
	this.dashXV;
	this.dashYV;

	this.setupInput = function(upKey, rightKey, downKey, leftKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
	}

	this.reset = function(whichImage, warriorName, startPos) {
		this.name = warriorName;
		this.myWarriorPic = whichImage;
		this.keysHeld = 0;
		this.updateKeyReadout();
		this.dashTime = 0;
		this.x = 300 + startPos * 200;
		this.y = 300;
	} // end of warriorReset func

	this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + this.keysHeld;
	}

	this.dashAtMouse = function() {
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
	}

	this.draw = function() {
		var frameSize = 50;
		var frameNum = sharedAnimCycle % PLAYER_FRAME_NUM;
		
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
