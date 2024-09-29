document.getElementById('cleanTabs').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "cleanTabs"});
  window.close();
});