

function GridCell(_x, _y)
{
	this.x = _x; 
	this.y = _y;
	this.cx = _x*T_WIDTH + T_HALF;
	this.cy = _y*T_HEIGHT + T_HALF;
	this.blocked = !AIH.onTileGround(this.cx, this.cy);
	this.done = false;
	this.danger = 0.0;
}

GridCell.compareDanger = function(a, b) 
{
  if(a.danger < b.danger) {
    return -1;
  }
  if(a.danger > b.danger) {
    return 1;
  }
  return 0;
}



//---------------------------------------------------------



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
var DIRS = [ [-1,-1], 	  [0,-1],  	  [1,-1], 	   [1,0], 		 [1,1],		  [0,1], 	   [-1,1], 	   [-1,0] ];
var NBH = [ [LEFT,UP], [UP_L,UP_R], [UP,RIGHT], [UP_R,DW_R], [RIGHT,DOWN], [DW_R,DW_L], [LEFT,DOWN], [UP_L,DW_L] ];


//---------------------------------------------------------




function AIH(_unit) {
	this.active = true;
	this.unit = _unit;
	this.path = [];
	//
	this.updateCtr = 0;
	this.moved = false;
	this.moveX = 0;
	this.moveY = 0;
}




const T_WIDTH = WORLD_W / 2.0;
const T_HEIGHT = (WORLD_H*worldTiltYDampen) / 2.0;
const T_HALF = T_WIDTH / 2.0;
const AIH_COLS = WORLD_COLS * 2;
const AIH_ROWS = Math.floor(WORLD_ROWS * 2 * worldTiltYDampen);

AIH.grid = [];
AIH.allCells = [];
AIH.UPDATE_CD = 6;
AIH.DANGER_FALLOF = 5;



AIH.setupGrid = function() 
{
	for(var x=0; x < AIH_COLS; x++) {
		var column = [];
		for(var y=0; y < AIH_ROWS; y++) {
			var cell = new GridCell(x,y);
			cell.blocked = !AIH.onTileGround(cell.cx, cell.cy);
			column.push(cell);
			AIH.allCells.push(cell);
		}	
		AIH.grid.push(column);
	}
};

AIH.runGridCommand = function(_cmd) 
{
	for(var x in AIH.grid) {
		for(var y in AIH.grid[x]) {
			_cmd(AIH.grid[x][y]);
		}
	}
};



AIH.gridDangerScan = function()
{
	AIH.runGridCommand(function(_cell) {_cell.danger=0.0;});
	//
	var dangerRange = 6;
	for(var i in enemyList) {
		var enm = enemyList[i];
		var ex = Math.floor(enm.x / T_WIDTH);
		var ey = Math.floor(enm.y / T_HEIGHT);
		var startX = Math.max(ex-dangerRange, 0);
		var startY = Math.max(ey-dangerRange, 0);
		var endX = Math.min(ex+dangerRange+1, AIH_COLS);
		var endY = Math.min(ey+dangerRange+1, AIH_ROWS);
		for(var x=startX; x < endX; x++) {
			for(var y=startY; y < endY; y++) {
				if(AIH.grid[x][y].blocked) continue;
				var ring = Math.max(Math.abs(ex-x), Math.abs(ey-y));
				AIH.grid[x][y].danger = Math.max(100.0 - (AIH.DANGER_FALLOF*ring*ring), AIH.grid[x][y].danger);
			}	
		}
	}
	return;
	//
	canvasContext.save();
	for(var x in AIH.grid) {
		for(var y in AIH.grid[x]) {
			var cell = AIH.grid[x][y];

			//canvasContext.globalAlpha = 0.008 * cell.danger;
			//cell.blocked && colorRect(cell.x*T_WIDTH,cell.y*T_HEIGHT, T_WIDTH, T_HEIGHT, "magenta");
			//canvasContext.globalAlpha = 1.0;
			canvasContext.strokeStyle = "white";
			canvasContext.lineWidth = "0.2";
			canvasContext.strokeRect(cell.x*T_WIDTH,cell.y*T_HEIGHT, T_WIDTH, T_HEIGHT);
			//colorText(cell.danger.toFixed(2), (cell.x*T_WIDTH)+10,(cell.y*T_HEIGHT)+T_HALF, "black");	
			canvasContext.font="8px Arial";
			colorText(cell.x +", "+ cell.y, (cell.x*T_WIDTH)+4,(cell.y*T_HEIGHT)+T_HALF+4, "black");	
		}
	}
	//alert();
	canvasContext.restore();
};



AIH.prototype.noCmd = function(_nA) 
{
	return false;
};

AIH.prototype.melee = function() 
{

	this.moved = false;
	while(!this.moved && this.path.length > 0) {
		var nextCell = this.path[0];
		this.moveX = 0;
		if(Math.abs(this.unit.x - nextCell.cx) >= PLAYER_MOVE_SPEED) {
			this.moveX = this.unit.x < nextCell.cx ? PLAYER_MOVE_SPEED : -PLAYER_MOVE_SPEED;
		} else this.unit.x = nextCell.cx;
		this.moveY = 0;
		if(Math.abs(this.unit.y - nextCell.cy) >= PLAYER_MOVE_SPEED) {
			this.moveY = this.unit.y < nextCell.cy ? PLAYER_MOVE_SPEED : -PLAYER_MOVE_SPEED;
			this.moveY *= worldTiltYDampen;
		} else this.unit.y = nextCell.cy;
		this.moved = this.moveX != 0 || this.moveY != 0;
		if(!this.moved) {
			this.path.shift();
			if(this.path.length > 0 && this.path[0].danger > 50) {
				break;
			}
		}
	}

	if(this.moved) {
		return;
	}

	this.path = [];
	var gx = Math.floor(this.unit.x / T_WIDTH);
	var gy = Math.floor(this.unit.y / T_HEIGHT);
	var homeCell = AIH.grid[gx][gy];
	if(homeCell.danger < 50) return;
	// 
	// Collect cells in nearby area
	var nearCells = [];
	var scanRange = 5;
	var startX = Math.max(gx-scanRange, 0);
	var startY = Math.max(gy-scanRange, 0);
	var endX = Math.min(gx+scanRange+1, AIH_COLS);
	var endY = Math.min(gy+scanRange+1, AIH_ROWS);
	for(var x=startX; x < endX; x++) {
		for(var y=startY; y < endY; y++) {
			if(AIH.grid[x][y].blocked) continue;
			nearCells.push(AIH.grid[x][y]);
		}	
	}
	// Find the safest cells offered in nearby area
	nearCells = nearCells.sort(GridCell.compareDanger);
	var lowest = 100.0;
	for(var i in nearCells) {
		lowest = Math.min(lowest, nearCells[i].danger);
	}
	var safeCells = [];
	var bestDist = AIH_ROWS + AIH_COLS;
	for(var i in nearCells) {
		if(nearCells[i].danger <= lowest) {
			safeCells.push(nearCells[i]);
			bestDist = Math.min(bestDist, AIH.cellDistance(homeCell, nearCells[i]));
		}	
	}
	// Select candidate cells from the safest cells that are also the closest
	var candidateCells = [];
	for(var i in safeCells) {
		if(AIH.cellDistance(homeCell, safeCells[i]) <= bestDist) {
			candidateCells.push(safeCells[i]);
			//colorRect(safeCells[i].x*T_WIDTH,safeCells[i].y*T_HEIGHT, T_WIDTH, T_HEIGHT, "blue");
		} else {
			//colorRect(nearCells[i].x*T_WIDTH,nearCells[i].y*T_HEIGHT, T_WIDTH, T_HEIGHT, "red");
		}
	}

	var dangerTolerance = AIH.DANGER_FALLOF*4; // ring*ring
	var pathDone = false;
	var break_out = 500;
	//this.report = [];
	while(break_out-- > 0 && candidateCells.length > 0 && !pathDone) {
		var targetCell = candidateCells.splice(Math.floor(Math.random()*candidateCells.length), 1)[0];
		//colorRect(targetCell.x*T_WIDTH,targetCell.y*T_HEIGHT, T_WIDTH, T_HEIGHT, "green");
		//
		// start A*
		AIH.runGridCommand(function(_cell) {_cell.done=false;});
		var current = new AStarNode(null, homeCell, targetCell);
		var open = [current];
		var break_out_2 = 500;
		while(break_out_2-- > 0 && !pathDone) {
			var nbhCells = [];
			for(var dir in DIRS) {
				nbhCells.push(AIH.grid[current.cell.x+DIRS[dir][0]][current.cell.y+DIRS[dir][1]]);
			}
			for(var i in nbhCells) {
				if(nbhCells[i] == null || nbhCells[i].blocked || nbhCells[i].done || nbhCells[i].danger > current.danger || nbhCells[i].danger > homeCell.danger) {
					continue;
				}
				if(i % 2 == 0) {
					var nbh_0 = nbhCells[NBH[i][0]];
					var nbh_1 = nbhCells[NBH[i][1]];
					if(nbh_0 == null || nbh_1 == null || nbh_0.blocked || nbh_1.blocked) {
						continue;
					}
				}
				var node = new AStarNode(current, nbhCells[i], targetCell, (i % 2 == 0));
				var upgradedExisting = false;
				for(var j in open) {
					if(open[j].cell == nbhCells[i]) {
						if(node.f < open[j].f) {
							open[j] = node;
							upgradedExisting = true;
							break;
						}
					}
				}
				if(!upgradedExisting) {
					open.push(node);
				}
			}
			if(open.length == 0) {
				break;
			}
			current.cell.done = true;
			open.sort(AStarNode.compareFVal);
			// Remove a random node from the lowest-f-value set and make it the new current-cell
			current = open[0];
			for(var i in open) {
				if(open[i].f != current.f) {
					current = open[Math.floor(Math.random()*i)];
					break;
				}
			}
			open.splice(open.indexOf(current), 1);
			pathDone = current.cell == targetCell;
			//this.report.push(current);
		}
	}
	this.path = [];
	break_out = 100;
	while(break_out-- > 0 && current.cameFrom != null) {
		this.path.unshift(current.cell);
		current = current.cameFrom;
	}
	
	return;
	
	for(var i in this.report) {
		//canvasContext.globalAlpha = 0.6;
		colorRect(this.report[i].cell.x*T_WIDTH,this.report[i].cell.y*T_HEIGHT, T_WIDTH, T_HEIGHT, "white");
		canvasContext.globalAlpha = 1.0;
		canvasContext.strokeStyle = "black";
		canvasContext.lineWidth = "0.2";
		canvasContext.strokeRect(this.report[i].cell.x*T_WIDTH,this.report[i].cell.y*T_HEIGHT, T_WIDTH, T_HEIGHT);
		canvasContext.font="8px Arial";
		colorText(this.report[i].cell.danger.toFixed(1), (this.report[i].cell.x*T_WIDTH)+4,(this.report[i].cell.y*T_HEIGHT)+T_HALF+4, "black");	
	}
	
	for(var i in this.path) {
		canvasContext.strokeStyle = "green";
		canvasContext.lineWidth = "1.0";
		canvasContext.strokeRect(this.path[i].x*T_WIDTH,this.path[i].y*T_HEIGHT, T_WIDTH, T_HEIGHT);
	}
	alert();	
};


AIH.cellDistance = function(_cellA, _cellB) 
{
	return Math.max(Math.abs(_cellA.x-_cellB.x), Math.abs(_cellA.y-_cellB.y));	
};


function AStarNode(_parent, _cell, _target, _diag) 
{
	_parent = typeof _parent != 'undefined' ? _parent : null;
	_cell = typeof _cell != 'undefined' ? _cell : null;
	_target = typeof _target != 'undefined' ? _target : null;
	_diag = typeof _diag != 'undefined' ? _diag : false;
	//
	var gMod = _diag ? 60 : 40;
	this.g = _parent != null ? (_parent.g + gMod) : 0;
	this.cell = _cell;
	this.h = (AIH.cellDistance(_cell, _target) * 20) + _cell.danger;
	this.f = this.g + (this.h);
	this.cameFrom = _parent;
}


AStarNode.compareFVal = function(a,b) 
{
	if(a==null) {
		return -1;
	}
	if(a.f == b.f) {
		return 0;
	} 
	if(a.f > b.f) {
		return 1;
	} 
	return -1;
}



AIH.onTileGround = function(_x, _y) 
{
	var walkIntoLevelPieceIndex = getLevelPieceIndexAtPixelCoord(_x, _y);
	var walkIntoLevelPieceType = TILE_GROUND;
	if(walkIntoLevelPieceIndex != undefined) {
		walkIntoLevelPieceType = worldData[walkIntoLevelPieceIndex].kind;
	}
	//
	return walkIntoLevelPieceType == TILE_GROUND;
}
