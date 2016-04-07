var enemyList = [];

function resetEnemies() {
	enemyList = [];
}

function spawnEnemies() {
	for(var i=0;i<10;i++) {
		var newEnemy = new enemyClass();
		newEnemy.reset(demonPic, Math.random() * canvas.width, Math.random() * canvas.height);
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