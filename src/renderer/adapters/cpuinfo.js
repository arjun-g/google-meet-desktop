const { ipcRenderer } = require("electron");

module.exports = {
  getCPUInfo: () => {
    return new Promise((resolve) => {
      ipcRenderer.on("got.cpuInfo", (event, cpuInfo) => {
        resolve(cpuInfo);
      });
      ipcRenderer.send("get.cpuInfo", {});
    });
  },
};
