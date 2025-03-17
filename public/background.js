console.log("background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("sendingMessage", request, request.status);

  if (request.status) {
    console.log("true");
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        console.error("No valid active tab found");
        sendResponse({ error: "No active tab available" });
        return;
      }

      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(
        activeTabId,
        { ...request, activeTabId },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Failed to send message to content script:",
              chrome.runtime.lastError.message
            );
            sendResponse({ error: "Content script not responding" });
          } else {
            console.log("Message sent to content script successfully");
            sendResponse(response);
          }
        }
      );
    });
    return true;
  }

  sendResponse({ error: "Invalid request" });
  return false;
});
