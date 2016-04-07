const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYERSTART = 2;
const TILE_GOAL = 3;
const TILE_KEY = 4;
const TILE_DOOR = 5;

var levelOne = [ {kind: TILE_WALL, x: 10, y: 15},
				 {kind: TILE_WALL, x: 60, y: 20},
				 {kind: TILE_WALL, x: 160, y: 25},
				 {kind: TILE_WALL, x: 210, y: 30},
				 {kind: TILE_WALL, x: 270, y: 45},
				 {kind: TILE_KEY, x: 100, y: 350},
				 {kind: TILE_DOOR, x: 110, y: 20},
				 {kind: TILE_GOAL, x: 50, y: 475} ];
var worldData = [];

// still used for tiling ground, for now, also for assumption of how large level parts are from their corners
const WORLD_W = 50;
const WORLD_H = 50;
const WORLD_GAP = 2;
const WORLD_COLS = 16;
const WORLD_ROWS = 12;

function getLevelPieceIndexAtPixelCoord(atX, atY) {
	if(atX < 0 || atY < 0 || atX > canvas.width || atY > canvas.height) {
		return TILE_WALL;
	}
	for (var i = 0; i < worldData.length; i++) {
		if(atX > worldData[i].x && atX < worldData[i].x + WORLD_W &&
		   atY > worldData[i].y && atY < worldData[i].y + WORLD_H) {
			return i;
		}
	}
	return undefined;
}

function drawWorld() {
	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;
	for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {

			canvasContext.drawImage(worldPics[TILE_GROUND],drawTileX,drawTileY);
			drawTileX += WORLD_W;
			arrayIndex++;
		} // end of for each col
		drawTileY += WORLD_H;
		drawTileX = 0;
	} // end of for each row

	for (var i = 0; i < worldData.length; i++) {
		if(worldData[i].kind != TILE_GROUND) { // skip these as "removed"
			canvasContext.drawImage(worldPics[worldData[i].kind],worldData[i].x,worldData[i].y);
		}
	};
} // end of drawWorld func
