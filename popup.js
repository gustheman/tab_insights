// Initialize button with user's preferred color
let numOpenTabs = document.getElementById("numOpenTabs");
let numOpenedTabs = document.getElementById("numOpenedTabs");
let numClosedTabs = document.getElementById("numClosedTabs");

chrome.storage.sync.get({"numOpenTabs":0, 
                         "numOpenedTabs":0, 
                         "numClosedTabs":0 }, (result) => {
  numOpenTabs.innerText = result.numOpenTabs;
  numOpenedTabs.innerText = result.numOpenedTabs;
  numClosedTabs.innerText = result.numClosedTabs;
});