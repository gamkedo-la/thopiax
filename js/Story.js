var storyText =
[
"It is dusk in the City.",
"",
"Hammer-blows from endless rows of foundries ring off the stone steps of pyramids",
"crowned in blue flame. Brimstone wafts above canals filled with brackish waters. No",
"clouds nor stars in the sky, only shades of axe metal silver, darkening towards night.",
"",
"This City is the seat of an ancient and powerful Empire, and has been known by many",
"names. The Blackened City. The City of Blades. The Crossroads. The Tyrant. The Center",
"of the World.",
"",
"On maps, it is named Thopiax.",
"",
"And at the very center of the Center stands the Arena.",
"",
"Tonight is like every night. Two warriors enter the Arena from opposite tunnels. They",
"do not know one another. They walk to the middle of the millenial circle, saying nothing,",
"and turn to face the Imperial rostrum above them.",
"",
"A hulking figure, clad in shadows, rises from the Marble Throne. It speaks.",
"",
"\"I bid you welcome, worthies. All of Thopiax bids you welcome!\"",
"",
"At this, tens of thousands of voices erupt in a chant:",
"",
"\"THO-PI-AX! THO-PI-AX! THO-PI-AX!\"",
"",
"\"We gather here to bear witness to your bravery. To your strength. To your willingness",
"to wager all for this greatest of prizes... my Marble Throne.\"",
"",
"\"I and another won it in the Arena long ago. Only I remain.\"",
"",
"A dagger-toothed smile creeps into the dark figure’s voice.",
"",
"\"Will you win it from me? Nay.\"",
"",
"\"Your death approaches, and our Gods will feast!\"",
"",
"The two warriors turn back to back, hefting their weapons, as the gates open and the",
"hordes pour forth..."
];

var storyY = 600;
const STORY_DONE_Y = -680;

function skipStory() {
	storyY = STORY_DONE_Y;
}

function isShowingStory() {
	return storyY > STORY_DONE_Y;
}

function drawStory() {
	if( isShowingStory() == false ) {
		return;
	}
	canvasContext.fillStyle = 'orange';
	canvasContext.font = "18px MedievalSharp"
	var textY = -40;
	storyY-=0.65;
	canvasContext.drawImage(storyFadeBG,0,0);
	//console.log(storyY);
	for(var i=0;i<storyText.length;i++) {
		canvasContext.fillText(storyText[i],40, storyY+textY);
		textY += 20;
	}
	canvasContext.drawImage(storyFadeFG,0,0);
	
	canvasContext.fillStyle = '#aaaaaa';
	canvasContext.font = "18px MedievalSharp"
	canvasContext.fillText("Press Space to Skip Intro",40, canvas.height-30);
}
