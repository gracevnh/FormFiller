const fieldSynonyms = {
    fname: new Set(["firstName", "first_name", "fname", "givenName", "given_name"]),
    mname: new Set(["middleName", "middle_name", "mname", "m_initial", "midName"]),
    lname: new Set(["lastName", "last_name", "lname", "surname", "familyName", "family_name"]),
    preferredName: new Set(["preferredName", "nickname", "display_name", "alias"]),
    dob: new Set(["dob", "birthDate", "birth_date", "dateOfBirth", "date_of_birth"]),
    gender: new Set(["gender", "sex", "gender_identity"]),
    nationality: new Set(["nationality", "citizenship", "country_of_origin"]),
    
    address: new Set(["address", "street", "street_address", "residence_address"]),
    city: new Set(["city", "town", "municipality"]),
    state: new Set(["state", "province", "region"]),
    zip: new Set(["zip", "postalCode", "postal_code", "zipcode"]),
    country: new Set(["country", "nation", "country_name"]),
    
    username: new Set(["username", "user", "login", "user_id", "userid"]),
    password: new Set(["password", "pass", "pwd", "passcode", "secret"]),
    
    ccNumber: new Set(["cc-number", "credit_card_number", "card_number", "ccn"]),
    ccExpiry: new Set(["cc-expiry", "credit_card_expiry", "expiration_date", "exp_date"]),
    ccCvv: new Set(["cc-cvv", "cvv", "card_cvv", "security_code"]),
    
    notes: new Set(["notes", "comments", "remarks", "additional_info"])
};

export default fieldSynonyms;