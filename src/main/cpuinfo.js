/* to emulate chrome.system.cpu.getInfo api of chrome extension */
const os = require("os");
const { ipcMain } = require("electron");

function fetchCPUInfo() {
  const cpus = os.cpus();
  return {
    archName: os.arch(),
    modelName: cpus[0].model,
    numOfProcessors: cpus.length,
    processors: cpus.map((cpu) => {
      return {
        usage: {
          idle: cpu.times.idle,
          kernal: cpu.times.sys,
          user: cpu.times.user,
          total: cpu.times.idle + cpu.times.sys + cpu.times.user,
        },
      };
    }),
    temperatures: [],
  };
}

ipcMain.on("get.cpuInfo", (event) => {
  event.reply("got.cpuInfo", fetchCPUInfo());
});
