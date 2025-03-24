const fieldSynonyms = {
    fname: ["firstName", "first_name", "fname", "givenName", "given_name"],
    mname: ["middleName", "middle_name", "mname", "m_initial", "midName"],
    lname: ["lastName", "last_name", "lname", "surname", "familyName", "family_name"],
    preferredName: ["preferredName", "nickname", "display_name", "alias"],
    dob: ["dob", "birthDate", "birth_date", "dateOfBirth", "date_of_birth"],
    gender: ["gender", "sex", "gender_identity"],
    nationality: ["nationality", "citizenship", "country_of_origin"],
    email: ["email", "emailaddress", "useremail", "emailid"],
    phone: ["homephone", "phone", "phonenumber", "contactnumber", "mobile", "cell"],
    
    address: ["address", "street", "street_address", "residence_address"],
    city: ["city", "town", "municipality"],
    state: ["state", "province", "region"],
    zip: ["zip", "postalCode", "postal_code", "zipcode"],
    country: ["country", "nation", "country_name"],
    
    username: ["username", "user", "login", "user_id", "userid"],
    password: ["password", "pass", "pwd", "passcode", "secret"],
    
    ccNumber: ["cc-number", "credit_card_number", "card_number", "ccn"],
    ccExpiry: ["cc-expiry", "credit_card_expiry", "expiration_date", "exp_date"],
    ccCvv: ["cc-cvv", "cvv", "card_cvv", "security_code"],
    
    notes: ["notes", "comments", "remarks", "additional_info"]
};