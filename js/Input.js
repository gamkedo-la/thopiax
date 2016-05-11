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

function keySet(keyEvent, setTo) {

	//Menu Input Code
	if (gameIsGoing == false) {
		if(setTo && keyEvent.keyCode == KEY_SPACE) {
			gameIsGoing = true;
			return;
		}

		//Player 1 up and down
		if(setTo && keyEvent.keyCode == KEY_S) {
			if (cursor1 < 3){
				cursor1 ++;
			}
		}
		if(setTo && keyEvent.keyCode == KEY_W) {
			if (cursor1 > 0){
				cursor1 --;
			}
		}

		//player 2 up and down
		if(setTo && keyEvent.keyCode == KEY_DOWN_ARROW) {
			if (cursor2 < 3){
				cursor2 ++;
			}
		}
		if(setTo && keyEvent.keyCode == KEY_UP_ARROW) {
			if (cursor2 > 0){
				cursor2 --;
			}
		}

		//player 1 Selector
		if(setTo && keyEvent.keyCode == KEY_D) {
			if (cursor1 == 0) {
				if (classIndexP1 < 2) {
					classIndexP1 +=1;
				} else {
					classIndexP1 = 0;
				}
			}

			if (cursor1 == 1) {
				if (rightHandIndexP1 < 2) {
					rightHandIndexP1 +=1;
				} else {
					rightHandIndexP1 = 0;
				}
			}

			if (cursor1 == 2) {
				if (leftHandIndexP1 < 2) {
					leftHandIndexP1 +=1;
				} else {
					leftHandIndexP1 = 0;
				}
			}

			if (cursor1 == 3) {
				if (controlIndexP1 < 2) {
					controlIndexP1 +=1;
				} else {
					controlIndexP1 = 0;
				}
			}

		}

		if(setTo && keyEvent.keyCode == KEY_RIGHT_ARROW) {
			if (cursor2 == 0) {
				if (classIndexP2 < 2) {
					classIndexP2 +=1;
				} else {
					classIndexP2 = 0;
				}
			}
			if (cursor2 == 1) {
				if (rightHandIndexP2 < 2) {
					rightHandIndexP2 +=1;
				} else {
					rightHandIndexP2 = 0;
				}
			}

			if (cursor2 == 2) {
				if (leftHandIndexP2 < 2) {
					leftHandIndexP2 +=1;
				} else {
					leftHandIndexP2 = 0;
				}
			}

			if (cursor2 == 3) {
				if (controlIndexP2 < 2) {
					controlIndexP2 +=1;
				} else {
					controlIndexP2 = 0;
				}
			}

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
		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
			playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

		//spear
		if(rightHandIndexP1 == 0) {
				stabSpear();
		}
		//sword
		if(rightHandIndexP1 == 1) {
				swingSword();
		}
		//Battle Axe
		if(rightHandIndexP1 == 2) {
				swingBattleAxe();
		}


	}
	if(setTo && keyEvent.keyCode == KEY_U) {
		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
			playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

		//Shield
		if(leftHandIndexP1 == 0) {
			raiseShield();
		}
		//Throwing Axe
		if(leftHandIndexP1 == 1) {
			throwAxe();
		}
		//Horn
		if(leftHandIndexP1 == 2) {
			blowHorn();
		}
	}

	if(setTo && keyEvent.keyCode == KEY_SPACE) {
		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
			playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

		//Warrior
		if(classIndexP1 == 0) {
			playerFighter.dashAtDirectionFaced();
		}
		//Berserker
		if(classIndexP1 == 1 && playerFighter.abilityCD <= 0) {
			if (playerFighter.speedBoost < 8) {
				playerFighter.speedBoost+= 1;
				playerFighter.myLives -= 10;
				playerFighter.abilityCD = 50;
			} else {
				playerFighter.invulTime = INVUL_FRAMES;
			}
		}
		//Paladin
		if(classIndexP1 == 2 && playerFighter.abilityCD <= 0) {
			playerFighter.myLives += 5;
			if (playerFighter.myLives > 100) {
				playerFighter.myLives = 100;
			}
			playerFighter.abilityCD = 200;
		}
	}

	//Rogue
	if(classIndexP2 == 0 && playerRanged.invulTime == 0) {
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
