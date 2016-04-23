





/*--------------------------------------------------------------------------------

                    ____.----.
          ____.----'          \
          \                    \
           \                    \
            \          ____.----'`--.__
             \___.----'          |     `--.____
            /`-._                |       __.-' \
           /     `-._            ___.---'       \
          /          `-.____.---'                \
         /           /  |  \                   _.'
         `.         /   |   \            __.--'
           `-._    /    |    \     __.--'     |
             | `-./     |     \_.-'           |
             |          |                     |
             |          |        CLASS        |
             |          |                     |
    _________|          |    DECLARATIONS     |____________________
             `-.        |                  _.-'
                `-.     |           __..--'
                   `-.  |      __.-'
                      `-|__.--'
                         `
----------------------------------------------------------------------------------*/


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
AIH.grid = [];
AIH.allCells = [];



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











/*--------------------------------------------------------------------------------

                       .-~~~~~~~~~-._       _.-~~~~~~~~~-.
                   __.'              ~.   .~              `.__
                 .'//    SETTINGS      \./                  \\`.
               .'//                     |      CONSTANTS      \\`.
             .'//                       |                       \\`. 
           .'// .-~""""""""~~~~~-._     |     _,-~~~~~""""""""~-. \\`.     
         .'//.-"                   `-.  |  .-'                   "-.\\`.
       .'//______.==============-..   \ | /   ..-=============._______\\`.
     .'________________________________\|/________________________________`.


----------------------------------------------------------------------------------*/


//-------------------------------
//
// 	Directions/Neighborhood
//
//---------------------------
//
        const UP_L=0; const UP=1; const UP_R=2; const RIGHT=3; const DW_R=4; const DOWN=5; const DW_L=6; const LEFT=7;
const OPPOSITE = [4,          5,         6,            7,            0,          1,           2,            3 ];
const DIRS = [ [-1,-1], 	[0,-1],    [1,-1], 	     [1,0], 	   [1,1],		[0,1], 	    [-1,1], 	 [-1,0] ];
const NBH = [ [LEFT,UP], [UP_L,UP_R], [UP,RIGHT], [UP_R,DW_R], [RIGHT,DOWN], [DW_R,DW_L], [LEFT,DOWN], [UP_L,DW_L] ];
//			     UP_L		  UP	    UP_R		 RIGHT		    DW_R		DOWN		 DW_L		  LEFT


//--------------------
//
// 	 Dimensions
//
//----------------
//
const T_WIDTH = WORLD_W / 2.0;
const T_HEIGHT = (WORLD_H*worldTiltYDampen) / 2.0;
const T_HALF = T_WIDTH / 2.0;
const AIH_COLS = WORLD_COLS * 2;
const AIH_ROWS = Math.floor(WORLD_ROWS * 2 * worldTiltYDampen);


//--------------------
//
// 	 AI Config
//
//----------------
//
AIH.UPDATE_CD = 6;
AIH.DANGER_FALLOF = 5;


//---------------------------------------------------------------------------


















/*---------------------------  STATIC FUNCTIONS  ----------------------------------
      


                _
              ./ |    _________________
              /  /   /  __________    //\_
            /'  /   |  (__________)  ||.' `-.________________________
           /   /    |    __________  ||`._.-'~~~~~~~~~~~~~~~~~~~~~~~~`
          /    \     \__(__________)__\\/
         |      `\
         |        |                                ___________________
         |        |___________________...-------'''- - -  =- - =  - = `.
        /|        |                   \-  =  = -  -= - =  - =-   =  - =|
       ( |        |                    |= -= - = - = - = - =--= = - = =|
        \|        |___________________/- = - -= =_- =_-=_- -=_=-=_=_= -|
         |        |                   ```-------...___________________.'
         |________|      
           \    /                                       _
           |    |                              ,,,,,,, /=\
         ,-'    `-,       /\___________       (\\\\\\\||=|
         |        |       \/~~~~~~~~~~~`       ^^^^^^^ \=/
         `--------'                                     `



----------------------------------------------------------------------------------*/


//--------------------
//
// 	     AIH 
//
//----------------
//
AIH.setupGrid = function() 
{// Initialize a 2D array (grid) using current level tile data
	for(var x=0; x < AIH_COLS; x++) {
		var column = [];
		for(var y=0; y < AIH_ROWS; y++) {
			var cell = new GridCell(x,y);
			cell.blocked = !AIH.onTileGround(cell.cx, cell.cy); 	// Check level tile data.
			column.push(cell);
			AIH.allCells.push(cell);
		}	
		AIH.grid.push(column);
	}
};
//
AIH.getGridBlock = function(_cx, _cy, _radius, _filterfunc) 
{// Return an array of a cropped grid section 
	_filterfunc = typeof _filterfunc != 'undefined' ? _filterfunc : function(_cell) {return _cell.blocked;};
	var startX = Math.max(_cx - _radius, 0);
	var startY = Math.max(_cy - _radius, 0);
	var endX = Math.min(_cx + _radius+1, AIH_COLS);
	var endY = Math.min(_cy + _radius+1, AIH_ROWS);
	var blockCells = [];
	for(var x=startX; x < endX; x++) {
		for(var y=startY; y < endY; y++) {
			if(_filterfunc(AIH.grid[x][y])) {
				continue;
			}
			blockCells.push(AIH.grid[x][y]);
		}	
	}
	return blockCells;
};
//
AIH.runGridCommand = function(_cmd) 
{// Run all grid cells through given function
	for(var x in AIH.grid) {
		for(var y in AIH.grid[x]) {
			_cmd(AIH.grid[x][y]);
		}
	}
};
//
AIH.gridDangerScan = function()
{// Update the danger variables in the grid
	AIH.runGridCommand(function(_cell) {_cell.danger=0.0;}); 	// Reset.
	//
	var dangerRange = 6;
	for(var i in enemyList) {
		var enm = enemyList[i];
		var ex = Math.floor(enm.x / T_WIDTH);
		var ey = Math.floor(enm.y / T_HEIGHT);
		var nbhCells = AIH.getGridBlock(ex, ey, 6);
		for(var j in nbhCells) {
			var cell = nbhCells[j];
			var ring = Math.max(Math.abs(ex-cell.x), Math.abs(ey-cell.y));
			cell.danger = Math.max(100.0 - (AIH.DANGER_FALLOF*ring*ring), cell.danger);
		}
	}
	return;
};
//
AIH.cellDistance = function(_cellA, _cellB) 
{// This distance counts as either x OR y distance, whichever is farthest
	return Math.max(Math.abs(_cellA.x-_cellB.x), Math.abs(_cellA.y-_cellB.y));	
};
//
AIH.onTileGround = function(_x, _y) 
{// Check if a world coordinate is passable
	var walkIntoLevelPieceIndex = getLevelPieceIndexAtPixelCoord(_x, _y);
	var walkIntoLevelPieceType = TILE_GROUND;
	if(walkIntoLevelPieceIndex != undefined) {
		walkIntoLevelPieceType = worldData[walkIntoLevelPieceIndex].kind;
	}
	//
	return walkIntoLevelPieceType == TILE_GROUND;
};



//--------------------
//
// 	  GridCell 
//
//----------------
//
GridCell.compareDanger = function(a, b) 
{// SORT INTERFACE
  if(a.danger < b.danger) {
    return -1;
  }
  if(a.danger > b.danger) {
    return 1;
  }
  return 0;
};



//--------------------
//
// 	     A* 
//
//----------------
//
AStarNode.compareFVal = function(a,b) 
{// SORT INTERFACE
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
};












/*---------------------------  INSTANCED FUNCTIONS  ---------------------------------

        


                           __,--"""""""""--,.
                     _ -'"                  _\ ^-,_
                  ,-"                     _/        \_
                /                    /    \          \
              /           _____,--"""     /         )   \
             /           /               /         (     |
            |         /                |                  \
            (     (_/\      )                 /            \
             \        \_          ____,===="""    /        |
              \                /"                /""       |
               \_          _,-" |___,-'--------'"          |
                 "`------""   --"                 ,-'      /
                        /                     ---"        /
                        \___/          __,-----,___       )
                            \     ,--'"============""""-'"
                             "-'" |  |=================/
                                   \   \_________,-"
                                   |   |
                                   |   | 
----------------------------------------------------------------------------------*/


//--------------------
//
// 	  AIH 
//
//----------------
//
AIH.prototype.noCmd = function(_nA) 
{
	return false;
};
//
AIH.prototype.melee = function() 
{// ---
	if(this.moveAlongPath()) {
		return;
	}
	//
	// Decide if we're in danger and if so create an escape path
	this.path = [];
	var gx = Math.floor(this.unit.x / T_WIDTH);
	var gy = Math.floor(this.unit.y / T_HEIGHT);
	var homeCell = AIH.grid[gx][gy];
	if(homeCell.danger < 60 && Math.random()*60 > homeCell.danger) {
		return; 	// No escaping right now.
	}
	// 
	// Find the safest cells offered in nearby area
	var nearCells = AIH.getGridBlock(gx, gy, 5).sort(GridCell.compareDanger);
	var lowest = 100.0;
	for(var i in nearCells) {
		lowest = Math.min(lowest, nearCells[i].danger); // Remember best available safety.
	}
	// Extract only the very safest
	var safeCells = [];
	var bestDist = AIH_ROWS + AIH_COLS;
	for(var i in nearCells) {
		if(nearCells[i].danger <= lowest) {
			safeCells.push(nearCells[i]);
			bestDist = Math.min(bestDist, AIH.cellDistance(homeCell, nearCells[i])); // Remember the closest.
		}	
	}
	// We now know enough to gather the best places to go
	var candidateCells = [];
	for(var i in safeCells) {
		if(AIH.cellDistance(homeCell, safeCells[i]) <= bestDist) {
			candidateCells.push(safeCells[i]);
		}
	}
	//
	// Test candidate safe havens with A* to make sure they are reachable and not too risky
	var pathDone = false;
	var break_out = 500;
	while(break_out-- > 0 && candidateCells.length > 0 && !pathDone) { // Randomly select and test a safe haven
		var targetCell = candidateCells.splice(Math.floor(Math.random()*candidateCells.length), 1)[0];
		//colorRect(targetCell.x*T_WIDTH,targetCell.y*T_HEIGHT, T_WIDTH, T_HEIGHT, "green");
		//
		// start A*
		AIH.runGridCommand(function(_cell) {_cell.done=false;});
		var current = new AStarNode(null, homeCell, targetCell);
		var open = [current];
		var break_out_2 = 500;
		while(break_out_2-- > 0 && !pathDone) { // Expand A* frontier
			var nbhCells = [];
			for(var dir in DIRS) {
				nbhCells.push(AIH.grid[current.cell.x+DIRS[dir][0]][current.cell.y+DIRS[dir][1]]);
			}
			for(var i in nbhCells) { // Discard from frontier if blocked or too risky
				if(nbhCells[i] == null || nbhCells[i].blocked || nbhCells[i].done || nbhCells[i].danger > current.danger || nbhCells[i].danger > homeCell.danger) {
					continue;
				}
				if(i % 2 == 0) { // For diagonal movement, make sure neighboring cells won't block
					var nbh_0 = nbhCells[NBH[i][0]];
					var nbh_1 = nbhCells[NBH[i][1]];
					if(nbh_0 == null || nbh_1 == null || nbh_0.blocked || nbh_1.blocked) {
						continue;
					}
				}
				var node = new AStarNode(current, nbhCells[i], targetCell, (i % 2 == 0));
				var upgradedExisting = false;
				for(var j in open) { // If node already has been checked but now has better F value, upgrade it
					if(open[j].cell == nbhCells[i]) {
						if(node.f < open[j].f) {
							open[j] = node;
							upgradedExisting = true;
							break;
						}
					}
				}
				if(!upgradedExisting) {
					open.push(node); 	// Fresh node.
				}
			}
			if(open.length == 0) {
				break; // We've run out of options, new safe destination is needed.
			}
			current.cell.done = true;
			// Remove a random node from the lowest-f-value set and make it the new current-cell
			open.sort(AStarNode.compareFVal);
			current = open[0];
			for(var i in open) {
				if(open[i].f != current.f) {
					current = open[Math.floor(Math.random()*i)]; // Random pick from best-f-selection.
					break;
				}
			}
			open.splice(open.indexOf(current), 1); 	// Remove from frontier.
			pathDone = current.cell == targetCell; 	// Check if goal is reached.
		}
	}
	//
	// Reverse engineer path
	this.path = [];
	break_out = 100;
	while(break_out-- > 0 && current.cameFrom != null) {
		this.path.unshift(current.cell);
		current = current.cameFrom;
	}
	//
	this.moveAlongPath(); // Put path in action immediately!
};
//
AIH.prototype.moveAlongPath = function() 
{// Try to move to the next cell in the current path
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
	return this.moved;
};




