document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded successfully!");

  const parseButton = document.getElementById("parseInputs");

  parseButton.addEventListener("click", async () => {
    console.log("Parse button clicked!");

    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!currentTab) {
      console.error("No active tab found.");
      return;
    }

    console.log("Executing input field parser on tab:", currentTab.id);

    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      function: extractFieldTitles,
    })
    .then(() => {
      console.log("Script executed successfully!");
    })
    .catch((error) => {
      console.error("Script execution failed:", error);
    });
  });

  // Function to extract and print field titles to the console
  function extractFieldTitles() {
    console.log("Extracting input field titles...");

    let inputs = document.querySelectorAll("input, textarea, select");
    if (inputs.length === 0) {
      console.warn("No input fields found on this page.");
      return;
    }

    inputs.forEach((input) => {
      let label = document.querySelector(`label[for="${input.id}"]`);
      let title = label ? label.innerText.trim() : input.name || input.placeholder || "Unnamed Field";
      console.log("Field Title:", title);
    });

    console.log("Finished parsing input fields.");
  }

  // Open up the side panel on sidepanel 
});