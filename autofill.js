function getProfile(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, function(data) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data[key] || {});
      });
    });
}

function autofillForm() {
    console.log("autofill start");

    getProfile("input")
    .then(function(userProfile) {
        let values = Object.values(userProfile);
        let idx = 0;

        // fill in input text fields, swap out textarea for other input types
        let textInputs = document.querySelectorAll("input:not([type='hidden']), textarea");
        textInputs.forEach(input => {
            if (idx < values.length) { input.value = values[idx++];  }
        });

        // Example code
        // document.getElementById("fname").value = userProfile.fname || "";
        // document.getElementById("lname").value = userProfile.lname || "";
        // document.getElementById("email").value = userProfile.email || "";
        // document.getElementById("phone").value = userProfile.phone || "";
        // document.getElementById("dob").value = userProfile.dob || "";

        console.log("autofill complete :)");
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

// listen for messages from background/sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofill_form") {
        autofillForm();
        sendResponse({ success: true }); // send back success response
    }
});
