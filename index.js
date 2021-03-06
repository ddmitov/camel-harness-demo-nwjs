"use strict";

// camel-harness demo for NW.js

let nwWindow = nw.Window.get();
let nwCloseWindow = false;

// Load the camel-harness package:
const camelHarness = require("../camel-harness");

// Determine the operating system and initialize the "path" object:
let os = require("os");
let platform = os.platform();

let path;
if (platform !== "win32") {
  path = require("path").posix;
} else {
  path = require("path").win32;
}

// Get the current directory:
const dirName = require("./dirname.js").dirname;

// version.pl:
let versionScriptFullPath =
    path.join(dirName, "perl", "version.pl");

let versionScriptObject = {};
versionScriptObject.interpreter = "perl";
versionScriptObject.script = versionScriptFullPath;
versionScriptObject.stdoutFunction = function(stdout) {
  document.getElementById("version-script").textContent = stdout;
};

// counter.pl full path:
let counterScriptFullPath =
    path.join(dirName, "perl", "counter.pl");

// counter.pl - first instance:
let counterOneObject = {};
counterOneObject.interpreter = "perl";
counterOneObject.script = counterScriptFullPath;
counterOneObject.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-one").textContent = stdout;
};

// counter.pl - second instance:
let counterTwoObject = {};
counterTwoObject.interpreter = "perl";
counterTwoObject.script = counterScriptFullPath;
counterTwoObject.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-two").textContent = stdout;
};

// interactive script:
let interactiveScriptObject = {};

function startInteractiveScript() {
  let interactiveScriptFullPath =
      path.join(dirName, "perl", "interactive.pl");

  interactiveScriptObject.interpreter = "perl";
  interactiveScriptObject.script = interactiveScriptFullPath;
  interactiveScriptObject.stdoutFunction = function(stdout) {
    if (stdout.match(/_closed_/)) {
      nwCloseWindow = true;
      nwWindow.close();
    } else {
      document.getElementById("interactive-script-output").textContent = stdout;
    }
  };

  camelHarness.startScript(interactiveScriptObject);
}

function sendDataToInteractiveScript() {
  let data = document.getElementById("interactive-script-input").value;
  interactiveScriptObject.scriptHandler.stdin.write(`${data}\n`);
}

function closeInteractiveScript() {
  interactiveScriptObject.scriptHandler.stdin.write("_close_\n");
}

nwWindow.on("close", function() {
  if (nwCloseWindow === false) {
    nwWindow.close(false);
    closeInteractiveScript();
  } else {
    nwWindow.close(true);
  }
});
