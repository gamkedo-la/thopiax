var canvas, canvasContext;
var gameMusic = new BackgroundMusicClass();

var playerRanged = new warriorClass();
var playerFighter = new warriorClass();
var previousRangedKillCount;
var previousFighterKillCount;

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

	gameMusic.loopSong("audio/soundtrack1");

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

	if(playerRanged.myLives <= 0 && playerFighter.myLives <= 0) {
		previousRangedKillCount = playerRanged.killCount;
		previousFighterKillCount = playerFighter.killCount;

		currentWave = 0; // reset to first level when players die
		loadLevel(levelOne);
		gameIsGoing = false;
		gameMusic.loopSong("audio/soundtrack1");
	}

	moveShots();
	moveEnemies();
	AIH.gridDangerScan();	// Need to update the AI Helper "dangerscape" every cycle.
}

function drawAll() {
	drawWorld();

	if (healZone.timer > 0){
		canvasContext.drawImage(healingZonePic, healZone.x -100, healZone.y -100)
		healZone.timer--;
	} else {
		healZone.isUp = false;
	}


	playerRanged.draw();
	playerFighter.draw();
	drawEnemies();
	drawShots();

	canvasContext.drawImage(arenaWallsFG,
		0,canvas.height-arenaWallsFG.height);
}
