class Profile {
    constructor(data) {
        this.data = data
    }
    get fname() {
        return this.data.fname;
    }
    get lname() {
        return this.data.lname;
    }
    get fullname() {
        return this.data.fname + " " + this.data.lname;
    }
    get dob() {
        return this.data.dob;
    }
    get phone() {
        return this.data.phone;
    }
    get email() {
        return this.data.email;
    }
}

// update this when new fields are added
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const saveButton = document.getElementById("save-data");

saveButton.addEventListener("click", function () {
  const data = {};

  if (!fname.value.trim()) {
    alert("First Name is required.");
    return;
  }
  if (!lname.value.trim()) {
    alert("Last Name is required.");
    return;
  }
  // if (!email.value.trim()) {
  //   alert("Email is required.");
  //   return;
  // }
  // if (!email.value.includes("@")) {
  //   alert("Please enter a valid email address.");
  //   return;
  // }
  // if (!phone.value.trim()) {
  //   alert("Phone Number is required.");
  //   return;
  // }
  // if (!/^\d+$/.test(phone.value)) {
  //   alert("Phone Number must contain only digits.");
  //   return;
  // }
  // if (!dob.value.trim()) {
  //   alert("Date of Birth is required.");
  //   return;
  // }

  data.fname = fname.value;
  data.lname = lname.value;
  // data.email = email.value;
  // data.phone = phone.value;
  // data.dob = dob.value;

  // need to change "input" to something else. currently it is just a dummy name


  // Saving every user in the database as their full name
  let key = data.fname + data.lname;

  // Store data in chrome.storage.local with the unique key
  chrome.storage.local.set({ [key]: data }, function () {
      console.log("Data saved:", key, data);
      alert("Form submitted successfully!");
  })

  showProfilesFunction();
});

// on click of fill form button
const fillFormButton = document.getElementById("fill-form");
fillFormButton.addEventListener("click", function () {
    console.log("Fill Form Button clicked");

    // getting the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // error check -> no active tab
        if (!tabs.length) {
            console.error("No active tabs found.");
            return;
        }

        // Injecting my autofill script into the active tab
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["autofill.js"]
        }).then(() => {
            console.log("autofill script injected");
            
            // sending message to the content script
            chrome.tabs.sendMessage(tabs[0].id, { action: "autofill_form" }, function (response) {

              // error check -> no response from content script
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError);
                } else if (response && response.success) {
                  // success message
                    console.log("Message received:", response);
                } else {
                    console.log("No response from content script??");
                }

            });

        }).catch(function(error) {
          console.log(error);
          alert(error);
        });

    });
  
});


function showProfilesFunction() {
  const showProfiles = document.getElementById("show-profiles");
  const selectElement = showProfiles.querySelector("select");
  selectElement.innerHTML = ""; // Clear existing options

  chrome.storage.local.get(null, function (profiles) {
      for (let key in profiles) {
          const profile = new Profile(profiles[key]);
          const option = document.createElement("option");
          option.value = key;
          option.text = profile.fullname;
          selectElement.add(option);
      }
  });
}

showProfilesFunction();