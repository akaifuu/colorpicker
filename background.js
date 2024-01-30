chrome.commands.onCommand.addListener(function (command) {
  if (command == "activate_color_picker") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "activatePicker" });
    });
  }
});
