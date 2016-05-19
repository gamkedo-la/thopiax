const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_Y = 89;
const KEY_U = 85;
var keyYDown = false;
var keyUDown = false;
var keySpaceDown = false;

const KEY_SPACE = 32;
const KEY_RETURN = 13;

var mouseX = 0;
var mouseY = 0;
var mouseLeftButton = false;
var mouseOtherButton = false;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown', mousePressed);
	canvas.addEventListener('mouseup', mouseReleased);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	canvas.addEventListener('contextmenu', function(e) {
	      if (e.button === 2) { // block right click menu
	       e.preventDefault();
	        return false;
	      }
	  }, false);

	playerRanged.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW);
	playerFighter.setupInput(KEY_W, KEY_D, KEY_S, KEY_A);
}

function mousePressed(evt) {
	var audioUILeft = canvas.width-2*sndButtonDim-2*sndButtonMargin;
	var audioUISplitX = canvas.width-sndButtonDim-sndButtonMargin*0.5;
	var audioUITop = canvas.height-sndButtonDim-sndButtonMargin;
	if(mouseX > audioUILeft && mouseY > audioUITop) {
		if(mouseX<audioUISplitX) {
			sndMute=!sndMute;
			soundIsOn = !sndMute;
		} else {
			musMute=!musMute;
			gameMusic.startOrStopMusic();
		}
	}

	var leftMouseButton = (evt.button == 0);
	if(leftMouseButton) {
		mouseLeftButton = true;
	} else {
		mouseOtherButton = true;
	}
}

function mouseReleased(evt) {
	var leftMouseButton = (evt.button == 0);
	if(leftMouseButton) {
		mouseLeftButton = false;
	} else {
		mouseOtherButton = false;
	}
}

function playerAbilities() {
	//Ranged
	if(mouseLeftButton && !controlIndexP2) {
		switch(rightHandIndexP2) {
			case RIGHT_P2_BOW:
				arrowShot();
				break;
			case RIGHT_P2_STAFF:
				fireStaff();
				break;
			case RIGHT_P2_DAGGER:
				stabDagger();
				break;
		}
	}
	if(mouseOtherButton && !controlIndexP2) {
		switch(leftHandIndexP2) {
			case LEFT_P2_HOOK:
				playerRanged.dashAtPoint(true);
				break;
			case LEFT_P2_SHURIKENS:
				throwShuriken();
				break;
			case LEFT_P2_SCROLL:
				playerRanged.createHealZone();
				break;
		}
	}
	
	//Fighter
	if(keyYDown && !controlIndexP1) {
		switch(rightHandIndexP1) {
			case RIGHT_P1_SPEAR:
				stabSpear();
				break;
			case RIGHT_P1_SWORD:
				swingSword();
				break;
			case RIGHT_P1_AXE:
				swingBattleAxe();
				break;
		}
	}
	if(keyUDown && !controlIndexP1) {
		switch(leftHandIndexP1) {
			case LEFT_P1_SHIELD:
				raiseShield();
				break;
			case LEFT_P1_AXE:
				throwAxe();
				break;
			case LEFT_P1_HORN:
				blowHorn();
				break;
		}
	}
	
	if(keySpaceDown && playerFighter.abilityCD <= 0 && !controlIndexP1){
		switch(classIndexP1) {
			case CLASS_P1_WARRIOR:
				playerFighter.dashAtPoint(false);
				break;
			case CLASS_P1_BERSERKER:
				if (playerFighter.speedBoost < 8) {
					playerFighter.speedBoost+= 1;
					playerFighter.myLives -= 10;
					playerFighter.abilityCD = playerFighter.abilityCDMax;
				} else {
					playerFighter.invulTime = INVUL_FRAMES;
				}
				break;
			case CLASS_P1_PALADIN:
//				playerFighter.myLives += 5;
	//			if (playerFighter.myLives > 100) {
		//			playerFighter.myLives = 100;
			//	}
				playerFighter.abilityCD = playerFighter.abilityCDMax;
				break;
		}
	}
	playerFighter.paladinHeal();
	
	keyUDown = false;
	keyYDown = false;
	keySpaceDown = false;
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

function P1MenuCycle(inDir) {
	switch(cursor1) {
		case MENU_CLASS:
			classIndexP1+=inDir;
			if (classIndexP1 >= CLASS_P1_NUM) {
				classIndexP1 = 0;
			}
			if (classIndexP1 < 0) {
				classIndexP1 = CLASS_P1_NUM-1;
			}
			break;
		case MENU_HAND_RIGHT:
			rightHandIndexP1+=inDir;
			if (rightHandIndexP1 >= RIGHT_P1_NUM) {
				rightHandIndexP1 = 0;
			}
			if (rightHandIndexP1 < 0) {
				rightHandIndexP1 = RIGHT_P1_NUM-1;
			}
			break;
		case MENU_HAND_LEFT:
			leftHandIndexP1+=inDir;
			if (leftHandIndexP1 >= LEFT_P1_NUM) {
				leftHandIndexP1 = 0;
			}
			if (leftHandIndexP1 < 0) {
				leftHandIndexP1 = LEFT_P1_NUM-1;
			}
			break;
		case MENU_CONTROL:
			controlIndexP1+=inDir;
			if (controlIndexP1 >= CONTROL_NUM) {
				controlIndexP1 = 0;
			}
			if (controlIndexP1 < 0) {
				controlIndexP1 = CONTROL_NUM-1;
			}
			break;
	}
}

function P2MenuCycle(inDir) {
	switch(cursor2) {
		case MENU_CLASS:
			classIndexP2+=inDir;
			if (classIndexP2 >= CLASS_P2_NUM) {
				classIndexP2 = 0;
			}
			if (classIndexP2 < 0) {
				classIndexP2 = CLASS_P2_NUM-1;
			}
			break;
		case MENU_HAND_RIGHT:
			rightHandIndexP2+=inDir;
			if (rightHandIndexP2 >= RIGHT_P2_NUM) {
				rightHandIndexP2 = 0;
			}
			if (rightHandIndexP2 < 0) {
				rightHandIndexP2 = RIGHT_P2_NUM-1;
			}
			break;
		case MENU_HAND_LEFT:
			leftHandIndexP2+=inDir;
			if (leftHandIndexP2 >= LEFT_P2_NUM) {
				leftHandIndexP2 = 0;
			}
			if (leftHandIndexP2 < 0) {
				leftHandIndexP2 = LEFT_P2_NUM-1;
			}
			break;
		case MENU_CONTROL:
			controlIndexP2+=inDir;
			if (controlIndexP2 >= CONTROL_NUM) {
				controlIndexP2 = 0;
			}
			if (controlIndexP2 < 0) {
				controlIndexP2 = CONTROL_NUM-1;
			}
			break;
	}
}

function keySet(keyEvent, setTo) {

	//Menu Input Code
	if (gameIsGoing == false) {
		if(setTo && keyEvent.keyCode == KEY_SPACE) {
			if(isShowingStory()){
				skipStory();
			} else {
				gameStart();
			}
			return;
		}

		//Player 1 up and down
		if(setTo && keyEvent.keyCode == KEY_S) {
			cursor1++;
			if (cursor1 >= MENU_NUM){
				cursor1 = MENU_NUM-1;
			}
		}
		if(setTo && keyEvent.keyCode == KEY_W) {
			if (cursor1 > 0){
				cursor1 --;
			}
		}

		//player 2 up and down
		if(setTo && keyEvent.keyCode == KEY_DOWN_ARROW) {
			cursor2++;
			if (cursor2 >= MENU_NUM){
				cursor2 = MENU_NUM-1;
			}
		}
		if(setTo && keyEvent.keyCode == KEY_UP_ARROW) {
			if (cursor2 > 0){
				cursor2 --;
			}
		}

		//player 1 Selector
		if(setTo && keyEvent.keyCode == KEY_A) {
			P1MenuCycle(-1);
		}
		if(setTo && keyEvent.keyCode == KEY_D) {
			P1MenuCycle(1);
		}

		if(setTo && keyEvent.keyCode == KEY_LEFT_ARROW) {
			P2MenuCycle(-1);
		}
		if(setTo && keyEvent.keyCode == KEY_RIGHT_ARROW) {
			P2MenuCycle(1);
		}


	}

	if(keyEvent.keyCode == playerRanged.controlKeyLeft) {
		playerRanged.keyHeld_West = setTo;
	}
	if(keyEvent.keyCode == playerRanged.controlKeyRight) {
		playerRanged.keyHeld_East = setTo;
	}
	if(keyEvent.keyCode == playerRanged.controlKeyUp) {
		playerRanged.keyHeld_North = setTo;
	}
	if(keyEvent.keyCode == playerRanged.controlKeyDown) {
		playerRanged.keyHeld_South = setTo;
	}


	if(keyEvent.keyCode == playerFighter.controlKeyLeft) {
		playerFighter.keyHeld_West = setTo;
	}
	if(keyEvent.keyCode == playerFighter.controlKeyRight) {
		playerFighter.keyHeld_East = setTo;
	}
	if(keyEvent.keyCode == playerFighter.controlKeyUp) {
		playerFighter.keyHeld_North = setTo;
	}
	if(keyEvent.keyCode == playerFighter.controlKeyDown) {
		playerFighter.keyHeld_South = setTo;
	}
	if(setTo && keyEvent.keyCode == KEY_Y) {
		keyYDown = true;
	}
	if(setTo && keyEvent.keyCode == KEY_U) {
		keyUDown = true;
	}
//	if(!setTo && keyEvent.keyCode == KEY_Y) {
//		keyYDown = false;
//	}
//	if(!setTo && keyEvent.keyCode == KEY_U) {
//		keyUDown = false;
//	}

	if(setTo && keyEvent.keyCode == KEY_SPACE) {
		if(activePlayers === 0){
			gameEnd();
		}else {
			keySpaceDown = true;
		}
	} else if(keyEvent.keyCode == KEY_SPACE){
		keySpaceDown = false;
	}

	//Rogue
	if(classIndexP2 == CLASS_P2_ROGUE && playerRanged.invulTime == 0) {
		playerRanged.speedBoost = 4;
		playerRanged.abilityCD = 15;
	}
	if(playerRanged.abilityCD < 10) {
		playerRanged.speedBoost = 0;
	}
}

function keyPressed(evt) {
	keySet(evt, true);

	evt.preventDefault();
}

function keyReleased(evt) {
	keySet(evt, false);
}
