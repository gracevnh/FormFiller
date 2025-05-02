function getProfile(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (data) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(data[key] || {});
    });
  });
}

// more robust way to get inputs
function getAllInputs(root = document) {
  let inputs = getAllInputs();
  // recursively look into shadow element roots
  const customElements = root.querySelectorAll("*");
  customElements.forEach(el => {
    if (el.shadowRoot) {
      inputs = inputs.concat(getAllInputs(el.shadowRoot));
    }
  });

  return inputs.filter(input =>
    input.offsetParent !== null &&
    input.type !== "hidden" &&
    getComputedStyle(input).visibility !== "hidden" &&
    getComputedStyle(input).display !== "none"
  );
}

// format to YYYYMMDD ex. 2025-05-16 
function formatToYYYYMMDD(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yyyy, mm, dd] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

// format to MMDDYYYY ex. 05-16-2025
function formatToMMDDYYYY(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yyyy, mm, dd] = parts;
  return `${mm.padStart(2, '0')}/${dd.padStart(2, '0')}/${yyyy}`;
}

function autofillForm(key) {
  const genderKeys = new Set(["gender", "sex"]);
  const ethnicityKeys = new Set(["ethnicity", "race"]);

  getProfile(key)
    .then(function (userProfile) {
      // print user profile
      console.log("User profile loaded:", userProfile);

      // edge case 
      userProfile.studentEmail = userProfile.username;

      // even broader search for inputs
      let inputs = Array.from(document.querySelectorAll("input, select"))
        .filter(input =>
          input.offsetParent !== null &&              // visible on screen
          input.type !== "hidden" &&                 // skip hidden inputs
          getComputedStyle(input).visibility !== "hidden" &&
          getComputedStyle(input).display !== "none"
        );

      inputs.forEach(input => {
        const match = findBestKeyMatch(input, fieldSynonyms, .6);
        if (match) {
          // added in case of drop down menus
          let matchedValue = userProfile[match.key];
          let sourceSection = "";

          // emergency contact keys and mapping
          const emergencyContactMap = {
            emergencyContactFirst: "first",
            emergencyContactLast: "last",
            emergencyContactPhone: "phone",
            emergencyRelationship: "relationship"
          };

          if (match.key in emergencyContactMap) {
            matchedValue = userProfile.emergencyContact?.[emergencyContactMap[match.key]];
            sourceSection = "emergencyContact";
          } else {
            matchedValue = userProfile[match.key];
            sourceSection = "main user";
          }

          // known date field
          if (match.key.toLowerCase().includes("dob") || match.key.toLowerCase().includes("date")) {
            if (input.type === "date") {
              matchedValue = formatToYYYYMMDD(matchedValue); // for <input type="date">
            } else {
              matchedValue = formatToMMDDYYYY(matchedValue); // for <input type="text">
            }
          }

          // snap specific match key for email 
          if (match.key === "studentEmail" && input.name.includes("person[username]")) {
            input.value = matchedValue || "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }

          // grade
          if (match.key === "grade") {
            const gradeMap = {
              "k": "K",
              "1": "1st", "2": "2nd", "3": "3rd", "4": "4th", "5": "5th",
              "6": "6th", "7": "7th", "8": "8th", "9": "9th", "10": "10th",
              "11": "11th", "12": "12th"
            };
            const raw = matchedValue?.toLowerCase().replace(/[^a-z0-9]/g, "");
            matchedValue = gradeMap[raw] || matchedValue;
          }

          if (input.tagName === "SELECT") {
            const normalizedMatchedValue = matchedValue?.toLowerCase().trim();

            // better matching for drop down gender menu
            if (genderKeys.has(match.key)) {
              if (matchedValue?.toLowerCase().startsWith("m")) matchedValue = "Male";
              else if (matchedValue?.toLowerCase().startsWith("f")) matchedValue = "Female";
            }

            if (ethnicityKeys.has(match.key)) {
              matchedValue = matchedValue?.charAt(0).toUpperCase() + matchedValue?.slice(1).toLowerCase();
            }

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
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // contextual matching
          const contextual_match = findContextualMatch(input, fieldSynonyms, .5);

          // contextual matching for names 
          if (contextual_match && !["fname", "lname", "phone", "gender", "ethnicity", "email"].includes(contextual_match.key)) {
            let matchedValue;
            const emergencyContactMap = {
              emergencyContactFirst: "first",
              emergencyContactLast: "last",
              emergencyContactPhone: "phone",
              emergencyRelationship: "relationship"
            };

            if (contextual_match.key in emergencyContactMap) {
              matchedValue = userProfile.emergencyContact?.[emergencyContactMap[contextual_match.key]];
            } else {
              matchedValue = userProfile[contextual_match.key];
            }

            input.value = matchedValue || "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            // console.log(input.tagName, input.type, "No good match found (below threshold) for:", input.name || input.id);
          }
        }
      });
      console.log("autofill complete :)");
    })
    .catch(function (error) {
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

function extractBracketParts(str) {
  const matches = [...str.matchAll(/\[(.*?)\]/g)];
  return matches.map(m => m[1]); // e.g., from "person[sex]" -> ["sex"]
}

function findBestKeyMatch(formElement, fieldSynonyms, threshold = 0.6) {
  let bestMatch = null;
  let highestSimilarity = 0;
  let isEmergencyContactField = false;

  const identifiers = {
    label: getLabelText(formElement) || '',
    tags: getAllTags(formElement) || '',
    ariaLabel: formElement.getAttribute('aria-label') || '',
    placeholder: formElement.placeholder || '',
    id: formElement.id || '',
    title: formElement.title || '',
    datasetTestId: formElement.dataset?.testid || '',
    type: formElement.type || '',
    outerText: formElement.closest("label, div")?.textContent || ''
  };

  // Include each bracket part (like 'sex' from person[sex])
  if (formElement.name?.includes('[')) {
    const bracketParts = extractBracketParts(formElement.name);
    bracketParts.forEach((part, index) => {
      identifiers[`bracket_${index}`] = part;
    });

  } else if (formElement.name) {
    identifiers.name = formElement.name;
  }

  if (formElement.tagName === "SELECT") {
    delete identifiers.label;
  }

  // Normalize all
  for (const key in identifiers) {
    identifiers[key] = identifiers[key].toLowerCase().replace(/[^a-z]/g, '');
  }

  // check for emergency contact
  for (const key in identifiers) {
    if (identifiers[key].includes("emergencycontact")) {
      isEmergencyContactField = true;
      break;
    }
  }

  for (const source in identifiers) {
    const identifier = identifiers[source];
    if (!identifier || !identifier.trim()) continue;

    for (const primaryKey in fieldSynonyms) {
      const aliases = fieldSynonyms[primaryKey];
      const allTermsToMatch = [primaryKey, ...aliases];
      const matches = findBestMatch(identifier, allTermsToMatch);

      if (matches.bestMatch.rating > highestSimilarity && matches.bestMatch.rating >= threshold) {
        highestSimilarity = matches.bestMatch.rating;
        bestMatch = {
          key: primaryKey,
          score: highestSimilarity,
          source: source,
          matchedTerm: matches.bestMatch.target
        };
      }
    }
  }

  if (isEmergencyContactField && bestMatch?.key === "fname") {
    bestMatch.key = "emergencyContactFirst";
  }
  if (isEmergencyContactField && bestMatch?.key === "lname") {
    bestMatch.key = "emergencyContactLast";
  }
  if (isEmergencyContactField && bestMatch?.key === "phone") {
    bestMatch.key = "emergencyContactPhone";
  }

  return bestMatch;
}

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

function getAllTags(element) {
  let labels = [];

  // check for label[for=element.id]
  const directLabel = document.querySelector(`label[for="${element.id}"]`);
  if (directLabel) {
    labels.push(directLabel.textContent.trim());
  }

  // check if input is inside a labeled container (formcontrolname or component)
  let current = element;
  for (let i = 0; i < 5 && current.parentElement; i++) {
    const parent = current.parentElement;

    // get visible label text inside parent
    const parentLabel = parent.querySelector("label");
    if (parentLabel && parentLabel.textContent.trim().length > 0) {
      labels.push(parentLabel.textContent.trim());
    }

    //  use the parent’s own visible text
    const parentText = parent.textContent?.trim();
    if (parentText && parentText.length < 100 && !labels.includes(parentText)) {
      labels.push(parentText);
    }

    current = parent;
  }

  // add aria-label, placeholder, name
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) labels.push(ariaLabel.trim());

  const placeholder = element.placeholder;
  if (placeholder) labels.push(placeholder.trim());

  if (element.name) labels.push(element.name.trim());

  // combine all into one normalized string
  const combined = labels
    .filter(Boolean)
    .join(" ")
    .replace(/\(.*?\)/g, "")      // remove anything in parentheses
    .toLowerCase()
    .replace(/[^a-z]/g, "");      // strip all non-letters

  return combined || null;
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