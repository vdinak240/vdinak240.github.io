
var shakaDemo = shakaDemo || {};


$(document).ready(function() {
    $("#loadBtn").click(function(){
       video.src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    }); 
});

var loadButton = 0;
var lastRate = 0;           //variable used to compute frameRate
var lastDroppedFrames = 0;
statsLocation = '#taStats'  //stats for nerds object
playingStatusLocation = '#taPlayingStatus'
var stringStats = new String();   //map of data for stats for nerds
var stats = "";

//Frame rate is deduced from decodedFrames.
function computeFrameRate(decodedFrames){
  frameRate = decodedFrames - lastRate;
  lastRate = decodedFrames;
  return frameRate;
}

//DroppedFrames per second
function computeDroppedFrames(droppedFrames){
  droppedFrameRate = droppedFrames - lastDroppedFrames;
  lastDroppedFrames = droppedFrames;
  return droppedFrameRate;
}

//Adding a value to a string which is displayed on the player
function pushToString(key, value){
  stringStats += key + ": " + value + "\n";
}

//Reseting a value of the string to empty
function resetString(){
  stringStats = "";
}

//Fetching the values from the string
function getString(){
  return stringStats;
}

function fetchStats(){
  try{
    stats = player.getStats();
    stats2 =  video.getVideoPlaybackQuality();
  }
  catch(e){
    console.error(e);
  }
}

// function loadStatistics(){
//   // Stats for neards loader 
//   setInterval(function(){
//   console.log("Loading1");
//   // Values transferable from player.getStats()
//   //Setting the string to null
//   resetString();
//   //Fetching stats
//   fetchStats();

//   //Defining current playing status
//   pushToString("Framerate", computeFrameRate(stats.decodedFrames));
//   pushToString("DroppedFrames", computeDroppedFrames(stats.droppedFrames));
//   pushToString("TotalDecodedFrames", stats.decodedFrames);
//   pushToString("TotalDroppedFrames", stats.droppedFrames);
//   pushToString("Total", stats2.totalVideoFrames);
//   console.log("Stats2: " + stats2.totalVideoFrames);

//   $(statsLocation).html(getString());
//   $(temp).html(regex(JSON.stringify(stats))); // this is the blackandwhite text that comes below the video.
//   }, 1000);


//   // Playing status loader
//   setInterval(function(){
//     if(typeof player != 'undefined'){
//       fetchStats();
//       length = stats.stateHistory.length;
//       element = stats.stateHistory[length-1].state;

      
//       switch(element){
//         case "playing":
//             $(playingStatusLocation).html(element).removeClass("paused");
//             $(playingStatusLocation).html(element).removeClass("buffering");
//             $(playingStatusLocation).html(element).addClass("playing");
//             break;

//         case "paused":
//             $(playingStatusLocation).html(element).removeClass("playing");
//             $(playingStatusLocation).html(element).removeClass("buffering");
//             $(playingStatusLocation).html(element).addClass("paused");
//             break;

//         case "buffering":
//             $(playingStatusLocation).html(element).removeClass("playing");
//             $(playingStatusLocation).html(element).removeClass("paused");
//             $(playingStatusLocation).html(element).addClass("buffering");
//             break;

//         }
//       }
//     }, 100);

// }








shakaDemo.setupInfo_ = function() {
  window.setInterval(shakaDemo.updateDebugInfo_, 1000);
  window.setInterval(shakaDemo.loadPlayinStatus_, 100);
}

shakaDemo.loadPlayinStatus_ = function(){
  if(typeof player != 'undefined'){
      fetchStats();
      length = stats.stateHistory.length;
      element = stats.stateHistory[length-1].state;

      
      switch(element){
        case "playing":
            $(playingStatusLocation).html(element).removeClass("paused");
            $(playingStatusLocation).html(element).removeClass("buffering");
            $(playingStatusLocation).html(element).addClass("playing");
            break;

        case "paused":
            $(playingStatusLocation).html(element).removeClass("playing");
            $(playingStatusLocation).html(element).removeClass("buffering");
            $(playingStatusLocation).html(element).addClass("paused");
            break;

        case "buffering":
            $(playingStatusLocation).html(element).removeClass("playing");
            $(playingStatusLocation).html(element).removeClass("paused");
            $(playingStatusLocation).html(element).addClass("buffering");
            break;

        }
      }
}


shakaDemo.updateDebugInfo_ = function(){
  //Setting the string to null
  resetString();
  //Fetching stats
  fetchStats();

  //Defining current playing status
  pushToString("Video resolution", fetchVideoRes());
  pushToString("Buffer", fetchBufferingTime());
  pushToString("Framerate", computeFrameRate(stats.decodedFrames));
  pushToString("DroppedFrames", computeDroppedFrames(stats.droppedFrames));
  pushToString("TotalDecodedFrames", stats.decodedFrames);
  pushToString("TotalDroppedFrames", stats.droppedFrames);
  pushToString("Total", stats2.totalVideoFrames);
  console.log("Stats2: " + stats2.totalVideoFrames);

  $(statsLocation).html(getString());
  $(temp).html(regex(JSON.stringify(stats))); // this is the blackandwhite text that comes below the video.
}

function fetchVideoRes(){
  return  video.videoWidth + ' x ' + video.videoHeight;
}



function fetchBufferingTime() {
  var behind = 0;
  var ahead = 0;

  var currentTime = video.currentTime;
  var buffered = video.buffered;
  for (var i = 0; i < buffered.length; ++i) {
    if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
      ahead = buffered.end(i) - currentTime;
      behind = currentTime - buffered.start(i);
      break;
    }
  }
  var temp = '- ' + behind.toFixed(0) + 's / ' + '+ ' + ahead.toFixed(0) + 's';

  document.getElementById('bufferedDebug').textContent = temp;
  return temp;     
}




function regex(myJSONString, loc){
  let regexString = "";
  // for tracking matches, in particular the curly braces
  const brace = {
    brace: 0
  };

  regexString = myJSONString.replace(
    /({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g,
    (m, p1) => {
      const returnFunction = () =>
        `<div style="text-indent: ${brace["brace"] * 20}px;">${p1}</div>`;
      let returnString = 0;
      if (p1.lastIndexOf("{") === p1.length - 1) {
        returnString = returnFunction();
        brace["brace"] += 1;
      } else if (p1.indexOf("}") === 0) {
        brace["brace"] -= 1;
        returnString = returnFunction();
      } else {
        returnString = returnFunction();
      }
      return returnString;
    }
  );
  return regexString;
}