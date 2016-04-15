
var TWOPI = Math.PI * 2.0;
var PI8 = Math.PI / 8.0;
var PI4 = Math.PI / 4.0;

var UP_L 	= 0;
var UP 		= 1;
var UP_R 	= 2;
var RIGHT	= 3;
var DW_R 	= 4;
var DOWN	= 5;
var DW_L 	= 6;
var LEFT	= 7;

var OPPOSITE = [ 4, 5, 6, 7, 0, 1, 2, 3 ];
//			   UP_L			UP		   UP_R		   RIGHT		 DW_R		  DOWN		    DW_L		LEFT
var NBH = [ [LEFT,UP], [UP_L,UP_R], [UP,RIGHT], [UP_R,DW_R], [RIGHT,DOWN], [DW_R,DW_L], [LEFT,DOWN], [UP_L,DW_L], 	[], 	[], 	 ]
var DIRS = [ [-1,-1], 	  [0,-1],  	  [1,-1], 	   [1,0], 		 [1,1],		  [0,1], 	   [-1,1], 	   [-1,0] ];



function AIH(_unit) {
	this.active = true;
	this.unit = _unit;
	//
	this.updateCtr = 0;
	this.moved = false;
	this.moveX = 0;
	this.moveY = 0;
}

AIH.UPDATE_CD = 6;

AIH.sectorForAngle = function(_angle) 
{
	_angle += Math.PI;
	//
	var sector = LEFT;
	var idx = 0;
	for(var a=PI8; a < TWOPI; a += PI4) {
		if(_angle >= a && _angle < a+PI4) {
			sector = idx;
			break;
		}
		idx++;
	}
	//
	return sector;
};




AIH.prototype.noCmd = function(_nA) {
	return false;
};

AIH.prototype.melee = function() {
	// Countdown to new decision
	if(this.updateCtr++ < AIH.UPDATE_CD) {
		return;
	}
	// Reset 
	this.moveX = 0;
	this.moveY = 0;
	this.moved = false;
	var rnd = Math.random() < 0.5 ? [0,1] : [1,0]; 	// Used to mix up selection of new directions
	// Calculate sector threat levels
	var sectorThreats = [];
	for(var i=0; i < 8; i++) {
		sectorThreats[i] = 0;
	}
	for(var i in enemyList) {
		var enm = enemyList[i];
		var distance = Math.abs(enm.y - this.unit.y) + Math.abs(enm.x - this.unit.x);
		var angle = Math.atan2(enm.y - this.unit.y, enm.x - this.unit.x);
		var sector = AIH.sectorForAngle(angle);
		sectorThreats[sector] += 100000 / Math.pow(distance,2);
	}
	//console.log(sectorThreats);
	//alert();
	// Sort sectors according to threat level
	var sortedIndices = [];
	var nonThreats = [];
	for(var tIdx=0; tIdx < 8; tIdx++) {
		if(sectorThreats[tIdx] == 0) {
			nonThreats.push(tIdx);
		}
		var sortIdx = 0;
		for(var i in sortedIndices) {
			if(sectorThreats[tIdx] == sectorThreats[sortedIndices[i]] && Math.random() > 0.5) {
				sortIdx = i;
				break;
			} else if(sectorThreats[tIdx] > sectorThreats[sortedIndices[i]]) {
				sortIdx = i;
				break;
			}
		}
		sortedIndices.splice(sortIdx, 0, tIdx);
	}
	// 
	for(var i in sortedIndices) {
		if(this.unit.name.indexOf("Melee") != -1 && sectorThreats[sortedIndices[i]] > 4) {
			//console.log(sortedIndices[0] + ": ", sectorThreats[sortedIndices[0]]);	
		}
		var sector = sortedIndices[i];
		if(sectorThreats[sector] < 8) {
			break; 	// At this point, there are no immediate threats that requires running away
		}
		var esc = OPPOSITE[sector]; 	// Direct escape vector
		var escapeVectors = [DIRS[esc]]; 	// Start a list of candidate escape vectors
		// Iterate from the direct escape and into its neighboring vectors and so on...
		var nbh_v0 = esc;
		var nbh_v1 = esc;
		for(var j=0; j < 3; j++) {	
			nbh_v0 = NBH[nbh_v0][rnd[0]];
			nbh_v1 = NBH[nbh_v1][rnd[1]];
			escapeVectors.push(DIRS[nbh_v0]);
			escapeVectors.push(DIRS[nbh_v1]);
		}
		//console.log(this.unit.name, esc);
		//alert();
		for(var j in escapeVectors) {
			var xMod = PLAYER_MOVE_SPEED * escapeVectors[j][0];
			var yMod = PLAYER_MOVE_SPEED * escapeVectors[j][1];
			if(AIH.onTileGround(this.unit.x + xMod, this.unit.y + yMod)) {
				this.moveX = xMod;
				this.moveY = yMod;
				this.moved = true;
				this.updateCtr = 0;
				return;
			}
		}
	}
	// Approach center if coast is clear
	if(Math.random() < 0.01) {
		var angle = Math.atan2((canvas.height/2) - this.unit.y, (canvas.width/2) - this.unit.x);
		var mapCenter = AIH.sectorForAngle(angle);
		var approachVectors = [DIRS[mapCenter]]; 	// Start a list of candidate approach vectors
		var nbh_v0 = mapCenter;
		var nbh_v1 = mapCenter;
		for(var j=0; j < 3; j++) {	
			nbh_v0 = NBH[nbh_v0][rnd[0]];
			nbh_v1 = NBH[nbh_v1][rnd[1]];
			approachVectors.push(DIRS[nbh_v0]);
			approachVectors.push(DIRS[nbh_v1]);
		}
		for(var j in approachVectors) {
			var xMod = PLAYER_MOVE_SPEED * approachVectors[j][0];
			var yMod = PLAYER_MOVE_SPEED * approachVectors[j][1];
			if(AIH.onTileGround(this.unit.x + xMod, this.unit.y + yMod)) {
				this.moveX = xMod;
				this.moveY = yMod;
				this.moved = true;
				this.updateCtr = 0;
				return;
			}
		}
	}
};




AIH.onTileGround = function(_x, _y) {
	var walkIntoLevelPieceIndex = getLevelPieceIndexAtPixelCoord(_x, _y);
	var walkIntoLevelPieceType = TILE_GROUND;
	if(walkIntoLevelPieceIndex != undefined) {
		walkIntoLevelPieceType = worldData[walkIntoLevelPieceIndex].kind;
	}
	//
	return walkIntoLevelPieceType == TILE_GROUND;
}
