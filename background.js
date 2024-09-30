chrome.action.onClicked.addListener((tab) => {
  handleTabSaving(true);
});

async function handleTabSaving(shouldOpenNewTab) {
  chrome.tabs.query({}, async (tabs) => {
    const currentTime = new Date();
    const timeCategory = getTimeCategory(currentTime);
    const formattedDate = formatDate(currentTime);
    
    const currentTabs = tabs
      .filter(tab => !tab.url.startsWith('chrome-extension://') && !tab.url.startsWith('chrome://'))
      .map(tab => ({ 
        url: tab.url, 
        title: tab.title, 
        closedAt: currentTime.toISOString(),
        timeCategory: timeCategory,
        formattedDate: formattedDate
      }));

    const result = await chrome.storage.local.get(['closedTabs']);
    let allClosedTabs = result.closedTabs || [];
    
    allClosedTabs = [...currentTabs, ...allClosedTabs];
    
    allClosedTabs = allClosedTabs.filter((tab, index, self) =>
      index === self.findIndex((t) => t.url === tab.url)
    );

    allClosedTabs = allClosedTabs.filter(tab => 
      !tab.url.startsWith('chrome-extension://') && 
      !tab.url.startsWith('chrome://')
    );

    chrome.storage.local.set({ closedTabs: allClosedTabs }, () => {
      if (shouldOpenNewTab) {
        chrome.tabs.create({ url: 'closed_tabs.html' }, (newTab) => {
          const tabsToClose = tabs.filter(tab => 
            tab.id !== newTab.id && 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('chrome://')
          );
          chrome.tabs.remove(tabsToClose.map(tab => tab.id));
        });
      }
    });
  });
}

function getTimeCategory(date) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 24) return 'Evening';
  return 'Night';
}

function formatDate(date) {
  return date.toISOString().split('T')[0]; // This will return "yyyy-MM-dd"
}