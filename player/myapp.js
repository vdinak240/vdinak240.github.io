var shakaDemo = shakaDemo || {};

const manifestUri =
    //  'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
    //  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

function initApp() {
  console.log("Init app loaded")
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();
  initPlayer();
    // Check to see if the browser supports the basic APIs Shaka needs.
  if (! shaka.Player.isBrowserSupported()) {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  } else {
    console.log('Browser supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player(video);
  // const ui = video['ui'];
  // const controls = ui.getControls();



  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;
  // window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }

  //Loading all the additional shaklaplayer methods
  shakaDemo.setupInfo_();

}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

// document.addEventListener('shaka-ui-loaded', () => this.initApp());
document.addEventListener('DOMContentLoaded', initApp);