'use strict';

// camel-harness demo for NW.js

// Load the camel-harness package:
const camelHarness = require('camel-harness');

var nwWindow = nw.Window.get();
var nwCloseWindow = false;

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
    path.join(dirname, 'perl', 'version.pl');

var versionScriptObject = {};
versionScriptObject.interpreter = 'perl';
versionScriptObject.scriptFullPath = versionScriptFullPath;
versionScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('version-script').innerHTML = stdout;
};

// counter.pl full path:
var counterScriptFullPath =
    path.join(dirname, 'perl', 'counter.pl');

// counter.pl - first instance:
var counterOneObject = {};
counterOneObject.interpreter = 'perl';
counterOneObject.scriptFullPath = counterScriptFullPath;
counterOneObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-one').innerHTML = stdout;
};

// counter.pl - second instance:
var counterTwoObject = {};
counterTwoObject.interpreter = 'perl';
counterTwoObject.scriptFullPath = counterScriptFullPath;
counterTwoObject.stdoutFunction = function(stdout) {
  document.getElementById('long-running-script-two').innerHTML = stdout;
};

// interactive script:
var interactiveScriptObject = {};

function startInteractiveScript() {
  var interactiveScriptFullPath =
      path.join(dirname, 'perl', 'interactive.pl');

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

  camelHarness.startScript(interactiveScriptObject);
}

function sendDataToInteractiveScript() {
  var data = document.getElementById('interactive-script-input').value;
  interactiveScriptObject.scriptHandler.stdin.write(data + '\n');
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
