var shotList = [];
const PLAYER_ARROW_SPEED = 7.0;

function resetShots() {
	shotList = [];
}

function fireShot() {
	var newShot = new shotClass();
	newShot.reset(playerArrowPic, blueWarrior, PLAYER_ARROW_SPEED, mouseX, mouseY);
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