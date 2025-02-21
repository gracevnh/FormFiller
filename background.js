chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked. Running field parser on tab:", tab.id);
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractFieldTitles
    }).then(() => {
      console.log("Script executed successfully!");
    }).catch((error) => {
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
  