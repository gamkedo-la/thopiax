var shotList = [];

function resetShots() {
	shotList = [];
}

const PI = 3.14159;

const PLAYER_ARROW_RELOAD = 30;
const PLAYER_SHURIKEN_RELOAD = 100;
const PLAYER_FIRE_BALL_RELOAD = 70;
const PLAYER_SWORD_RELOAD = 40;
const PLAYER_BATTLE_AXE_RELOAD = 75;
const PLAYER_THROWING_AXE_RELOAD = 50;
const PLAYER_SPEAR_RELOAD = 5;
const PLAYER_DAGGER_RELOAD = 5;
const PLAYER_SHIELD_RELOAD = 60;
const PLAYER_HORN_RELOAD = 500;

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

function throwAxe() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime2 <= 0) {
		fromPlayer.reloadTime2 = PLAYER_THROWING_AXE_RELOAD;

		//var angle = Math.atan2(fromPlayer.x + Math.cos( fromPlayer.prevMoveAng ) * 100,fromPlayer.y + Math.sin( fromPlayer.prevMoveAng ) * 100);
		var newShot = new shotClassThrowingAxe(fromPlayer, fromPlayer.prevMoveAng);

		shotList.push(newShot);
	}
}

function throwShuriken() {
	var fromPlayer = playerRanged;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime2 <= 0) {
		fromPlayer.reloadTime2 = PLAYER_SHURIKEN_RELOAD;

		var angle = Math.atan2(mouseY-fromPlayer.y,mouseX-fromPlayer.x);
		var newShot0 = new shotClassShuriken(fromPlayer, angle);
		var skew = PI / 20;
		var newShot1 = new shotClassShuriken(fromPlayer, (angle - skew) % (PI * 2));
		var newShot2 = new shotClassShuriken(fromPlayer, (angle + skew) % (PI * 2));

		shotList.push(newShot0);
		shotList.push(newShot1);
		shotList.push(newShot2);
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
		fromPlayer.frozenTime = 7;
		
		var newShot = new shotClassShield(fromPlayer, fromPlayer.prevMoveAng);

		shotList.push(newShot);
	}
}

function blowHorn () {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime2 <= 0) {
		fromPlayer.reloadTime2 = PLAYER_HORN_RELOAD;

		for(var i=0; i<enemyList.length; i++) {
			enemyList[i].stunTime = STUN_TIME;
		}
	}
}

function swingSword() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_SWORD_RELOAD;
		fromPlayer.windup = PLAYER_SWORD_RELOAD - 10;
		fromPlayer.radius = 120;
		fromPlayer.circleColor = "Blue"
	}
}

function swingBattleAxe() {
	var fromPlayer = playerFighter;
	if(fromPlayer.myLives > 0 && fromPlayer.reloadTime <= 0) {
		fromPlayer.reloadTime = PLAYER_BATTLE_AXE_RELOAD;
		fromPlayer.windup = PLAYER_BATTLE_AXE_RELOAD - 10;
		fromPlayer.frozenTime = fromPlayer.windup;
		fromPlayer.radius = 220;
		fromPlayer.circleColor = "Red"
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
