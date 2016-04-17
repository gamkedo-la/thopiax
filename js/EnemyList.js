var enemyList = [];

const START_ENEMY_COUNT = 12;

var whichGate = 1;

var spawnX1 = 400;
var spawnY1 = 50;

var spawnX2 = 750;
var spawnY2 = 300;

var spawnX3 = 400;
var spawnY3 = 550;

var spawnX4 = 50;
var spawnY4 = 300;

function resetEnemies() {
	enemyList = [];
}

function spawnEnemies() {
	for(var i=0;i<START_ENEMY_COUNT;i++) {
		var newEnemy = new enemyClass();

		if (whichGate == 1) {
			newEnemy.reset(demonPic, spawnX1, spawnY1);
		}
		if (whichGate == 2) {
			newEnemy.reset(demonPic, spawnX2, spawnY2);
		}
		if (whichGate == 3) {
			newEnemy.reset(demonPic, spawnX3, spawnY3);
		}
		if (whichGate == 4) {
			newEnemy.reset(demonPic, spawnX4, spawnY4);
		}

		if (whichGate == 4) {
			whichGate = 1;
		} else {
			whichGate ++;
		}

		enemyList.push(newEnemy);
	}
}

function moveEnemies() {
	for(var i=enemyList.length-1; i>=0; i--) {
		enemyList[i].move();
		if(enemyList[i].readyToRemove) {
			enemyList.splice(i,1);
		}
	}
}

function drawEnemies() {
	for(var i=0; i<enemyList.length; i++) {
		enemyList[i].draw();
	}
}
