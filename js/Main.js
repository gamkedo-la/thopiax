var canvas, canvasContext;

var blueWarrior = new warriorClass();
var redWarrior = new warriorClass();

var sharedAnimCycle = 0;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

	loadImages();
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	setupInput();

	loadLevel(levelOne);
}

function loadLevel(whichLevel) {
	worldData = JSON.parse(JSON.stringify(whichLevel));
	blueWarrior.reset(warriorPic, "Melee Dude", 1)
	redWarrior.reset(warrior2Pic, "Ranged Dudette", 0);
	spawnEnemies();
}

function updateAll() {
	sharedAnimCycle++;
	
	moveAll();
	drawAll();
}

function moveAll() {
	blueWarrior.move();
	redWarrior.move();
	moveShots();
	moveEnemies();
}

function drawAll() {
	drawWorld();
	blueWarrior.draw();
	redWarrior.draw();
	drawEnemies();
	drawShots();

	canvasContext.drawImage(arenaWallsFG,
		0,canvas.height-arenaWallsFG.height);
}
