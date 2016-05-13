var baseName = "minotaur";

var frameLabel = ["L","N","R"];
var animFrames = frameLabel.length;

var dirText = ["E","SE","S","SW","W","NW","N","NE"];
var animFacings = dirText.length;

var animPics = [];

var picsToLoad = 0;

var canvas, canvasContext;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  
  loadImages();
}

function loadingDoneSoStartGame() {
  var dimW = animPics[0].width;
  var dimH = animPics[0].height;

  canvas.width = dimW*animFacings;
  canvas.height = dimH*animFrames;

  for(var i=0;i<animFacings;i++) {
    for(var ii=0;ii<animFrames;ii++) {
      console.log(i+" _ "+ii);
      canvasContext.drawImage(animPics[ frameIndex(i,ii) ],
        dimW*i,dimH*ii);
      
    }
  }
}

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  console.log(picsToLoad);
  if(picsToLoad == 0) { // last image loaded?
    loadingDoneSoStartGame();
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload=countLoadedImageAndLaunchIfReady;
  imgVar.src=fileName;
}

function loadImageForAnimCode(animCode, fileName) {
  animPics[animCode] = document.createElement("img");
  beginLoadingImage(animPics[animCode],fileName);
}

function frameIndex(facing, anim) {
  return facing + anim*animFacings;
}

function loadImages() {

  var imageList = [
    ];

  for(var i=0;i<animFacings;i++) {
    for(var ii=0;ii<animFrames;ii++) {
      var filename = baseName+dirText[i]+"_"+frameLabel[ii]+".png";
      // console.log(filename);
      imageList.push(
        {animType:frameIndex(i,ii), theFile:filename});
    }
  }

  picsToLoad = imageList.length;

  for(var i=0;i<imageList.length;i++) {
    loadImageForAnimCode(imageList[i].animType, imageList[i].theFile);
  } // end of for imageList

} // end of function loadImages
