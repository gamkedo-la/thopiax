var shotList = [];
const PLAYER_ARROW_SPEED = 7.0;

function resetShots() {
	shotList = [];
}

function fireShot() {
	var newShot = new shotClass();
	newShot.reset(playerArrowPic, playerRanged, PLAYER_ARROW_SPEED, mouseX, mouseY, 40, false, true);
	shotList.push(newShot);
}

function swingSword() {
	var newShot = new shotClass();
	newShot.reset(playerSlashPic, playerFighter, 0, mouseX, mouseY, 10, true, false, true);
	shotList.push(newShot);
}

function raiseShield() {
	var newShot = new shotClass();
	newShot.reset(playerShieldPic, playerFighter, 0, mouseX, mouseY, 10, true, false, false, true);
	shotList.push(newShot);
}

function moveShots() {
	for(var i=shotList.length-1; i>=0; i--) {
		shotList[i].move();
		if(shotList[i].readyToRemove) {
			shotList.splice(i,1);
		}
	}
}

function drawShots() {
	for(var i=0; i<shotList.length; i++) {
		shotList[i].draw();
	}
}