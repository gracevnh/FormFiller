const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const saveButton = document.getElementById("save-data");

saveButton.addEventListener("click", function() {
    const data = {};
    if (fname.value.trim()) {
        data.fname = fname.value;
    }
    if (lname.value.trim()) {
        data.lname = lname.value;
    }
    if (email.value.trim()) {
        data.email = email.value;
    }
    if (phone.value.trim()) {
        data.phone = phone.value;
    }
    if (dob.value.trim()) {
        data.dob = dob.value;
    }
    chrome.storage.local.set({ 'input': data }, function() {
        console.log("Data saved!");
        console.log(data);
    });
});