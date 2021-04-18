let numOpenTabs = 0;
let numOpenedTabs = 0;
let numClosedTabs = 0;
let mapTabsOpen = {};

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, function(tabs) {
        numOpenTabs = tabs.length;
        
        tabs.forEach(tab => {
            mapTabsOpen[tab.id] = tab;
            console.log(`Tab ${tab.id}: ${tab.title}`);
        });
        chrome.action.setBadgeText({text: numOpenTabs + ''});
        chrome.storage.sync.get({"numOpenTabs":0, 
        "numOpenedTabs":0, 
        "numClosedTabs":0 }, (result) => {
            // numOpenTabs = result.numOpenTabs;
            numOpenedTabs = result.numOpenedTabs;
            numClosedTabs = result.numClosedTabs;
            chrome.storage.sync.set({ numOpenTabs, numOpenedTabs, numClosedTabs });
        });
        console.log('num initial open tabs updated');
      });
    
    console.log('tab counter extension was installed!!!');
});

function getNumOpenTabs() {
    return chrome.storage.sync.get({ numOpenTabs })
}

function incrementOpenTabs() {
    chrome.storage.sync.get(['numOpenTabs', 'numOpenedTabs'], (data) => {
        numOpenTabs =  data.numOpenTabs + 1;
        numOpenedTabs = data.numOpenedTabs + 1;
        chrome.storage.sync.set({ numOpenTabs, numOpenedTabs });
        chrome.action.setBadgeText({text: numOpenTabs + ''});
        console.log('incremented');
    }); ;
    
    // return numOpenTabs;
}

function decrementOpenTabs() {
    chrome.storage.sync.get(['numOpenTabs', 'numClosedTabs'], (data) => {
        numOpenTabs =  data.numOpenTabs - 1;
        numClosedTabs = data.numClosedTabs + 1;
        chrome.storage.sync.set({ numOpenTabs, numClosedTabs });
        chrome.action.setBadgeText({text: numOpenTabs + ''});
        console.log('decremented');
    });
}

chrome.tabs.onCreated.addListener(function(tab) {
    let tid = tab.id;
    incrementOpenTabs();

    mapTabsOpen[tid] = tab.title;
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete mapTabsOpen[tabId];
    decrementOpenTabs();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    mapTabsOpen[tabId] = tab.title;
    console.log(`updated tab ${tabId} -> ${tab.title} `);
});