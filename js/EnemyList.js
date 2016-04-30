var enemyList = [];

var enemyWaveLists = [[3, 3], [6, 6]];
var enemyTypes = [enemyClass, enemyNinjaClass];
var currentWave = 1;

const START_ENEMY_COUNT = 12;

var whichGate = 1;

var spawn = function(_x, _y){
	this.x = _x;
	this.y = _y;
};

var spawns = [new spawn(400, 50),
              new spawn(750, 300),
              new spawn(400, 550),
              new spawn(50, 300)];

function resetEnemies() {
	enemyList = [];
}

function spawnEnemies() {
	var spawnCount = 0;
	for(var i = 0; i < enemyWaveLists[currentWave].length; i++){
		for(var j = 0; j < enemyWaveLists[currentWave][i]; j++){
			var newEnemy = new enemyTypes[i]();
			newEnemy.reset(spawns[spawnCount % spawns.length].x,
			               spawns[spawnCount++ % spawns.length].y);
			
			enemyList.push(newEnemy);
		}
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
