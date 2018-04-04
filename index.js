'use strict';

// camel-harness demo for NW.js

let nwWindow = nw.Window.get();
let nwCloseWindow = false;

// Load the camel-harness package:
const CAMEL_HARNESS = require('../camel-harness');

// Determine the operating system and initialize the 'path' object:
let os = require('os');
let platform = os.platform();

let path;
if (platform !== 'win32') {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Get the current directory:
const DIRNAME = require('./dirname.js').dirname;

// version.pl:
let versionScriptFullPath =
    path.join(DIRNAME, 'perl', 'version.pl');

let versionScriptObject = {};
versionScriptObject.interpreter = 'perl';
versionScriptObject.scriptFullPath = versionScriptFullPath;
versionScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('version-script').innerHTML = stdout;
};

// counter.pl full path:
let counterScriptFullPath =
    path.join(DIRNAME, 'perl', 'counter.pl');

// counter.pl - first instance:
let counterOneObject = {};
counterOneObject.interpreter = 'perl';
counterOneObject.scriptFullPath = counterScriptFullPath;
counterOneObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-one').innerHTML = stdout;
};

// counter.pl - second instance:
let counterTwoObject = {};
counterTwoObject.interpreter = 'perl';
counterTwoObject.scriptFullPath = counterScriptFullPath;
counterTwoObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-two').innerHTML = stdout;
};

// interactive script:
let interactiveScriptObject = {};

function startInteractiveScript() {
  let interactiveScriptFullPath =
      path.join(DIRNAME, 'perl', 'interactive.pl');

  interactiveScriptObject.interpreter = 'perl';
  interactiveScriptObject.scriptFullPath = interactiveScriptFullPath;
  interactiveScriptObject.stdoutFunction = function(stdout) {
    if (stdout.match(/_closed_/)) {
      nwCloseWindow = true;
      nwWindow.close();
    } else {
      document.getElementById('interactive-script-output').innerHTML = stdout;
    }
  };

  CAMEL_HARNESS.startScript(interactiveScriptObject);
}

function sendDataToInteractiveScript() {
  let data = document.getElementById('interactive-script-input').value;
  interactiveScriptObject.scriptHandler.stdin.write(`${data}\n`);
}

function closeInteractiveScript() {
  interactiveScriptObject.scriptHandler.stdin.write('_close_\n');
}

nwWindow.on('close', function() {
  if (nwCloseWindow === false) {
    nwWindow.close(false);
    closeInteractiveScript();
  } else {
    nwWindow.close(true);
  }
});
