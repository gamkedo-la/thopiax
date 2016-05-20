const MENU_ROW0 = 150;
const MENU_ROW1 = 300;
const MENU_ROW2 = 500;

var menuColumnPos = [250, 300, 350, 400, 450];

var wobble = 10;
var wobbleSpeed = 0.25;
var cursor1 = 0;
var cursor2 = 0;

//-----BEGIN GLOBAL SETTINGS-----//
var classIndexP1 = 0;
var classIndexP2 = 0;
var rightHandIndexP1 = 0;
var rightHandIndexP2 = 0;
var leftHandIndexP1 = 0;
var leftHandIndexP2 = 0;
var controlIndexP1 = 0;
var controlIndexP2 = 0;

var classListP1 = ["Warrior", "Berserker", "Paladin"];
const CLASS_P1_WARRIOR = 0;
const CLASS_P1_BERSERKER = 1;
const CLASS_P1_PALADIN = 2;
const CLASS_P1_NUM = 3;

var classListP2 = ["Rogue", "Assassin", "Mage"];
const CLASS_P2_ROGUE = 0;
const CLASS_P2_ASSASSIN = 1;
const CLASS_P2_MAGE = 2;
const CLASS_P2_NUM = 3;

var rightHandListP1 = ["Spear", "Sword", "Vampire Axe"];
const RIGHT_P1_SPEAR = 0;
const RIGHT_P1_SWORD = 1;
const RIGHT_P1_AXE = 2;
const RIGHT_P1_NUM = 3;

var rightHandListP2 = ["Bow", "Fire Staff", "Dagger"];
const RIGHT_P2_BOW = 0;
const RIGHT_P2_STAFF = 1;
const RIGHT_P2_DAGGER = 2;
const RIGHT_P2_NUM = 3;

var leftHandListP1 = ["Shield", "Throwing Axe", "Horn"];
const LEFT_P1_SHIELD = 0;
const LEFT_P1_AXE = 1;
const LEFT_P1_HORN = 2;
const LEFT_P1_NUM = 3;

var leftHandListP2 = ["Grapple Hook", "Shurikens", "Healing Scroll"];
const LEFT_P2_HOOK = 0;
const LEFT_P2_SHURIKENS = 1;
const LEFT_P2_SCROLL = 2;
const LEFT_P2_NUM = 3;

var controlledByP1 = ["WASD / YU / Space", "AI Controlled", "None"];
var controlledByP1Pali = ["WASD / YU", "AI Controlled", "None"];
var controlledByP2 = ["Arrows / Mouse", "AI Controlled", "None"];
const CONTROL_HUMAN = 0;
const CONTROL_AI = 1;
const CONTROL_NONE = 2;
const CONTROL_NUM = 3;

const MENU_CLASS = 0;
const MENU_HAND_RIGHT = 1;
const MENU_HAND_LEFT = 2;
const MENU_CONTROL = 3;
const MENU_NUM = 4;
//-----END GLOBAL SETTINGS-----//

function runMenu () {
    canvasContext.drawImage(startMenu,0,0);

    drawStory();
    if(isShowingStory()) {
        return;
    }
		
		//Wobble the cursors back and forth
    if (wobble > 13 || wobble < 9) {
      wobbleSpeed *= -1;
    }
    wobble += wobbleSpeed;
		
		//Draw menu collumn titles
    canvasContext.fillStyle = 'yellow';
    canvasContext.font = "15px MedievalSharp"
    canvasContext.fillText("Fighter Player" ,MENU_ROW1, 220);
    canvasContext.fillText("Ranged Player" ,MENU_ROW2, 220);
		
		//Draw menu options
    canvasContext.fillStyle = '#ff2222';
    canvasContext.fillText("Ability:" ,MENU_ROW0, menuColumnPos[0]);
    canvasContext.fillText(classListP1[classIndexP1] ,MENU_ROW1, menuColumnPos[0]);
    canvasContext.fillText(classListP2[classIndexP2] ,MENU_ROW2, menuColumnPos[0]);
    canvasContext.fillStyle = '#44aaff';
    canvasContext.fillText("Primary:" ,MENU_ROW0, menuColumnPos[1]);
    canvasContext.fillText(rightHandListP1[rightHandIndexP1] ,MENU_ROW1, menuColumnPos[1]);
    canvasContext.fillText(rightHandListP2[rightHandIndexP2] ,MENU_ROW2, menuColumnPos[1]);
    canvasContext.fillStyle = '#44cc44';
    canvasContext.fillText("Secondary:" ,MENU_ROW0, menuColumnPos[2]);
    canvasContext.fillText(leftHandListP1[leftHandIndexP1] ,MENU_ROW1, menuColumnPos[2]);
    canvasContext.fillText(leftHandListP2[leftHandIndexP2] ,MENU_ROW2, menuColumnPos[2]);
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Controls:" ,MENU_ROW0, menuColumnPos[3]);
		if(classIndexP1 != CLASS_P1_PALADIN){
			canvasContext.fillText(controlledByP1[controlIndexP1] ,MENU_ROW1, menuColumnPos[3]);
		} else {
			canvasContext.fillText(controlledByP1Pali[controlIndexP1] ,MENU_ROW1, menuColumnPos[3]);
		}
    canvasContext.fillText(controlledByP2[controlIndexP2] ,MENU_ROW2, menuColumnPos[3]);
		
		//Display previous score only if both players have died
    if(previousFighterKillCount > 0 || previousRangedKillCount > 0){
			canvasContext.fillText("Last Score:" ,MENU_ROW0, menuColumnPos[4]);
			canvasContext.fillText(previousFighterKillCount, MENU_ROW1, menuColumnPos[4]);
			canvasContext.fillText(previousRangedKillCount, MENU_ROW2, menuColumnPos[4]);
		}
		
		//Draw cursor
    canvasContext.drawImage(cursorPic,MENU_ROW1 -20 ,menuColumnPos[cursor1] - wobble);
    canvasContext.drawImage(cursorPic,MENU_ROW2 -20 ,menuColumnPos[cursor2] - wobble);
}
