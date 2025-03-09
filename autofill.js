function autofillForm() {
    console.log("autofill start");

    // getting stored data
    chrome.storage.local.get("input", function (data) {
        if (!data.input) {
            console.log("No form data found.");
            return;
        }

        // getting stored data
        let values = Object.values(data.input);
        let idx = 0;

        // fill in input text fields, swap out textarea for other input types
        let textInputs = document.querySelectorAll("input:not([type='hidden']), textarea");
        textInputs.forEach(input => {
            if (idx < values.length) { input.value = values[idx++];  }
        });

        console.log("autofill complete :)");
    });
}

// listen for messages from background/sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofill_form") {
        autofillForm();
        sendResponse({ success: true }); // send back success response
    }
});
