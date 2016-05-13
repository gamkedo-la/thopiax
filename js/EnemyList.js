var enemyList = [];

var enemyWaveLists = [[2, 0, 0],
                      [4, 0, 0],
                      [2, 2, 0],
                      [4, 4, 0],
                      [2, 0, 1],
                      [4, 4, 2]];

var enemyTypes = [enemyClass, enemySkeletonClass, enemyMinotaurClass];
var currentWave = 0;
var lastScriptedWave = enemyWaveLists.length - 1;

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
	resetEnemies();
	
	var spawnCount = 0;
	if(currentWave < enemyWaveLists.length){
		for(var i = 0; i < enemyWaveLists[currentWave].length; i++){
			for(var j = 0; j < enemyWaveLists[currentWave][i]; j++){
				var newEnemy = new enemyTypes[i](spawns[spawnCount % spawns.length].x,
				                                 spawns[spawnCount++ % spawns.length].y);
				
				enemyList.push(newEnemy);
			}
		}
	}
}

function additionalMinotaurs(additionalWaves){
	var result = 0;
	for(var i = 0; i < additionalWaves; i++){
		result++;
		if(i % 3 === 1){
			result -= 2;
		}
	}
	return result;
}

function moveEnemies() {
	for(var i=enemyList.length-1; i>=0; i--) {
		enemyList[i].act();
		if(enemyList[i].readyToRemove) {
			enemyList.splice(i,1);
		}
	}
	
	//not the best place for this code, but it works
	if(enemyList.length === 0){
		currentWave++
		if(currentWave > lastScriptedWave){
			var wavesPastLast = currentWave-lastScriptedWave;
			enemyWaveLists[currentWave] = [enemyWaveLists[lastScriptedWave][0] + wavesPastLast,
			                               enemyWaveLists[lastScriptedWave][1] + Math.floor(wavesPastLast/2),
			                               enemyWaveLists[lastScriptedWave][2] + additionalMinotaurs(wavesPastLast)];
		}
		
		spawnEnemies();
	}
}

function drawEnemies() {
	// sorting on y position to achieve back-to-front draw order
	enemyList.sort(function(a, b) {return a.y - b.y});

	for(var i=0; i<enemyList.length; i++) {
		enemyList[i].draw();
	}
}
