// List of added elements (for display in popup)
let elements = [];

// Function to send message to content script (assumes it's injected)
async function sendMessageToContent(action, data = {}) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action, data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        alert("Error: Could not communicate with page. Try reloading.");
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });
}

// Inject content.js only once (called on popup load)
async function injectContentScript() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
}

// Fetch and update elements list in popup
async function updateElementsList() {
  const response = await sendMessageToContent("getElements");
  const list = document.getElementById("elementsList");
  list.innerHTML = ""; // Always clear first

  if (response && response.elements) {
    elements = response.elements;
    if (elements.length === 0) {
      list.innerHTML = "<p>No elements added yet.</p>";
    } else {
      elements.forEach((el) => {
        const div = document.createElement("div");
        div.innerHTML = `<input type="checkbox" data-id="${el.id}"> ${el.type} (${el.id})`;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
          const response = await sendMessageToContent("deleteSelected", {
            selected: [el.id],
          });
          if (response && response.elements) {
            updateElementsList();
          }
        });
        div.appendChild(deleteBtn);
        list.appendChild(div);
      });
    }
  } else {
    list.innerHTML =
      "<p>Error fetching elements. Try reloading the page or check console.</p>";
  }
}

// Run this when popup loads: Inject once, then fetch initial list
document.addEventListener("DOMContentLoaded", async () => {
  await injectContentScript();
  updateElementsList();
});

// Add line
document.getElementById("addLine").addEventListener("click", async () => {
  const type = document.getElementById("lineType").value;
  const color = document.getElementById("lineColor").value;
  const width = document.getElementById("lineWidth").value;
  const response = await sendMessageToContent("addLine", {
    type,
    color,
    width,
  });
  if (response && response.elements) {
    updateElementsList();
  }
});

// Add multiple lines (5)
document
  .getElementById("addMultipleLines")
  .addEventListener("click", async () => {
    const type = document.getElementById("lineType").value;
    const color = document.getElementById("lineColor").value;
    const width = document.getElementById("lineWidth").value;
    const response = await sendMessageToContent("addMultipleLines", {
      type,
      color,
      width,
      count: 5,
    });
    if (response && response.elements) {
      updateElementsList();
    }
  });

// Add point
document.getElementById("addPoint").addEventListener("click", async () => {
  const color = document.getElementById("pointColor").value;
  const response = await sendMessageToContent("addPoint", { color });
  if (response && response.elements) {
    updateElementsList();
  }
});

// Calculate distance
document
  .getElementById("calculateDistance")
  .addEventListener("click", async () => {
    const selected = Array.from(
      document.querySelectorAll("#elementsList input:checked")
    ).map((cb) => cb.dataset.id);
    if (selected.length !== 2) {
      alert("Please select exactly two elements.");
      return;
    }
    const response = await sendMessageToContent("calculateDistance", {
      selected,
    });
    if (response && response.distance !== undefined) {
      alert("Distance: " + response.distance.toFixed(2) + " pixels");
    }
  });

// Delete selected (bulk via checkboxes)
document
  .getElementById("deleteSelected")
  .addEventListener("click", async () => {
    const selected = Array.from(
      document.querySelectorAll("#elementsList input:checked")
    ).map((cb) => cb.dataset.id);
    if (selected.length === 0) {
      alert("Please select at least one element to delete.");
      return;
    }
    const response = await sendMessageToContent("deleteSelected", { selected });
    if (response && response.elements) {
      updateElementsList();
    }
  });

// Clear all
document.getElementById("clearAll").addEventListener("click", async () => {
  await sendMessageToContent("clearAll");
  updateElementsList();
});
