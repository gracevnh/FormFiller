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
const mname = document.getElementById("mname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const address = document.getElementById("address");
const city = document.getElementById("city");
const state = document.getElementById("state");
const country = document.getElementById("country");
const username = document.getElementById("username");
const notes = document.getElementById("notes");

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
  if (!email.value.trim()) {
    alert("Email is required.");
    return;
  }
  if (!email.value.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }
  if (!phone.value.trim()) {
    alert("Phone Number is required.");
    return;
  }
  if (!/^\d+$/.test(phone.value)) {
    alert("Phone Number must contain only digits.");
    return;
  }

  data.fname = fname.value;
  data.lname = lname.value;
  data.email = email.value;
  data.phone = phone.value;
  data.dob = dob.value;
  data.mname = mname.value;
  data.gender = gender.value;
  data.address = address.value;
  data.city = city.value;
  data.state = state.value;
  data.country = country.value;
  data.username = username.value;
  data.notes = notes.value;

  // Saving every user in the database as their full name
  let key = data.fname + data.lname;

  // Store data in chrome.storage.local with the unique key
  chrome.storage.local.set({ [key]: data }, function () {
      console.log("Data saved:", key, data);
      alert("Form submitted successfully!");
  })

  showProfilesFunction();
});

// Event listener for "Create Account" button
const createAccountButton = document.getElementById("create-account");

createAccountButton.addEventListener("click", function () {
  const fillFormPage = document.getElementById("fill-form-page");

  // Toggle visibility of the form
  if (fillFormPage.style.display === "none" || fillFormPage.style.display === "") {
    fillFormPage.style.display = "flex";  // Show the form
  } else {
    fillFormPage.style.display = "none";  // Hide the form (completely removes from the layout)
  }
});

// Event listener for "Tutorial" button
const tutorialButton = document.getElementById("tutorial");

tutorialButton.addEventListener("click", function () {
  const tutorialInfo = document.getElementById("tutorial-info");

  // Toggle visibility of the form
  if (tutorialInfo.style.display === "none" || tutorialInfo.style.display === "") {
    tutorialInfo.style.display = "flex";  // Show the form
  } else {
    tutorialInfo.style.display = "none";  // Hide the form (completely removes from the layout)
  }
});

// on click of fill form button
const fillFormButton = document.getElementById("fill-form");
fillFormButton.addEventListener("click", function () {
    console.log("Fill Form Button clicked");

    profileName = document.getElementById("show-profiles").querySelector("select").value;
    
    // getting the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // error check -> no active tab
        if (!tabs.length) {
            console.error("No active tabs found.");
            return;
        }

        // Inject scripts into the active tab
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["string-similarity.js"]
        }).then(() => {
            console.log("string-similiarity");

            return chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ["fieldSynonyms.js"]
            });
        }).then(() => {
            console.log("utils injected");

            return chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["autofill.js"]
            });
        }).then(() => {
            console.log("autofill script injected");

            chrome.tabs.sendMessage(tabs[0].id, { action: "autofill_form", profileKey: profileName }, function (response) {
              console.log("profile key in sidepanel:", profileName);
      
              // Error check -> no response from content script
              if (chrome.runtime.lastError) {
                  console.error("Error sending message:", chrome.runtime.lastError);
              } else if (response && response.success) {
                  // Success message
                  console.log("Message received:", response);
              } else {
                  console.log("No response from content script?");
              }
          });
        }).catch((error) => {
            // Catch and handle any errors that occur during script injection or messaging
            console.error("Error during script injection or messaging:", error);
            alert("An error occurred. Please check the console for details.");
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