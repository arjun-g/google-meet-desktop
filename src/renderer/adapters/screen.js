const { desktopCapturer } = require("electron");

async function fetchDesktopSources(types) {
  const sources = await desktopCapturer.getSources({
    types,
    fetchWindowIcons: true,
  });
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    displayId: source.display_id,
    icon: source.appIcon && source.appIcon.toDataURL(),
    thumbnail: source.thumbnail.toDataURL(),
  }));
}

function createScreenSelectionPopup(sources, types) {
  return new Promise((resolve) => {
    const screenSelectionPopup = document.createElement("div");
    screenSelectionPopup.className = "screen-selection-popup";
    screenSelectionPopup.innerHTML = `
    <div class="screen-list-container">
        <div class="screen-list-title">${
          types.includes("screen") && types.includes("window")
            ? "Share your entire screen or an application screen"
            : types.includes("screen")
            ? "Share your entire screen"
            : "Share an application screen"
        }</div>
        <button class="close-button">
            <svg height="16px" viewBox="0 0 329.26933 329" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>
        </button>
        <div class="screen-list"></div>
    </div>`;
    const screenList = screenSelectionPopup.querySelector(".screen-list");
    sources.forEach((source) => {
      const screenListItem = document.createElement("div");
      screenListItem.className = "screen-list-item";
      screenListItem.innerHTML = `
                <img src="${source.thumbnail}" />
                <div class="screen-list-item-name">
                    ${source.icon ? `<img src="${source.icon}" />` : ""}
                    <span>${source.name}</span>
                </div>
            `;
      screenListItem.addEventListener("click", () => {
        resolve(source.id);
        screenSelectionPopup.remove();
      });
      screenList.appendChild(screenListItem);
    });
    screenSelectionPopup
      .querySelector(".close-button")
      .addEventListener("click", () => {
        resolve(null);
        screenSelectionPopup.remove();
      });
    document.body.appendChild(screenSelectionPopup);
  });
}

module.exports = {
  getScreenId: async (types) => {
    const sources = await fetchDesktopSources(types);
    if (sources.length === 1) {
      return sources[0].id;
    }
    const screenId = await createScreenSelectionPopup(sources, types);
    return screenId;
  },
};
