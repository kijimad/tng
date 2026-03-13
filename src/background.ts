chrome.action.onClicked.addListener((): void => {
  void chrome.tabs.create({ url: chrome.runtime.getURL("timeline.html") });
});
