/* All window creation functions */
const path = require("path");
const fs = require("fs");
const {
  BrowserWindow,
  BrowserView,
  ipcMain,
  screen,
  app,
} = require("electron");
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

  let canvasWindow = createCanvasWindow();

  const screenToolsWindow = createScreenToolsWindow();

  ipcMain.on("window.screenshare.show", () => {
    mainWindow.minimize();
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

  ipcMain.on("window.main.focus", () => {
    mainWindow.restore();
    mainWindow.focus();
  });

  ipcMain.on("screenshare.stop", () => {
    googleMeetView.webContents.send("screenshare.stop");
  });

  mainWindow.on("closed", () => {
    app.quit();
  });
}

function createCanvasWindow() {
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
    skipTaskbar: true,
  });
  canvasWindow.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "canvas.html")
  );
  canvasWindow.setAlwaysOnTop(true, "pop-up-menu");
  return canvasWindow;
}

function createScreenToolsWindow() {
  const primaryWorkarea = screen.getPrimaryDisplay().bounds;
  const screenToolsWindow = new BrowserWindow({
    x: 100,
    y: primaryWorkarea.height - 200,
    height: 60,
    width: 300,
    frame: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    focusable: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "..", "renderer", "preload.js"),
    },
  });

  screenToolsWindow.setContentProtection(process.platform === "darwin");

  screenToolsWindow.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "toolbar.html")
  );
  screenToolsWindow.setAlwaysOnTop(true, "screen-saver");
  return screenToolsWindow;
}

module.exports = { createMainWindow };
