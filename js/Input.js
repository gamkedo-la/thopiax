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

const KEY_SPACE = 32;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown', mousePressed);

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
	var leftMouseButton = (evt.button == 0);
	if(leftMouseButton) {
		//Bow
		if (rightHandIndexP2 == 0) {
			arrowShot();
		}
		//Fire Staff
		if (rightHandIndexP2 == 1) {
			fireStaff();
		}
		//Dagger
		if(rightHandIndexP2 == 2) {
			stabDagger();
		}
	} else {

		//Grapple Hook
		if (leftHandIndexP2 == 0) {
			playerRanged.dashAtMouse();
		}
		//Shuriken
		if (leftHandIndexP2 == 1) {
			throwShuriken();
		}
		//Healing Scroll
		if (leftHandIndexP2 == 2) {
			playerRanged.createHealZone();
		}
	}
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	// cheat / hack to test car in any position
	/*carX = mouseX;
	carY = mouseY;
	carSpeedX = 4;
	carSpeedY = -4;*/
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
			gameIsGoing = true;
			gameMusic.loopSong("audio/soundtrack2");
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
//		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
	//		playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

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
	if(setTo && keyEvent.keyCode == KEY_U) {
//		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
	//		playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

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

	if(setTo && keyEvent.keyCode == KEY_SPACE) {
		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
			playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

		//Warrior
		if(classIndexP1 == CLASS_P1_WARRIOR) {
			playerFighter.dashAtDirectionFaced();
		}
		//Berserker
		if(classIndexP1 == CLASS_P1_BERSERKER && playerFighter.abilityCD <= 0) {
			if (playerFighter.speedBoost < 8) {
				playerFighter.speedBoost+= 1;
				playerFighter.myLives -= 10;
				playerFighter.abilityCD = 50;
			} else {
				playerFighter.invulTime = INVUL_FRAMES;
			}
		}
		//Paladin
		if(classIndexP1 == CLASS_P1_PALADIN && playerFighter.abilityCD <= 0) {
			playerFighter.myLives += 5;
			if (playerFighter.myLives > 100) {
				playerFighter.myLives = 100;
			}
			playerFighter.abilityCD = 200;
		}
	}

	//Rogue
	if(classIndexP2 == CLASS_P2_ROGUE && playerRanged.invulTime == 0) {
		playerRanged.speedBoost = 3;
		playerRanged.abilityCD = 15;
	}
	if(playerRanged.abilityCD < 10) {
		playerRanged.speedBoost = 0;
	}


}

function keyPressed(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, true);

	evt.preventDefault();
}

function keyReleased(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, false);
}
