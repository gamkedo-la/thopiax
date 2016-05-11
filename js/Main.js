var canvas, canvasContext;

var playerRanged = new warriorClass();
var playerFighter = new warriorClass();

var sharedAnimCycle = 0;

var worldTiltYDampen = 5.0/7.0;

var gameIsGoing = false;


//Prevents player from drag selecting
document.onselectstart = function()
{
    window.getSelection().removeAllRanges();
};

//Prevents player from drag selecting
document.onmousedown = function()
{
    window.getSelection().removeAllRanges();
};

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
	AIH.setupGrid(); 	// AI Helper setup
	playerFighter.reset(warriorPic,warriorPicBack,warriorPicStand, "Melee Dude", 0)
	playerRanged.reset(warrior2Pic,warrior2PicBack,warrior2PicStand, "Ranged Dudette", 1);
	spawnEnemies();
}

function updateAll() {

	if (gameIsGoing) {
		sharedAnimCycle++;

    //check if player is playing
    if (controlIndexP1 == 2){
      playerFighter.myLives = 0;
    }
    if (controlIndexP2 == 2){
      playerRanged.myLives = 0;
    }
		moveAll();
		drawAll();

	} else {
		runMenu();
	}
}

function moveAll() {
	playerRanged.move(controlIndexP2==1);  // the included check is for AI control .../-dalath
	playerFighter.move(controlIndexP1==1); //
	moveShots();
	moveEnemies();
	AIH.gridDangerScan();	// Need to update the AI Helper "dangerscape" every cycle.
}

function drawAll() {
	drawWorld();

	if (playerRanged.healTimer > 0){
		canvasContext.drawImage(healingZonePic, playerRanged.healX -100, playerRanged.healY -100)
		playerRanged.healTimer --;
	} else {
		healZoneIsUp = false;
	}


	playerRanged.draw();
	playerFighter.draw();
	drawEnemies();
	drawShots();

	canvasContext.drawImage(arenaWallsFG,
		0,canvas.height-arenaWallsFG.height);
}
