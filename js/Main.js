var canvas, canvasContext;

var playerRanged = new warriorClass();
var playerFighter = new warriorClass();

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
	playerFighter.reset(warriorPic,warriorPicBack,warriorPicStand, "Melee Dude", 0)
	playerRanged.reset(warrior2Pic,warrior2PicBack,warrior2PicStand, "Ranged Dudette", 1);
	spawnEnemies();
}

function updateAll() {
	sharedAnimCycle++;

	moveAll();
	drawAll();
}

function moveAll() {
	playerRanged.move();
	playerFighter.move();
	moveShots();
	moveEnemies();
}

function drawAll() {
	drawWorld();
	playerRanged.draw();
	playerFighter.draw();
	drawEnemies();
	drawShots();

	canvasContext.drawImage(arenaWallsFG,
		0,canvas.height-arenaWallsFG.height);
}
