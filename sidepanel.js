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

    // new fields
    get studentID() { return this.data.studentID; }
    get grade() { return this.data.grade; }
    get graduation() { return this.data.graduation; }
    get ethnicity() { return this.data.ethnicity; }
    get insuranceCompany() { return this.data.insuranceCompany; }
    get insuranceNumber() { return this.data.insuranceNumber; }
    get physicianName() { return this.data.physicianName; }
    get physicianPhone() { return this.data.physicianPhone; }
    // seperate obj for emergency contact
    get emergencyContactFirst() { return this.data.emergencyContact?.first || ""; }
    get emergencyContactLast() { return this.data.emergencyContact?.last || ""; }
    get emergencyContactPhone() { return this.data.emergencyContact?.phone || ""; }
    get emergencyRelationship() { return this.data.emergencyContact?.relationship || ""; }
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
// new fields
const studentID = document.getElementById("studentID");
const grade = document.getElementById("grade");
const graduation = document.getElementById("graduation");
const ethnicity = document.getElementById("ethnicity");
const insuranceCompany = document.getElementById("insuranceCompany");
const insuranceNumber = document.getElementById("insuranceNumber");
const physicianName = document.getElementById("physicianName");
const physicianPhone = document.getElementById("physicianPhone");
const emergencyContactFirst = document.getElementById("emergencyContactFirst");
const emergencyContactLast = document.getElementById("emergencyContactLast");
const emergencyContactPhone = document.getElementById("emergencyContactPhone");
const emergencyRelationship = document.getElementById("emergencyRelationship");

const saveButton = document.getElementById("save-data");
const editProfileButton = document.getElementById("edit-profile");
const deleteProfileButton = document.getElementById("delete-profile");

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
    notes: notes.value,
    // new fields
    studentID: studentID.value,
    grade: grade.value,
    graduation: graduation.value,
    ethnicity: ethnicity.value,
    insuranceCompany: insuranceCompany.value,
    insuranceNumber: insuranceNumber.value,
    physicianName: physicianName.value,
    physicianPhone: physicianPhone.value,
    // seperate obj for emergency contact 
    emergencyContact: {
      first: emergencyContactFirst.value,
      last: emergencyContactLast.value,
      phone: emergencyContactPhone.value,
      relationship: emergencyRelationship.value
    }
    
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
        // new fields
        studentID.value = profileData.studentID || "";
        grade.value = profileData.grade || "";
        graduation.value = profileData.graduation || "";
        ethnicity.value = profileData.ethnicity || "";
        insuranceCompany.value = profileData.insuranceCompany || "";
        insuranceNumber.value = profileData.insuranceNumber || "";
        physicianName.value = profileData.physicianName || "";
        physicianPhone.value = profileData.physicianPhone || "";
        emergencyContactFirst.value = profileData.emergencyContact?.first || "";
        emergencyContactLast.value = profileData.emergencyContact?.last || "";
        emergencyContactPhone.value = profileData.emergencyContact?.phone || "";
        emergencyRelationship.value = profileData.emergencyContact?.relationship || "";

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
      // new fields 
      studentID.value = "";
      grade.value = "";
      graduation.value = "";
      ethnicity.value = "";
      insuranceCompany.value = "";
      insuranceNumber.value = "";
      physicianName.value = "";
      physicianPhone.value = "";
      emergencyContactFirst.value = "";
      emergencyContactLast.value = "";
      emergencyContactPhone.value = "";
      emergencyRelationship.value = "";
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