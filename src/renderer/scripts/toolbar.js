let canvasShown = false;

const penButton = document.getElementById("pen");
penButton.addEventListener("click", () => {
  if (canvasShown) {
    ipc.send("window.canvas.hide");
    canvasShown = false;
    penButton.classList.remove("active");
  } else {
    ipc.send("window.canvas.show");
    canvasShown = true;
    penButton.classList.add("active");
  }
});

const mainwindowButton = document.getElementById("mainwindow");
mainwindowButton.addEventListener("click", () => {
  ipc.send("window.main.focus");
});
