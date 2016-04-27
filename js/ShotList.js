var shotList = [];

function resetShots() {
	shotList = [];
}

const PLAYER_ARROW_SPEED = 7.0;
const PLAYER_ARROW_RELOAD = 35;
const PLAYER_ARROW_LIFE = 40;

const PLAYER_FIRE_BALL_SPEED = 3.5;
const PLAYER_FIRE_BALL_RELOAD = 70;
const PLAYER_FIRE_BALL_LIFE = 120;

const PLAYER_SWORD_RELOAD = 100;
const PLAYER_SPEAR_RELOAD = 5;
const PLAYER_SHIELD_RELOAD = 15;
var fireStaffSound = new SoundOverlapsClass("audio/fireball")
var sliceSound = new SoundOverlapsClass("audio/slice")
var sheildSound = new SoundOverlapsClass("audio/sheild")

function arrowShot() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_ARROW_RELOAD;
		var newShot = new shotClass();
		newShot.reset(playerArrowPic, fromPlayer, PLAYER_ARROW_SPEED, mouseX, mouseY, PLAYER_ARROW_LIFE, false, true);
		shotList.push(newShot);
	}
}

function fireStaff() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_FIRE_BALL_RELOAD;
		var newShot = new shotClass();
		newShot.reset(playerFireballPic, fromPlayer, PLAYER_FIRE_BALL_SPEED, mouseX, mouseY, PLAYER_FIRE_BALL_LIFE, false, false);
		newShot.isSpinningRate = 0.7;
		shotList.push(newShot);
		fireStaffSound.play()
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
		sliceSound.play()
	}
}

function stabSpear() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SPEAR_RELOAD;

		var newShot = new shotClass();
		newShot.reset(playerSlashPic, fromPlayer, 0, mouseX, mouseY, 15, true, false, true);
		shotList.push(newShot);
		sliceSound.play()
	}
}

function raiseShield() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SHIELD_RELOAD;
		var newShot = new shotClass();
		newShot.reset(playerShieldPic, fromPlayer, 0, mouseX, mouseY, 60, true, false, false, true);
		shotList.push(newShot);
		sheildSound.play();
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
