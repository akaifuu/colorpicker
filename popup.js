chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateColor") {
    document.getElementById("colorCode").textContent = request.color;
  }
});
