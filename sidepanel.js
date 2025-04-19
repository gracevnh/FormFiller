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

// Track which profile is being edited
let editingProfileKey = null;

// Track editing
let fillFormOpen = false;
let editClickOne = false;
let createClickOne = false;

// update this when new fields are added
const fname = document.getElementById("fname");
const mname = document.getElementById("mname");
const lname = document.getElementById("lname");
const preferredName = document.getElementById("preferredName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const address = document.getElementById("address");
const city = document.getElementById("city");
const state = document.getElementById("state");
const zip = document.getElementById("zip");
const country = document.getElementById("country");
const nationality = document.getElementById("nationality");
const username = document.getElementById("username");
const password = document.getElementById("password");
const notes = document.getElementById("notes");

const saveButton = document.getElementById("save-data");
const editProfileButton = document.getElementById("edit-profile");
const deleteProfileButton = document.getElementById("delete-profile");

/*
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
*/  

// Save or Update Profile
saveButton.addEventListener("click", function () {
  if (!fname.value.trim()) {
      alert("First Name is required.");
      return;
  }
  if (!lname.value.trim()) {
      alert("Last Name is required.");
      return;
  }
  if (email.value.trim() && !email.value.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }
  if (phone.value.trim() && !/^\d+$/.test(phone.value)) {
      alert("Phone number must contain only digits.");
      return;
  }

  const data = {
    fname: fname.value,
    mname: mname.value,
    lname: lname.value,
    preferredName: preferredName.value,
    dob: dob.value,
    gender: gender.value,
    nationality: nationality.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    city: city.value,
    state: state.value,
    zip: zip.value,
    country: country.value,
    username: username.value,
    password: password.value,
    notes: notes.value
};

  // Use existing key if editing, otherwise create a new one
  let key = editingProfileKey ? editingProfileKey : data.fname + data.lname;

  chrome.storage.local.set({ [key]: data }, function () {
      console.log(editingProfileKey ? "Profile updated:" : "New profile saved:", key, data);
      alert(editingProfileKey ? "Profile updated successfully!" : "Profile created successfully!");

      editingProfileKey = null; // Reset editing state
      showProfilesFunction();
  });

  // Hide form after saving
  document.getElementById("fill-form-page").style.display = "none";

  // Update trackers
  fillFormOpen = false;
  editClickOne = false;
  createClickOne = false;
});

// Edit Profile
editProfileButton.addEventListener("click", function () {
  const selectedProfileKey = document.getElementById("show-profiles").querySelector("select").value;

  // click
  if(!editClickOne){
    editClickOne = true;
    createClickOne = false;

    console.log("im here edit");

    /*
    // check if both are true
    if(editClickOne && createClickOne){
      createClickOne = false;
    }
    */

    if (!selectedProfileKey) {
      alert("Please select a profile to edit.");
      return;
    }

    // Update tracker
    fillFormOpen = true;

    chrome.storage.local.get(selectedProfileKey, function (result) {
        if (!result[selectedProfileKey]) {
            alert("Profile not found.");
            return;
        }

        const profileData = result[selectedProfileKey];

        // Store the profile key being edited
        editingProfileKey = selectedProfileKey;

        // Populate form fields with existing data
        fname.value = profileData.fname || "";
        mname.value = profileData.mname || "";
        lname.value = profileData.lname || "";
        preferredName.value = profileData.preferredName || "";
        email.value = profileData.email || "";
        phone.value = profileData.phone || "";
        dob.value = profileData.dob || "";
        gender.value = profileData.gender || "";
        address.value = profileData.address || "";
        city.value = profileData.city || "";
        state.value = profileData.state || "";
        zip.value = profileData.zip || "";
        country.value = profileData.country || "";
        nationality.value = profileData.nationality || "";
        username.value = profileData.username || "";
        notes.value = profileData.notes || "";
        password.value = profileData.password || "";

        // Show the form
        document.getElementById("fill-form-page").style.display = "flex";
    });
  }
  // if click twice
  else if(fillFormOpen){
    if(editClickOne){
      document.getElementById("fill-form-page").style.display = "none";
      editClickOne = false;
      fillFormOpen = false;
      createClickOne = false;
    }
  }
  console.log("Form Closed - Updated States:");
  console.log("editClickOne:", editClickOne);
  console.log("createClickOne:", createClickOne);
  console.log("fillFormOpen:", fillFormOpen);
});

// Delete Profile
deleteProfileButton.addEventListener("click", function () {
  const selectedProfileKey = document.getElementById("show-profiles").querySelector("select").value;

  if (!selectedProfileKey) {
      alert("Please select a profile to delete.");
      return;
  }

  if (confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      chrome.storage.local.remove(selectedProfileKey, function () {
          console.log("Profile deleted:", selectedProfileKey);
          alert("Profile deleted successfully!");

          // Refresh the dropdown list
          showProfilesFunction();
      });
  }
});

/*
// Create Account Button (Show Form)
document.getElementById("create-account").addEventListener("click", function () {
  const fillFormPage = document.getElementById("fill-form-page");

  if (!fillFormPage) {
      console.error("Error: 'fill-form-page' not found.");
      return;
  }

  // Toggle visibility
  if (fillFormPage.style.display === "none" || fillFormPage.style.display === "") {
      fillFormPage.style.display = "flex";
  } else {
      fillFormPage.style.display = "none";
  }

  // Reset form fields for a new profile
  fname.value = "";
  mname.value = "";
  lname.value = "";
  email.value = "";
  phone.value = "";
  dob.value = "";
  gender.value = "";
  address.value = "";
  city.value = "";
  state.value = "";
  country.value = "";
  username.value = "";
  notes.value = "";

  // Reset editing mode to ensure we're creating a new profile
  editingProfileKey = null;

  console.log("Create Account button clicked, form is now visible.");
});
*/

// Event listener for "Create Account" button
const createAccountButton = document.getElementById("create-account");

createAccountButton.addEventListener("click", function () {  
  const fillFormPage = document.getElementById("fill-form-page");

  // first click
  if(!createClickOne){
    createClickOne = true;
    editClickOne = false;

    console.log("im here create");

    /*
    // check if both true
    if(editClickOne && createClickOne){
      editCreateOne = false;
    }
    */

    if(fillFormOpen = true){
      // Reset form fields for a new profile
      fname.value = "";
      mname.value = "";
      lname.value = "";
      email.value = "";
      phone.value = "";
      dob.value = "";
      gender.value = "";
      address.value = "";
      city.value = "";
      state.value = "";
      country.value = "";
      username.value = "";
      notes.value = "";
    }
    document.getElementById("fill-form-page").style.display = "flex";
    fillFormOpen = true;
  }
  // if click twice
  else if(fillFormOpen){
    if(createClickOne){
      document.getElementById("fill-form-page").style.display = "none";
      createClickOne = false;
      fillFormOpen = false;
      editClikeOne = false;
    }
  }

  /*
  // Toggle visibility of the form
  if (fillFormPage.style.display === "none" || fillFormPage.style.display === "") {
    fillFormPage.style.display = "flex";  // Show the form
  } else {
    fillFormPage.style.display = "none";  // Hide the form (completely removes from the layout)
  }
  */

  console.log("Form Closed - Updated States:");
  console.log("editClickOne:", editClickOne);
  console.log("createClickOne:", createClickOne);
  console.log("fillFormOpen:", fillFormOpen);
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

    console.log(profileName);
    
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

/*
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
*/

// Show Profiles in Dropdown
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