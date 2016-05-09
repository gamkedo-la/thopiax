const MENU_ROW1 = 300;
const MENU_ROW2 = 500;

var menuColumnPos = [250, 300, 350];


var wobble = 10;
var wobbleSpeed = 0.25;
var cursor1 = 0;
var cursor2 = 0;

var classIndexP1 = 0;
var classIndexP2 = 0;
var rightHandIndexP1 = 0;
var rightHandIndexP2 = 0;
var leftHandIndexP1 = 0;
var leftHandIndexP2 = 0;

var classListP1 = ["Warrior", "Berserker", "Paladin"]
var classListP2 = ["Rogue", "Assassin", "Mage"]
var rightHandListP1 = ["Spear", "Sword", "Hammer"]
var rightHandListP2 = ["Bow", "Fire Staff", "Dagger"]
var leftHandListP1 = ["Shield", "Throwing Axe", "Horn"]
var leftHandListP2 = ["Grapple Hook", "Shurikens", "Healing Scroll"]

function runMenu () {
  canvasContext.drawImage(startMenu,0,0);

    if (wobble > 13 || wobble < 9) {
      wobbleSpeed *= -1;
    }
    wobble += wobbleSpeed;

    canvasContext.fillStyle = 'Red';
    canvasContext.font = "15px Arial"
    canvasContext.fillText("Player 1" ,MENU_ROW1, 200);
    canvasContext.fillText("Player 2" ,MENU_ROW2, 200);
    canvasContext.fillText(classListP1[classIndexP1] ,MENU_ROW1, menuColumnPos[0]);
    canvasContext.fillText(classListP2[classIndexP2] ,MENU_ROW2, menuColumnPos[0]);
    canvasContext.fillText(rightHandListP1[rightHandIndexP1] ,MENU_ROW1, menuColumnPos[1]);
    canvasContext.fillText(rightHandListP2[rightHandIndexP2] ,MENU_ROW2, menuColumnPos[1]);
    canvasContext.fillText(leftHandListP1[leftHandIndexP1] ,MENU_ROW1, menuColumnPos[2]);
    canvasContext.fillText(leftHandListP2[leftHandIndexP2] ,MENU_ROW2, menuColumnPos[2]);

    canvasContext.drawImage(cursorPic,MENU_ROW1 -20 ,menuColumnPos[cursor1] - wobble);
    canvasContext.drawImage(cursorPic,MENU_ROW2 -20 ,menuColumnPos[cursor2] - wobble);
}
