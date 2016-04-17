var shotList = [];
const PLAYER_ARROW_SPEED = 7.0;

function resetShots() {
	shotList = [];
}
const PLAYER_ARROW_RELOAD = 35;
const PLAYER_SWORD_RELOAD = 100;
const PLAYER_SPEAR_RELOAD = 5;
const PLAYER_SHIELD_RELOAD = 15;

function fireShot() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_ARROW_RELOAD;
		var newShot = new shotClass();
		newShot.reset(playerArrowPic, fromPlayer, PLAYER_ARROW_SPEED, mouseX, mouseY, 40, false, true);
		shotList.push(newShot);
	}
}

function swingSword() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SWORD_RELOAD;
		fromPlayer.windup = PLAYER_SWORD_RELOAD - 10;
		//var newShot = new shotClass();
		//newShot.reset(playerSlashPic, fromPlayer, 0, mouseX, mouseY, 15, true, false, true);
		//shotList.push(newShot);
	}
}

function stabSpear() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SPEAR_RELOAD;

		var newShot = new shotClass();
		newShot.reset(playerSlashPic, fromPlayer, 0, mouseX, mouseY, 15, true, false, true);
		shotList.push(newShot);
	}
}

function raiseShield() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SHIELD_RELOAD;
		var newShot = new shotClass();
		newShot.reset(playerShieldPic, fromPlayer, 0, mouseX, mouseY, 60, true, false, false, true);
		shotList.push(newShot);
	}
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
