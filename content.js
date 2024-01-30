// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "activatePicker") {
    activateColorPicker();
  }
});

async function activateColorPicker() {
  try {
    // Activate color picker and await the color selection
    const color = await getColorAtCursor();
    if (color) {
      showFinalColor(color);
    }
  } catch (error) {
    console.error("Error during color picking:", error);
    // Handle the error appropriately
  }
}

function handleMouseMove(event) {
  // Show a temporary tooltip with the current color
  const color = getColorAtCursor(event.clientX, event.clientY);
  showTooltip(event.clientX, event.clientY, color);
}

function handleClick(event) {
  // Finalize the color selection
  const color = getColorAtCursor(event.clientX, event.clientY);
  showFinalColor(color);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("click", handleClick);
}

async function getColorAtCursor() {
  // Using the EyeDropper API
  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    return result.sRGBHex; // Return the hex value of the selected color
  } catch (e) {
    console.error("Error picking color:", e);
    throw e; // Re-throw the error to be handled by the caller
  }
}

function showTooltip(x, y, color) {
  // Create or update a tooltip element showing the color
  let tooltip = document.getElementById("colorPickerTooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "colorPickerTooltip";
    tooltip.style.position = "fixed";
    tooltip.style.zIndex = 10000;
    document.body.appendChild(tooltip);
  }
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  tooltip.textContent = color;
  tooltip.style.background = color;
}

function showFinalColor(color) {
  // Copy the selected color to the clipboard
  navigator.clipboard
    .writeText(color)
    .then(() => {
      console.log(`Color ${color} copied to clipboard`);
      // You can also provide some visual feedback to the user if needed
    })
    .catch((err) => {
      console.error("Failed to copy color to clipboard: ", err);
    });
}
