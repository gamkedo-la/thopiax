var canvas, canvasContext;

var blueWarrior = new warriorClass();
var redWarrior = new warriorClass();

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
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	blueWarrior.move();
	redWarrior.move();
	moveShots();
}

function drawAll() {
	drawWorld();
	blueWarrior.draw();
	redWarrior.draw();
	drawShots();
}
