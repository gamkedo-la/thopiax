var canvas, canvasContext;
var gameMusic = new BackgroundMusicClass();

var playerRanged = new warriorClass();
var playerFighter = new warriorClass();
var previousRangedKillCount;
var previousFighterKillCount;
var activePlayers;

var sharedAnimCycle = 0;

var gameIsGoing = false;

var sndButtonDim=20;
var sndButtonMargin=10;
var sndMute = false;
var musMute = false;

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
	resetShots();
	spawnEnemies();
}

function gameStart(){
	if(controlIndexP1 == 2 && controlIndexP2 == 2){
		return;
	}
	
	activePlayers = 2;
	currentWave = 0; // reset to first level when players die
	loadLevel(levelOne);
	gameIsGoing = true;
	gameMusic.loopSong("audio/soundtrack2");
	
	//Check how many playes are playing
	if(controlIndexP1 >= CONTROL_AI){
		activePlayers--;
	}
	if(controlIndexP2 >= CONTROL_AI){
		activePlayers--;
	}
	
	//Kill players controlled by "None"
	if (controlIndexP1 == 2){
		playerFighter.myLives = 0;
	}
	if (controlIndexP2 == 2){
		playerRanged.myLives = 0;
	}
}

function gameEnd(){
	previousRangedKillCount = playerRanged.killCount;
	previousFighterKillCount = playerFighter.killCount;
	gameIsGoing = false;
	gameMusic.loopSong("audio/soundtrack1");
}

function updateAll() {

	if (gameIsGoing) {
		sharedAnimCycle++;

		moveAll();
		drawAll();

	} else {
		runMenu();
	}

	drawAudioUI();
}

function moveAll() {
	playerRanged.move(controlIndexP2==1);  // the included check is for AI control .../-dalath
	playerFighter.move(controlIndexP1==1); //

	if(playerRanged.myLives <= 0 && playerFighter.myLives <= 0) {
//		previousRangedKillCount = playerRanged.killCount;
//		previousFighterKillCount = playerFighter.killCount;

//		currentWave = 0; // reset to first level when players die
//		loadLevel(levelOne);
//		gameIsGoing = false;
//		gameMusic.loopSong("audio/soundtrack1");
		gameEnd();
	}

	moveShots();
	moveEnemies();
	AIH.gridDangerScan();	// Need to update the AI Helper "dangerscape" every cycle.
}

function drawAudioUI() {
	canvasContext.drawImage(audioIcons,
		(sndMute ? sndButtonDim : 0),0,sndButtonDim,sndButtonDim,
		canvas.width-2*sndButtonDim-2*sndButtonMargin,
			canvas.height-sndButtonDim-sndButtonMargin,
		sndButtonDim,sndButtonDim);
	canvasContext.drawImage(audioIcons,
		2*sndButtonDim+(musMute ? sndButtonDim : 0),0,sndButtonDim,sndButtonDim,
		canvas.width-sndButtonDim-sndButtonMargin,
			canvas.height-sndButtonDim-sndButtonMargin,
		sndButtonDim,sndButtonDim);
}

function drawAll() {
	drawWorld();

	if (healZone.timer > 0){
		drawEllipseFill(healZone.x, healZone.y, healZone.diameter, healZone.diameter*worldTiltYDampen, "Green", 0.5);
		drawEllipse(healZone.x, healZone.y, healZone.diameter, healZone.diameter*worldTiltYDampen, "Yellow", 1, 5);
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
