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

  chrome.storage.local.set({ input: data }, function () {
    console.log("Data saved!", data);
    alert("Form submitted successfully!");
  });
});
