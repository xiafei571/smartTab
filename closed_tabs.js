document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.getElementById('tabList');
  
  function updateStorage(categorizedTabs) {
    const allTabs = Object.entries(categorizedTabs).flatMap(([dateTimeCategory, domains]) => 
      Object.entries(domains).flatMap(([domain, tabs]) => 
        tabs.map(tab => ({
          ...tab, 
          dateTimeCategory
        }))
      )
    );
    chrome.storage.local.set({ closedTabs: allTabs }, () => {
      console.log('Updated tabs saved to storage');
      renderTabs(categorizedTabs);
    });
  }

  function createDeleteLink(text, clickHandler) {
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = text;
    deleteLink.style.color = '#dc3545';
    deleteLink.style.textDecoration = 'none';
    deleteLink.style.visibility = 'hidden';
    deleteLink.style.marginLeft = '10px';
    deleteLink.style.padding = '2px 5px';
    deleteLink.style.borderRadius = '3px';
    deleteLink.style.transition = 'all 0.3s ease';

    deleteLink.addEventListener('mouseenter', () => {
      deleteLink.style.backgroundColor = '#dc3545';
      deleteLink.style.color = 'white';
    });

    deleteLink.addEventListener('mouseleave', () => {
      deleteLink.style.backgroundColor = 'transparent';
      deleteLink.style.color = '#dc3545';
    });

    deleteLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clickHandler();
    });

    return deleteLink;
  }

  function createConfirmDialog(message, onConfirm, targetElement) {
    const dialog = document.createElement('div');
    dialog.style.position = 'absolute';
    dialog.style.backgroundColor = 'white';
    dialog.style.border = '1px solid #ccc';
    dialog.style.borderRadius = '4px';
    dialog.style.padding = '10px';
    dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    dialog.style.zIndex = '1000';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.margin = '0 0 10px 0';
    dialog.appendChild(messageElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.marginRight = '5px';
    yesButton.style.padding = '5px 10px';
    yesButton.style.backgroundColor = '#dc3545';
    yesButton.style.color = 'white';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '3px';
    yesButton.style.cursor = 'pointer';
    yesButton.addEventListener('click', () => {
      onConfirm();
      document.body.removeChild(dialog);
    });

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.padding = '5px 10px';
    noButton.style.backgroundColor = '#6c757d';
    noButton.style.color = 'white';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '3px';
    noButton.style.cursor = 'pointer';
    noButton.addEventListener('click', () => {
      document.body.removeChild(dialog);
    });

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);
    dialog.appendChild(buttonContainer);

    // 定位对话框
    const rect = targetElement.getBoundingClientRect();
    dialog.style.left = `${rect.left}px`;
    dialog.style.top = `${rect.bottom + window.scrollY}px`;

    document.body.appendChild(dialog);
  }

  function renderTabs(categorizedTabs) {
    tabList.innerHTML = '';
    for (const [dateTimeCategory, domains] of Object.entries(categorizedTabs)) {
      const dateTimeLi = document.createElement('li');
      dateTimeLi.style.marginBottom = '30px';

      const dateTimeHeader = document.createElement('h2');
      dateTimeHeader.textContent = dateTimeCategory;
      
      // 根据时间类别设置背景颜色渐变
      const timeCategory = dateTimeCategory.split(', ')[1];
      let backgroundGradient;
        switch (timeCategory) {
        case 'Morning':
            backgroundGradient = 'linear-gradient(to right, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.8))';
            break;
        case 'Afternoon':
            backgroundGradient = 'linear-gradient(to right, rgba(255, 165, 0, 0.9), rgba(255, 69, 0, 0.8))';
            break;
        case 'Evening':
            backgroundGradient = 'linear-gradient(to right, rgba(255, 69, 0, 0.9), rgba(30, 144, 255, 0.8))';
            break;
        case 'Night':
            backgroundGradient = 'linear-gradient(to right, rgba(30, 144, 255, 0.9), rgba(255, 215, 0, 0.8))';
            break;
        default:
            backgroundGradient = 'linear-gradient(to right, rgba(66, 133, 244, 0.9), rgba(52, 168, 83, 0.8))'; // 默认渐变
        }
      
      dateTimeHeader.style.background = backgroundGradient;
      dateTimeHeader.style.color = 'white';
      dateTimeHeader.style.padding = '10px';
      dateTimeHeader.style.borderRadius = '5px';
      dateTimeHeader.style.margin = '0';
      dateTimeHeader.style.fontWeight = 'normal';
      dateTimeLi.appendChild(dateTimeHeader);

      const domainList = document.createElement('ul');
      domainList.style.listStyleType = 'none';
      domainList.style.padding = '0';

      for (const [domain, tabs] of Object.entries(domains)) {
        const domainLi = document.createElement('li');
        domainLi.style.marginBottom = '10px';

        const domainHeader = document.createElement('div');
        domainHeader.style.display = 'flex';
        domainHeader.style.justifyContent = 'space-between';
        domainHeader.style.alignItems = 'center';
        domainHeader.style.backgroundColor = '#f0f0f0';
        domainHeader.style.padding = '5px';
        domainHeader.style.borderRadius = '3px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '-';
        toggleButton.style.marginRight = '10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.visibility = 'hidden'; // 初始状态为隐藏

        const domainTitle = document.createElement('h3');
        domainTitle.textContent = `${domain}`;
        domainTitle.style.margin = '0';
        domainTitle.style.flex = '1';

        const tabCount = document.createElement('span');
        tabCount.textContent = `(${tabs.length})`;
        tabCount.style.marginLeft = '10px';
        tabCount.style.display = 'none'; // 初始状态隐藏

        domainTitle.appendChild(tabCount);

        const actionLinks = document.createElement('div');
        actionLinks.style.visibility = 'hidden'; // 初始状态为隐藏
        actionLinks.style.display = 'flex'; // 使用 flex 布局
        actionLinks.style.alignItems = 'center'; // 垂直居中对齐

        const reopenLink = document.createElement('a');
        reopenLink.href = '#';
        reopenLink.textContent = 'reopen';
        reopenLink.style.marginRight = '10px';
        reopenLink.addEventListener('click', (e) => {
          e.preventDefault();
          tabs.forEach(tab => {
            chrome.tabs.create({ url: tab.url });
          });
          checkmark.style.visibility = 'visible';
        });

        const clearLink = document.createElement('a');
        clearLink.href = '#';
        clearLink.textContent = 'clear';
        clearLink.style.marginRight = '10px';
        clearLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          createConfirmDialog(
            `Are you sure you want to clear all tabs for ${domain}?`, 
            () => {
              delete domains[domain];
              if (Object.keys(domains).length === 0) {
                delete categorizedTabs[dateTimeCategory];
              }
              updateStorage(categorizedTabs);
            },
            e.target  // 传入事件的目标元素，即 clearLink 本身
          );
        });

        const checkmark = document.createElement('span');
        checkmark.innerHTML = '&#10004;';
        checkmark.style.visibility = 'hidden';
        checkmark.style.color = 'green';
        checkmark.style.fontWeight = 'bold';

        actionLinks.appendChild(reopenLink);
        actionLinks.appendChild(clearLink);
        actionLinks.appendChild(checkmark);

        domainHeader.appendChild(toggleButton);
        domainHeader.appendChild(domainTitle);
        domainHeader.appendChild(actionLinks);

        domainLi.appendChild(domainHeader);

        const tabList = document.createElement('ul');
        tabList.style.listStyleType = 'none';
        tabList.style.padding = '0 0 0 20px';

        tabs.forEach((tab, index) => {
          const tabLi = document.createElement('li');
          tabLi.style.marginBottom = '5px';
          tabLi.style.display = 'flex';
          tabLi.style.justifyContent = 'space-between';
          tabLi.style.alignItems = 'center';
          tabLi.style.padding = '5px';
          tabLi.style.transition = 'all 0.3s ease';

          const contentWrapper = document.createElement('div');
          contentWrapper.style.flex = '1';
          const shortTitle = (tab.title || 'Untitled').slice(0, 15) + (tab.title.length > 15 ? '...' : '');
          
          contentWrapper.appendChild(document.createTextNode(`- ${shortTitle}: `));
          
          const link = document.createElement('a');
          link.href = tab.url;
          const shortUrl = tab.url.length > 40 ? tab.url.slice(0, 40) + '...' : tab.url;
          link.textContent = shortUrl;
          link.title = tab.url; // 添加完整URL作为悬停提示
          link.target = '_blank';
          contentWrapper.appendChild(link);

          tabLi.appendChild(contentWrapper);

          const rightWrapper = document.createElement('div');
          rightWrapper.style.display = 'flex';
          rightWrapper.style.alignItems = 'center';

          const timeSpan = document.createElement('span');
          timeSpan.textContent = new Date(tab.closedAt).toLocaleTimeString();
          timeSpan.style.marginRight = '10px';
          rightWrapper.appendChild(timeSpan);

          const deleteTabLink = createDeleteLink('clear', () => {
            tabs.splice(index, 1);
            if (tabs.length === 0) {
              delete domains[domain];
              if (Object.keys(domains).length === 0) {
                delete categorizedTabs[dateTimeCategory];
              }
            }
            updateStorage(categorizedTabs);
          });
          rightWrapper.appendChild(deleteTabLink);

          tabLi.appendChild(rightWrapper);

          tabLi.addEventListener('mouseenter', () => {
            deleteTabLink.style.visibility = 'visible';
            tabLi.style.backgroundColor = '#f8f9fa';
            tabLi.style.border = '1px solid #007bff';
            tabLi.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
          });
          tabLi.addEventListener('mouseleave', () => {
            deleteTabLink.style.visibility = 'hidden';
            tabLi.style.backgroundColor = 'transparent';
            tabLi.style.border = 'none';
            tabLi.style.boxShadow = 'none';
          });

          tabList.appendChild(tabLi);
        });

        domainLi.appendChild(tabList);

        // 修改鼠标悬停事件
        domainHeader.addEventListener('mouseenter', () => {
          toggleButton.style.visibility = 'visible';
          actionLinks.style.visibility = 'visible';
        });
        domainHeader.addEventListener('mouseleave', () => {
          toggleButton.style.visibility = 'hidden';
          actionLinks.style.visibility = 'hidden';
        });

        toggleButton.addEventListener('click', (e) => {
          e.stopPropagation(); // 阻止事件冒泡
          if (tabList.style.display === 'none') {
            tabList.style.display = 'block';
            toggleButton.textContent = '-';
            tabCount.style.display = 'none';
          } else {
            tabList.style.display = 'none';
            toggleButton.textContent = '+';
            tabCount.style.display = 'inline';
          }
        });

        domainList.appendChild(domainLi);
      }

      dateTimeLi.appendChild(domainList);
      tabList.appendChild(dateTimeLi);
    }
  }

  chrome.storage.local.get(['closedTabs'], (result) => {
    const closedTabs = result.closedTabs || [];
    
    const categorizedTabs = {};
    closedTabs.forEach(tab => {
      const url = new URL(tab.url);
      const domain = url.hostname.replace('www.', '');
      const dateTimeCategory = `${tab.formattedDate}, ${tab.timeCategory}`;
      
      if (!categorizedTabs[dateTimeCategory]) {
        categorizedTabs[dateTimeCategory] = {};
      }
      
      if (!categorizedTabs[dateTimeCategory][domain]) {
        categorizedTabs[dateTimeCategory][domain] = [];
      }
      
      categorizedTabs[dateTimeCategory][domain].push(tab);
    });
    
    renderTabs(categorizedTabs);
  });
});