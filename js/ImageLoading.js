var warriorPic = document.createElement("img");
var warriorPicBack = document.createElement("img");
var warriorPicStand = document.createElement("img");
var warrior2Pic = document.createElement("img");
var warrior2PicBack = document.createElement("img");
var warrior2PicStand = document.createElement("img");
var healthBarPic = document.createElement("img")

var arenaWallsBG = document.createElement("img");
var arenaWallsFG = document.createElement("img");
var startMenu = document.createElement("img");
var cursorPic = document.createElement("img");

var throwingAxePic = document.createElement("img");
var shurikenPic = document.createElement("img");
var playerArrowPic = document.createElement("img");
var playerFireballPic = document.createElement("img");

var healingZonePic = document.createElement("img");
var spearStabPic = document.createElement("img");
var playerSlashPic = document.createElement("img");
var playerShieldPic = document.createElement("img");
var demonPic = document.createElement("img");
var spiderPic = document.createElement("img");
var demonNinjaPic = document.createElement("img");
var basicEnemyPic = document.createElement("img");
var worldPics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	// console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/"+fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	beginLoadingImage(worldPics[worldCode], fileName);
}

function loadImages() {
	var imageList = [
		{varName: warriorPic, theFile: "heavy_run_strip60.png"},
		{varName: warriorPicBack, theFile: "warrior-back.png"},
		{varName: warriorPicStand, theFile: "warrior.png"},
		{varName: warrior2Pic, theFile: "range_idle_strip.png"},
		{varName: warrior2PicBack, theFile: "warrior2-back.png"},
		{varName: warrior2PicStand, theFile: "warrior2.png"},
		{varName: healthBarPic, theFile: "hpBar.png"},

		{varName: throwingAxePic, theFile: "throwingAxe.png"},
		{varName: shurikenPic, theFile: "shuriken.png"},
		{varName: playerArrowPic, theFile: "arrow.png"},
		{varName: playerFireballPic, theFile: "fireball.png"},

		{varName: healingZonePic, theFile: "healingZone.png"},
		{varName: spearStabPic, theFile: "spearStabPic.png"},
		{varName: playerSlashPic, theFile: "swordswipe.png"},
		{varName: playerShieldPic, theFile: "shieldblock.png"},
		{varName: demonPic, theFile: "demon.png"},
		{varName: spiderPic, theFile: "spiderPic.png"},
		{varName: demonNinjaPic, theFile: "demonNinja.png"},
		{varName: basicEnemyPic, theFile: "basicEnemy.png"},

		{varName: arenaWallsBG, theFile: "arena-back.png"},
		{varName: arenaWallsFG, theFile: "arena-fg.png"},
		{varName: startMenu, theFile: "startMenu.png"},
		{varName: cursorPic, theFile: "cursor.png"},


		{worldType: TILE_GROUND, theFile: "world_ground.png"},
		{worldType: TILE_WALL, theFile: "world_wall.png"},
		{worldType: TILE_GOAL, theFile: "world_goal.png"},
		{worldType: TILE_KEY, theFile: "world_key.png"},
		{worldType: TILE_DOOR, theFile: "world_door.png"}
		];

	picsToLoad = imageList.length;

	for(var i=0;i<imageList.length;i++) {
		if(imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
		}
	}
}
