var shotList = [];

function resetShots() {
	shotList = [];
}

const PLAYER_ARROW_RELOAD = 35;
const PLAYER_FIRE_BALL_RELOAD = 70;
const PLAYER_SWORD_RELOAD = 50;
const PLAYER_HAMMER_RELOAD = 100;
const PLAYER_AXE_RELOAD = 30;
const PLAYER_SPEAR_RELOAD = 5;
const PLAYER_DAGGER_RELOAD = 5;
const PLAYER_SHIELD_RELOAD = 60;

var fireStaffSound = new SoundOverlapsClass("audio/fireball")
var sliceSound = new SoundOverlapsClass("audio/slice")
var shieldSound = new SoundOverlapsClass("audio/shield")

function arrowShot() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_ARROW_RELOAD;
		
		var angle = Math.atan2(mouseY-fromPlayer.y,mouseX-fromPlayer.x);
		var newShot = new shotClassArrow(fromPlayer, angle);

		shotList.push(newShot);
	}
}

function fireStaff() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_FIRE_BALL_RELOAD;
		
		var angle = Math.atan2(mouseY-fromPlayer.y,mouseX-fromPlayer.x);
		var newShot = new shotClassFireball(fromPlayer, angle);
		shotList.push(newShot);
	}
}

function stabDagger() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_DAGGER_RELOAD;
		
		var angle = Math.atan2(mouseY-fromPlayer.y,mouseX-fromPlayer.x);
		var newShot = new shotClassDagger(fromPlayer, angle);
		
		shotList.push(newShot);
	}
}

function stabSpear() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SPEAR_RELOAD;
		
		var newShot = new shotClassSpear(fromPlayer, fromPlayer.prevMoveAng);

		shotList.push(newShot);
	}
}

function raiseShield() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime2 <= 0) {
		fromPlayer.reloadTime2 = PLAYER_SHIELD_RELOAD;
		
		var newShot = new shotClassShield(fromPlayer, fromPlayer.prevMoveAng);
		
		shotList.push(newShot);
	}
}

function swingSword() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SWORD_RELOAD;
		fromPlayer.windup = PLAYER_SWORD_RELOAD - 10;
		fromPlayer.radius = 120;
		fromPlayer.circleColor = "Black"
	}
}

function swingHammer() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_HAMMER_RELOAD;
		fromPlayer.windup = PLAYER_HAMMER_RELOAD - 10;
		fromPlayer.radius = 200;
		fromPlayer.circleColor = "Blue"
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
