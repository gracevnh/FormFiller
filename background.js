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

  chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

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

  // listening for messages from the side panel
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // autofill form request
    if (request.action === "autofill_form") {
        const profileKey = request.profileKey;
        console.log("profile key in background:", profileKey);
        console.log("autofill req received from side panel");
        
        // getting the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.error("no active tabs atm");
                return;
            }

            // inject autofill script
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: autofillForm,
                args: [profileKey]  
            }).then(() => {
                sendResponse({ success: true });
            }).catch(error => {
                console.error("Failed to execute autofillForm:", error);
                sendResponse({ success: false, error: error.message });
            });

            return true;
        });
    }
});
