/* Handle global keyboard shortcuts */
const { globalShortcut, app } = require("electron");

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+Alt+A", () => {
    global.googleMeetView.webContents.send("toggle.audio", {});
  });
  globalShortcut.register("CommandOrControl+Alt+V", () => {
    global.googleMeetView.webContents.send("toggle.video", {});
  });
});
