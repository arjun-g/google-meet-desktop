/* Modules to control application life and create native browser window */
const { app, BrowserWindow, systemPreferences, session } = require("electron");
const {
  hasScreenCapturePermission,
  hasPromptedForPermission,
} = require("mac-screen-capture-permissions");
const {
  WIN_USERAGENT,
  MAC_USERAGENT,
  LINUX_USERAGENT,
} = require("./constants");

require("./main/cpuinfo");
require("./main/shortcut");
const { createMainWindow } = require("./main/window");

if (process.platform !== "win32" && process.platform !== "darwin") {
  app.commandLine.appendSwitch("enable-transparent-visuals");
  app.commandLine.appendSwitch("disable-gpu");
  app.disableHardwareAcceleration();
}

app.whenReady().then(async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (process.platform === "win32") {
      details.requestHeaders["User-Agent"] = WIN_USERAGENT;
    } else if (process.platform === "darwin") {
      details.requestHeaders["User-Agent"] = MAC_USERAGENT;
    } else {
      details.requestHeaders["User-Agent"] = LINUX_USERAGENT;
    }
    callback({ requestHeaders: details.requestHeaders });
  });
  if (process.platform === "darwin") {
    if (systemPreferences.getMediaAccessStatus("camera") !== "granted") {
      await systemPreferences.askForMediaAccess("camera");
    }
    if (systemPreferences.getMediaAccessStatus("microphone") !== "granted") {
      await systemPreferences.askForMediaAccess("microphone");
    }
    if (systemPreferences.getMediaAccessStatus("screen") !== "granted") {
      hasPromptedForPermission();
      hasScreenCapturePermission();
    }
  }
  createMainWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  } else {
    global.mainWindow && global.mainWindow.focus();
  }
});
