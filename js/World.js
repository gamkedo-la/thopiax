const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYERSTART = 2;
const TILE_GOAL = 3;
const TILE_KEY = 4;
const TILE_DOOR = 5;

var levelOne = [ {kind: TILE_WALL, x: 174, y: 175},
				 {kind: TILE_WALL, x: 509, y: 139},
				 {kind: TILE_WALL, x: 609, y: 239},
				 {kind: TILE_WALL, x: 359, y: 89},
				 {kind: TILE_WALL, x: 309, y: 389},
				 {kind: TILE_WALL, x: 109, y: 339},
				 {kind: TILE_WALL, x: 440, y: 440}/*,
				 {kind: TILE_KEY, x: 100, y: 350},
				 {kind: TILE_DOOR, x: 110, y: 20},
				 {kind: TILE_GOAL, x: 50, y: 475}*/ ];
var worldData = [];

// still used for tiling ground, for now, also for assumption of how large level parts are from their corners
const WORLD_W = 50;
const WORLD_H = 50;
const WORLD_GAP = 2;
const WORLD_COLS = 16;
const WORLD_ROWS = 12;

const ARENA_HALF_WID = 355.0;
const ARENA_HALF_HEI_RATIO_INV = 353.0/257.0;

function getLevelPieceIndexAtPixelCoord(atX, atY) {
	var xFromCenter = atX - canvas.width/2;
	var yFromCenter = (atY - canvas.height/2)*ARENA_HALF_HEI_RATIO_INV;
	var distFromCenter = Math.sqrt(xFromCenter*xFromCenter + yFromCenter*yFromCenter);

	if(distFromCenter > ARENA_HALF_WID) {
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
	/*var arrayIndex = 0;
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
*/
	canvasContext.drawImage(arenaWallsBG,
		0,0);

	for (var i = 0; i < worldData.length; i++) {
		if(worldData[i].kind != TILE_GROUND) { // skip these as "removed"
			canvasContext.drawImage(worldPics[worldData[i].kind],worldData[i].x,worldData[i].y);
		}
	}
} // end of drawWorld func
