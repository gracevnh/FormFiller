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

function autofillForm(key) {
    console.log("autofill start");
    console.log("profile:", key);

    getProfile(key)
    .then(function(userProfile) {
        let keys = Object.keys(userProfile);
        let values = Object.values(userProfile);
        let usedFields = new Set();
        
        // fill in input text fields, swap out textarea for other input types
        let textInputs = document.querySelectorAll("input:not([type='hidden']), textarea");
        textInputs.forEach(input => {
            const inputName = input.name.replace(/[^a-zA-Z]/g, '');
            const bestMatch = getFieldMatch(inputName);

            if (usedFields.has(bestMatch) || bestMatch == null) return;

            usedFields.add(bestMatch);
            console.log(input.name, ": ", bestMatch);
            console.log(input.name, ": ", userProfile[bestMatch]);
            input.value = userProfile[bestMatch];
        });

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
        autofillForm(request.profileKey);
        sendResponse({ success: true }); // send back success response
    }
});

function getFieldMatch(inputName) {
  const fieldNames = Object.keys(fieldSynonyms);
  let bestMatch = null;
  let highestRating = 0;

  // Iterate through fieldSynonyms to find the best match
  fieldNames.forEach(field => {
      // Get all possible field aliases for this field
      const aliases = fieldSynonyms[field];

      // Compare the input name with each alias using stringSimilarity
      aliases.forEach(alias => {
          const matchRating = compareTwoStrings(inputName.toLowerCase(), alias.toLowerCase());
          // console.log(alias, "score: ", matchRating);
          // If the current match is better, update the bestMatch and highestRating
          if (matchRating > highestRating) {
              bestMatch = field;
              highestRating = matchRating;
          }
      });
  });

  if (highestRating < .6) {
    bestMatch = null;
  }

  return bestMatch;
}