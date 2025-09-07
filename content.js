// Check if already injected to prevent redeclaration errors
if (window.frontendHelperInjected) {
  // Already injected, do nothing
} else {
  window.frontendHelperInjected = true;

  // Internal list of elements (synced with popup)
  let elements = [];

  // Add global drag-and-drop listeners only once
  document.body.addEventListener("dragover", (e) => e.preventDefault());
  document.body.addEventListener("drop", (e) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    const droppedElem = document.getElementById(droppedId);
    if (droppedElem) {
      if (droppedElem.style.width === "100%") {
        // Horizontal line
        droppedElem.style.top = `${e.clientY}px`;
      } else if (droppedElem.style.height === "100%") {
        // Vertical line
        droppedElem.style.left = `${e.clientX}px`;
      } else {
        // Point
        droppedElem.style.left = `${e.clientX}px`;
        droppedElem.style.top = `${e.clientY}px`;
      }
    }
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data } = message;

    if (action === "addLine") {
      addElement("line", data);
      sendResponse({ elements });
    } else if (action === "addMultipleLines") {
      for (let i = 0; i < data.count; i++) {
        addElement("line", data);
      }
      sendResponse({ elements });
    } else if (action === "addPoint") {
      addElement("point", data);
      sendResponse({ elements });
    } else if (action === "calculateDistance") {
      const distance = calculateDistance(data.selected);
      sendResponse({ distance });
    } else if (action === "clearAll") {
      clearAll();
      sendResponse({ elements });
    } else if (action === "deleteSelected") {
      deleteSelected(data.selected);
      sendResponse({ elements });
    } else if (action === "getElements") {
      sendResponse({ elements });
    }

    return true; // Indicate async response for all cases
  });

  // General function to add an element
  function addElement(type, options) {
    const id = `helper-${type}-${Date.now()}`;
    elements.push({ id, type });

    let elem;
    if (type === "line") {
      const { type: lineType, color, width } = options;
      elem = document.createElement("div");
      elem.id = id;
      elem.style.position = "absolute";
      elem.style.backgroundColor = color;
      elem.style.zIndex = "9999";
      elem.draggable = true;
      elem.style.cursor = "move";

      if (lineType === "horizontal") {
        elem.style.height = `${width}px`;
        elem.style.width = "100%";
        elem.style.top = `${Math.random() * window.innerHeight}px`;
        elem.style.left = "0";
      } else {
        elem.style.width = `${width}px`;
        elem.style.height = "100%";
        elem.style.left = `${Math.random() * window.innerWidth}px`;
        elem.style.top = "0";
      }
    } else if (type === "point") {
      const { color } = options;
      elem = document.createElement("div");
      elem.id = id;
      elem.style.position = "absolute";
      elem.style.backgroundColor = color;
      elem.style.width = "10px";
      elem.style.height = "10px";
      elem.style.borderRadius = "50%";
      elem.style.zIndex = "9999";
      elem.draggable = true;
      elem.style.cursor = "move";
      elem.style.left = `${Math.random() * window.innerWidth}px`;
      elem.style.top = `${Math.random() * window.innerHeight}px`;
    }

    // Drag functionality (per element)
    elem.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    document.body.appendChild(elem);
  }

  // Calculate distance between two selected elements
  function calculateDistance(selected) {
    const el1 = document.getElementById(selected[0]);
    const el2 = document.getElementById(selected[1]);
    if (!el1 || !el2) {
      alert("Elements not found.");
      return 0;
    }

    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    let distance = 0;
    if (el1.style.width === "100%" && el2.style.width === "100%") {
      // Two horizontal lines
      distance = Math.abs(rect1.top - rect2.top);
    } else if (el1.style.height === "100%" && el2.style.height === "100%") {
      // Two vertical lines
      distance = Math.abs(rect1.left - rect2.left);
    } else {
      // Points or mixed (Euclidean distance)
      const dx = rect1.left - rect2.left;
      const dy = rect1.top - rect2.top;
      distance = Math.sqrt(dx * dx + dy * dy);
    }

    return distance;
  }

  // Delete selected elements
  function deleteSelected(selected) {
    selected.forEach((id) => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.remove();
      }
      elements = elements.filter((el) => el.id !== id);
    });
  }

  // Clear all elements
  function clearAll() {
    document.querySelectorAll('[id^="helper-"]').forEach((el) => el.remove());
    elements = [];
  }
}
