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
		if (playerRanged.rightHandWeapon == "bow") {
			fireShot();
		}
	} else {
		if (playerRanged.leftHandWeapon == "rope") {
			playerRanged.dashAtMouse();
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

		if(playerFighter.rightHandWeapon == "sword") {
				swingSword();
		}
		if(playerFighter.rightHandWeapon == "spear") {
				stabSpear();
		}

	}
	if(setTo && keyEvent.keyCode == KEY_U) {
		playerFighter.keyHeld_South = playerFighter.keyHeld_North =
			playerFighter.keyHeld_East = playerFighter.keyHeld_West = false;

		if(playerFighter.leftHandWeapon == "shield") {
			raiseShield();
		}
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
