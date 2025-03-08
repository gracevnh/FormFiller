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
  if (!dob.value.trim()) {
    alert("Date of Birth is required.");
    return;
  }

  data.fname = fname.value;
  data.lname = lname.value;
  data.email = email.value;
  data.phone = phone.value;
  data.dob = dob.value;

  // need to change "input" to something else. currently it is just a dummy name
  chrome.storage.local.set({ input: data }, function () {
    console.log("Data saved!", data);
    alert("Form submitted successfully!");
  });
});

function getProfile(name) {
    // Promise because chrome.storage.local.get is async
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(name, function(result) {
            if (result[name]) {
                const userProfile = new Profile(result[name]);
                resolve(userProfile);
            } else {
                reject("Profile not found.");
            }
        });
    });
}

// remove this when done, test code
const testButton = document.getElementById("test")
testButton.addEventListener("click", function () {
    console.log("Button clicked");
    // test
    getProfile("input")
    .then(function(userProfile) {
      document.getElementById("fname").value = userProfile.fname || "";
      document.getElementById("lname").value = userProfile.lname || "";
      document.getElementById("email").value = userProfile.email || "";
      document.getElementById("phone").value = userProfile.phone || "";
      document.getElementById("dob").value = userProfile.dob || "";

      console.log("Profile loaded successfully:", userProfile);
      alert("Profile loaded successfully!");
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
});