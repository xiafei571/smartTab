chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({}, (tabs) => {
    const currentTime = new Date();
    const timeCategory = getTimeCategory(currentTime);
    const formattedDate = formatDate(currentTime);
    
    const currentTabs = tabs
      .filter(tab => !tab.url.startsWith('chrome-extension://') && tab.url !== 'chrome://extensions/')
      .map(tab => ({ 
        url: tab.url, 
        title: tab.title, 
        closedAt: currentTime.toISOString(),
        timeCategory: timeCategory,
        formattedDate: formattedDate
      }));
    
    chrome.storage.local.get(['closedTabs'], (result) => {
      let allClosedTabs = result.closedTabs || [];
      
      allClosedTabs = [...currentTabs, ...allClosedTabs];
      
      allClosedTabs = allClosedTabs.filter((tab, index, self) =>
        index === self.findIndex((t) => t.url === tab.url)
      );

      allClosedTabs = allClosedTabs.filter(tab => 
        !tab.url.startsWith('chrome-extension://') && 
        tab.url !== 'chrome://extensions/'
      );

      chrome.storage.local.set({ closedTabs: allClosedTabs }, () => {
        console.log('All closed tabs information saved');
        
        chrome.tabs.create({ url: 'closed_tabs.html' }, (newTab) => {
          const tabsToClose = tabs.filter(tab => 
            tab.id !== newTab.id && 
            !tab.url.startsWith('chrome-extension://') &&
            tab.url !== 'chrome://extensions/'
          );
          chrome.tabs.remove(tabsToClose.map(tab => tab.id));
        });
      });
    });
  });
});

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