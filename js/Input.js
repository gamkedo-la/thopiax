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

	blueWarrior.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW);
	redWarrior.setupInput(KEY_W, KEY_D, KEY_S, KEY_A);
}

function mousePressed(evt) {
	fireShot();
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
	if(keyEvent.keyCode == blueWarrior.controlKeyLeft) {
		blueWarrior.keyHeld_West = setTo;
	}
	if(keyEvent.keyCode == blueWarrior.controlKeyRight) {
		blueWarrior.keyHeld_East = setTo;
	}
	if(keyEvent.keyCode == blueWarrior.controlKeyUp) {
		blueWarrior.keyHeld_North = setTo;
	}
	if(keyEvent.keyCode == blueWarrior.controlKeyDown) {
		blueWarrior.keyHeld_South = setTo;
	}


	if(keyEvent.keyCode == redWarrior.controlKeyLeft) {
		redWarrior.keyHeld_West = setTo;
	}
	if(keyEvent.keyCode == redWarrior.controlKeyRight) {
		redWarrior.keyHeld_East = setTo;
	}
	if(keyEvent.keyCode == redWarrior.controlKeyUp) {
		redWarrior.keyHeld_North = setTo;
	}
	if(keyEvent.keyCode == redWarrior.controlKeyDown) {
		redWarrior.keyHeld_South = setTo;
	}
	if(setTo && keyEvent.keyCode == KEY_Y) {
		redWarrior.keyHeld_South = redWarrior.keyHeld_North =
			redWarrior.keyHeld_East = redWarrior.keyHeld_West = false;
		swingSword();
	}
	if(setTo && keyEvent.keyCode == KEY_U) {
		redWarrior.keyHeld_South = redWarrior.keyHeld_North =
			redWarrior.keyHeld_East = redWarrior.keyHeld_West = false;
		raiseShield();
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
