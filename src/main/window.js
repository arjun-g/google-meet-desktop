/* All window creation functions */
const path = require("path");
const fs = require("fs");
const { BrowserWindow, BrowserView, ipcMain, screen } = require("electron");
const windowStateKeeper = require("electron-window-state");

const GOOGLE_MEET_URL = "https://meet.google.com/";

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
    fullScreen: false,
    maximize: true,
  });

  const mainWindow = (global.mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "..", "renderer", "preload.js"),
    },
  }));
  mainWindowState.manage(mainWindow);
  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  // mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.webContents.send("window.maximized");
    }
  });

  const googleMeetView = (global.googleMeetView = new BrowserView({
    webPreferences: {
      preload: path.join(
        __dirname,
        "..",
        "renderer",
        "adapters",
        "polyfill.js"
      ),
    },
  }));
  mainWindow.setBrowserView(googleMeetView);
  googleMeetView.webContents.loadURL(GOOGLE_MEET_URL);
  googleMeetView.setBounds({
    x: 0,
    y: 40,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 40,
  });
  googleMeetView.webContents.on("did-finish-load", () => {
    googleMeetView.webContents.insertCSS(
      fs
        .readFileSync(
          path.join(__dirname, "..", "renderer", "css", "screen.css")
        )
        .toString()
    );
  });
  // googleMeetView.webContents.openDevTools();

  mainWindow.on("resize", () => {
    googleMeetView.setBounds({
      x: 0,
      y: 40,
      width: mainWindow.getBounds().width,
      height: mainWindow.getBounds().height - 40,
    });
  });

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window.maximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window.restored");
  });

  ipcMain.on("window.minimize", (event) => {
    mainWindow.minimize();
  });

  ipcMain.on("window.maximize", (event) => {
    mainWindow.maximize();
    event.sender.send("window.maximized");
  });

  ipcMain.on("window.restore", (event) => {
    mainWindow.restore();
    event.sender.send("window.restored");
  });

  ipcMain.on("window.close", () => {
    mainWindow.close();
  });

  ipcMain.on("window.home", () => {
    googleMeetView.webContents.loadURL(GOOGLE_MEET_URL);
  });

  const primaryWorkarea = screen.getPrimaryDisplay().bounds;
  const canvasWindow = new BrowserWindow({
    x: primaryWorkarea.x,
    y: primaryWorkarea.y,
    width: primaryWorkarea.width,
    height: primaryWorkarea.height,
    transparent: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "..", "renderer", "preload.js"),
    },
    focusable: false,
    show: false,
    resizable: false,
  });
  canvasWindow.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "canvas.html")
  );
  canvasWindow.setAlwaysOnTop(true, "pop-up-menu");

  const screenToolWindowState = windowStateKeeper({});

  const screenToolsWindow = new BrowserWindow({
    x: screenToolWindowState.x,
    y: screenToolWindowState.y,
    height: 60,
    width: 250,
    frame: false,
    resizable: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "..", "renderer", "preload.js"),
    },
  });

  screenToolWindowState.manage(screenToolsWindow);

  screenToolsWindow.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "toolbar.html")
  );
  screenToolsWindow.setAlwaysOnTop(true, "screen-saver");

  ipcMain.on("window.screenshare.show", () => {
    screenToolsWindow.show();
  });

  ipcMain.on("window.screenshare.hide", () => {
    screenToolsWindow.hide();
    screenToolsWindow.reload();
    canvasWindow.hide();
  });

  ipcMain.on("window.canvas.show", () => {
    canvasWindow.show();
  });

  ipcMain.on("window.canvas.hide", () => {
    canvasWindow.hide();
    canvasWindow.reload();
  });

  ipcMain.on("screenshare.stop", () => {
    googleMeetView.webContents.send("screenshare.stop");
  });

  mainWindow.on("closed", () => {
    canvasWindow.close();
    screenToolsWindow.close();
  });
}

module.exports = { createMainWindow };
