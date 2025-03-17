console.log("Content script loaded and running!");
let audioContext;
let gainNode;
let source;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content.js:", request);
  if (request.status) {
    chrome.tabCapture.getMediaStreamId(
      { consumerTabId: request.activeTabId },
      (streamId) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error getting stream ID:",
            chrome.runtime.lastError.message
          );
          sendResponse({ error: "Failed to get media stream ID" });
          return;
        }
        console.log("entered", streamId,audioContext);
        if (!audioContext) {
          console.log("entered", streamId);
          audioContext = new AudioContext();
          gainNode = audioContext.createGain();
          navigator.mediaDevices
            .getUserMedia({
              audio: {
                mandatory: {
                  chromeMediaSource: "tab",
                  chromeMediaSourceId: request.activeTabId,
                },
              },
            })
            .then((stream) => {
              source = audioContext.createMediaStreamSource(stream);
              source.connect(gainNode);
              gainNode.connect(audioContext.destination);

              gainNode.gain.value = message.volume / 100;
              if (!message.status) {
                gainNode.gain.value = 0;
              }

              sendResponse({ status: "success" });
            })
            .catch((error) => {
              console.error("Error accessing media stream:", error);
              sendResponse({ status: "error", error: error.message });
            });
        }
      }
    );
    sendResponse({ success: true, message: "PONG" });
  } else {
    console.log("Unhandled message:", request);
  }
  return true;
});
