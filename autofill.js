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

    getProfile(key)
    .then(function(userProfile) {
        let keys = Object.keys(userProfile);
        let values = Object.values(userProfile);
        
        // fill in input text fields, swap out textarea for other input types
        let textInputs = document.querySelectorAll("input:not([type='hidden']), textarea");
        textInputs.forEach(input => {
            const match = findBestKeyMatch(input, fieldSynonyms, .6);
            if (match) {
              input.value = userProfile[match.key];
            } else {
              console.log(input.tagName, input.type, "No good match found (below threshold) for:", input.name || input.id);
            }

            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
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

function findBestKeyMatch(formElement, fieldSynonyms, threshold = 0.6) { 
  let bestMatch = null;
  let highestSimilarity = 0;

  const identifiers = {
    'label': getLabelText(formElement)?.toLowerCase().replace(/[^a-z]/g, '') || '',
    'ariaLabel': formElement.getAttribute('aria-label')?.toLowerCase().replace(/[^a-z]/g, '') || '',
    'name': formElement.name?.toLowerCase().replace(/[^a-z]/g, '') || '',
    'id': formElement.id?.toLowerCase().replace(/[^a-z]/g, '') || '',
    'placeholder': formElement.placeholder?.toLowerCase().replace(/[^a-z]/g, '') || '',
    'title': formElement.title?.toLowerCase().replace(/[^a-z]/g, '') || ''
  };

  for (const source in identifiers) {
    const identifier = identifiers[source]; 
    if (identifier && identifier.trim()) {
      for (const primaryKey in fieldSynonyms) {
        const aliases = fieldSynonyms[primaryKey];
        const allTermsToMatch = [primaryKey, ...aliases];
        const matches = findBestMatch(identifier, allTermsToMatch);

        if (matches.bestMatch.rating > highestSimilarity && matches.bestMatch.rating >= threshold) { 
          highestSimilarity = matches.bestMatch.rating;
          bestMatch = { key: primaryKey, score: highestSimilarity, source: source, matchedTerm: matches.bestMatch.target };
        }
      }
    }
  }

  return bestMatch;
}

function getLabelText(element) {
  const label = document.querySelector(`label[for="${element.id}"]`);
  return label ? label.textContent.trim() : null;
}