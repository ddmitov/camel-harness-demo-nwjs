'use strict';

<<<<<<< HEAD
// camel-harness demo for NW.js

const dirname = require('./dirname.js').dirname;

var modulesDirectory = dirname.replace('camel-harness-demo-nwjs', '');

// Load the camel-harness package:
const camelHarness = require(modulesDirectory + 'camel-harness');

var nwWindow = nw.Window.get();
var nwCloseWindow = false;
=======
// camel-harness demo for Electron

// Load the camel-harness package:
const camelHarness = require('../camel-harness');
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b

// Determine the operating system and initialize 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== 'win32') {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// version.pl:
var versionScriptFullPath =
<<<<<<< HEAD
    path.join(dirname, 'perl', 'version.pl');
=======
    path.join(__dirname, 'perl', 'version.pl');
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b

var versionScriptObject = new Object();
versionScriptObject.interpreter = 'perl';
versionScriptObject.scriptFullPath = versionScriptFullPath;

versionScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('version-script').innerHTML = stdout;
};

// counter.pl full path:
var counterScriptFullPath =
<<<<<<< HEAD
    path.join(dirname, 'perl', 'counter.pl');
=======
    path.join(__dirname, 'perl', 'counter.pl');
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b

// counter.pl - first instance:
var counterOneObject = new Object();
counterOneObject.interpreter = 'perl';
counterOneObject.scriptFullPath = counterScriptFullPath;

counterOneObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-one').innerHTML = stdout;
};

// counter.pl - second instance:
var counterTwoObject = new Object();
counterTwoObject.interpreter = 'perl';
counterTwoObject.scriptFullPath = counterScriptFullPath;

counterTwoObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-two').innerHTML = stdout;
};

// interactive script:
var interactiveScriptObject = new Object();
<<<<<<< HEAD
function startInteractiveScript() {
  var interactiveScriptFullPath =
      path.join(dirname, 'perl', 'interactive.pl');
=======

function startInteractiveScript() {
  var interactiveScriptFullPath =
      path.join(__dirname, 'perl', 'interactive.pl');
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b

  interactiveScriptObject.interpreter = 'perl';
  interactiveScriptObject.scriptFullPath = interactiveScriptFullPath;

  interactiveScriptObject.stdoutFunction = function(stdout) {
    if (stdout.match(/_closed_/)) {
<<<<<<< HEAD
      nwCloseWindow = true;
      nwWindow.close();
=======
      const {ipcRenderer} = require('electron');
      ipcRenderer.send('asynchronous-message', 'close');
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b
    } else {
      document.getElementById('interactive-script-output').innerHTML = stdout;
    }
  };

  camelHarness.startScript(interactiveScriptObject);
}

function sendDataToInteractiveScript() {
  var data = document.getElementById('interactive-script-input').value;
  interactiveScriptObject.scriptHandler.stdin.write(data + '\n');
}

function closeInteractiveScript() {
  interactiveScriptObject.scriptHandler.stdin.write('_close_\n');
}

<<<<<<< HEAD
nwWindow.on('close', function() {
  if (nwCloseWindow === false) {
    nwWindow.close(false);
    closeInteractiveScript();
  } else {
    nwWindow.close(true);
  }
});
=======
if (navigator.userAgent.match(/Electron/)) {
  // Wait for close event message from the main process and react accordingly:
  require('electron').ipcRenderer.on('closeInteractiveScript', function() {
    closeInteractiveScript();
  });
}
>>>>>>> 1a697058479189d027f7ce013742da71d4776b3b
