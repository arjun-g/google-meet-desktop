/* Modules to control application life and create native browser window */
const { app, BrowserWindow } = require("electron");

require("./main/cpuinfo");
require("./main/shortcut");
const { createMainWindow } = require("./main/window");

app.whenReady().then(createMainWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
