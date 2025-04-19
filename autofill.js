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

function formatDateToMMDDYYYY(dateStr) {
  if (!dateStr) return "";

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [yyyy, mm, dd] = parts;
  return `${mm.padStart(2, '0')}/${dd.padStart(2, '0')}/${yyyy}`;
}

function autofillForm(key) {

    getProfile(key)
    .then(function(userProfile) {
      // even broader search for inputs
      let inputs = Array.from(document.querySelectorAll("input, select"))
        .filter(input =>
          input.offsetParent !== null &&              // visible on screen
          input.type !== "hidden" &&                 // skip hidden inputs
          getComputedStyle(input).visibility !== "hidden" &&
          getComputedStyle(input).display !== "none"
        );

      // let inputs = document.querySelectorAll(
      //   // "input[type='text']:not([type='hidden']), " +
      //   // "input[type='password']:not([style*='display: none']):not([style*='visibility: hidden']), " +
      //   // "select:not([style*='display: none']):not([style*='visibility: hidden']), " +
      //   // "input[type='date']:not([style*='display: none']):not([style*='visibility: hidden'])"
      //   // broader search
      //     "input:not([type='hidden']):not([style*='display: none']):not([style*='visibility: hidden']), " +
      //     "select:not([style*='display: none']):not([style*='visibility: hidden'])"
      // );
        inputs.forEach(input => {
          // const prevSibling = input.previousElementSibling;
          // if (prevSibling) {
          //   // console.log(input.previousElementSibling.textContent.trim());
          // }
          const match = findBestKeyMatch(input, fieldSynonyms, .6);
          if (match) {
            // input.value = userProfile[match.key];

            // added in case of drop down menus
            let matchedValue = userProfile[match.key];

            // known date field
            if (match.key.toLowerCase().includes("dob") || match.key.toLowerCase().includes("date")) {
              matchedValue = formatDateToMMDDYYYY(matchedValue);
            }

            if (input.tagName === "SELECT") {
              console.log("sensed a select")
              const normalizedMatchedValue = matchedValue?.toLowerCase().trim();

              let matchedOption = Array.from(input.options).find(option => 
                option.value.toLowerCase() === normalizedMatchedValue ||
                option.text.toLowerCase() === normalizedMatchedValue
              );

              if (matchedOption) {
                input.value = matchedOption.value;
                input.dispatchEvent(new Event("change", { bubbles: true }));
              } else {
                console.warn("Dropdown match not found for:", matchedValue);
              }
            } else {
              input.value = matchedValue || "";
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }

            // end of added 

            console.log("Matched: ", input.name, "with ", match.key, " ", match.score);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            // contextual matching
            const contextual_match = findContextualMatch(input, fieldSynonyms, .5);
            if (contextual_match) {
              input.value = userProfile[contextual_match.key];
              console.log("Matched: ", input.name, "with ", contextual_match.key, " ", contextual_match.score);
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            } else {
              console.log(input.tagName, input.type, "No good match found (below threshold) for:", input.name || input.id);
            }
          }
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
  
  // const identifiers = {
  //   'label': getLabelText(formElement)?.toLowerCase().replace(/[^a-z]/g, '') || '',
  //   'ariaLabel': formElement.getAttribute('aria-label')?.toLowerCase().replace(/[^a-z]/g, '') || '',
  //   'placeholder': formElement.placeholder?.toLowerCase().replace(/[^a-z]/g, '') || '',
  //   'id': formElement.id?.toLowerCase().replace(/[^a-z]/g, '') || '',
  //   'name': formElement.name?.toLowerCase().replace(/[^a-z]/g, '') || '',
  //   'title': formElement.title?.toLowerCase().replace(/[^a-z]/g, '') || ''
  // };

  const identifiers = {
    label: getLabelText(formElement) || '',
    ariaLabel: formElement.getAttribute('aria-label') || '',
    placeholder: formElement.placeholder || '',
    id: formElement.id || '',
    name: formElement.name || '',
    title: formElement.title || '',
    datasetTestId: formElement.dataset?.testid || '',
    type: formElement.type || '',
    outerText: formElement.closest("label, div")?.textContent || ''
  };
  
  for (const key in identifiers) {
    identifiers[key] = identifiers[key].toLowerCase().replace(/[^a-z]/g, '');
  }
  

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

// function getLabelText(element) {
//   const label = document.querySelector(`label[for="${element.id}"]`);
//   if (label) {
//     // console.log("LABEL CONTENT", label.textContent);
//     // return label.textContent.trim();
//     // cleaning too much, use below code
//     let clean = label.textContent.replace(/\(.*?\)/g, "").trim().toLowerCase();
//     return clean;
//   } else {
//     return null;
//   }
// }
// function getLabelText(element) {
//   let label =
//     document.querySelector(`label[for="${element.id}"]`) ||
//     element.closest("div")?.querySelector("label");

//   if (label) {
//     return label.textContent.replace(/\(.*?\)/g, "").trim().toLowerCase();
//   }
//   return null;
// }
// more robust getlabeltext
function getLabelText(element) {
  // label with "for"
  let label = document.querySelector(`label[for="${element.id}"]`);
  if (label) {
    return label.textContent.replace(/\(.*?\)/g, "").trim().toLowerCase();
  }

  // closest parent with a label
  let current = element;
  for (let i = 0; i < 4 && current.parentElement; i++) {
    const maybeLabel = current.parentElement.querySelector("label");
    if (maybeLabel) {
      return maybeLabel.textContent.replace(/\(.*?\)/g, "").trim().toLowerCase();
    }
    current = current.parentElement;
  }

  // aria-label or placeholder directly
  return (
    element.getAttribute("aria-label")?.trim().toLowerCase() ||
    element.placeholder?.trim().toLowerCase() ||
    element.name?.trim().toLowerCase() ||
    null
  );
}



function findContextualMatch(formElement, fieldSynonyms, threshold = 0.6) {
  let bestMatch = null;
  let highestSimilarity = 0;

  function cleanAndMatch(text, keys, source) {
    if (!text) return null;
    const cleanedText = text.toLowerCase().replace(/[^a-z]/g, '') || '';
    if (!cleanedText) return null;

    const matches = findBestMatch(cleanedText, Object.keys(keys));
    if (matches.bestMatch.rating >= threshold) {
      return {
        key: matches.bestMatch.target,
        score: matches.bestMatch.rating,
        source: source,
        matchedTerm: matches.bestMatch.target
      };
    }
    return null;
  }

  // check previous sibling
  // sometimes it takes in a div, so filter so you only get label texts
  if (formElement.previousElementSibling) {
    const prevSiblingText = formElement.previousElementSibling.textContent.trim();
    const match = cleanAndMatch(prevSiblingText, fieldSynonyms, "previousSibling");
    // console.log(formElement.name);
    // console.log(prevSiblingText);
    if (match) {
      bestMatch = match;
      highestSimilarity = match.score;
    }
  }

  // check parent (this might not be accurate)
    const parentText = formElement.parentNode
    ? Array.from(formElement.parentNode.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent.trim())
          .join(" ")
    : "";

  if (parentText) {
      const match = cleanAndMatch(parentText, fieldSynonyms, "parentNode");
        if (match && match.score > highestSimilarity) {
            bestMatch = match;
        }
  }

  return bestMatch;
}