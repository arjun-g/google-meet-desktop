const { ipcRenderer } = require("electron");

ipcRenderer.on("toggle.audio", (e) => {
  const audioButton = document.querySelector(
    `.q2u11 > div:nth-child(1) [role="button"]`
  );
  audioButton && audioButton.click();
});

ipcRenderer.on("toggle.video", (e) => {
  const videoButton = document.querySelector(
    `.q2u11 > div:nth-child(3) [role="button"]`
  );
  videoButton && videoButton.click();
});
