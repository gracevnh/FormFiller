const fieldSynonyms = {
  fname: [
    "firstname", "givenname", "forename", "namefirst", "firstnm", "namegiven", "initialname", "student first name"
  ],
  mname: [
    "middlename", "middleinitial", "middle", "initial", "mi", "mname", "midnm", "mid", "secondname", "secondinitial"
  ],
  lname: [
    "lastname", "surname", "familyname", "namelast", "secondname", "surnamefamily", "familialname", "person[last_name]", "student last name"
  ],
  preferredName: [
    "preferredname", "preferredfirst", "preferredfirstname", "nickname", "chosenname", "pseudonym", "callsign", "displayname", "usualname", "namepreferred", "informalname", "familiarname"
  ],
  dob: [
    "dateofbirth", "birthdate", "dob", "birthday", "birth", "dateborn", "whenborn", "yob", "birthyear", "birthmonthday"
  ],
  gender: [
    "gender", "sex", "malefemale", "gendertype", "genderidentity", "biologicalsex", "assignedsex", "yourgender", "genderoption", "participant gender", "user gender", "gender identity", "biological sex", "person[sex]"
  ],
  nationality: [
    "nationality", "citizenship", "nation", "countryofcitizenship", "nationalorigin", "placeofbirthcountry", "yournationality", "nationalstatus", "countryname"
  ],
  email: [
    "email", "emailaddress", "e-mail", "mail", "youremail", "useremail", "contactemail", "parentemail"
  ],
  studentEmail: [
    "studentemail", "participantemail", "emailstudent", "person[username]", "student email"
  ],
  phone: [
    "phone", "phonenumber", "telephone", "tel", "contactnumber", "mobilenumber", "cellphone", "homephone", "workphone", "numberphone"
  ],
  address: [
    "address", "streetaddress", "mailingaddress", "addressline1", "address1", "addr", "residentialaddress", "permanentaddress", "homeaddress", "postaladdress"
  ],
  city: [
    "city", "town", "municipality", "urbanarea", "cityname", "place", "locationcity", "residentcity", "yourcity", "namecity"
  ],
  state: [
    "state", "province", "region", "statename", "usstate", "stateprovince", "administrativearea", "locationstate", "yourstate", "stateabbreviation"
  ],
  zip: [
    "zip", "zipcode", "postalcode", "zip code", "postal code", "zippostalcode", "areacode", "postalzip", "zipnumber"
  ],
  country: [
    "country", "countryname", "nationalitycountry", "countryofresidence", "placeofbirthcountry", "yourcountry", "nation", "countrycode", "countryofcitizenship", "selectcountry"
  ],
  username: [
    "username", "userid", "login", "accountname", "screenname", "userlogin", "nameuser", "yourusername", "logonid", "memberid"
  ],
  password: [
    "password", "pwd", "pass", "passwordfield", "yourpassword", "loginpassword", "accountpassword", "enterpassword", "userpassword", "securitycode", "password", "pass", "login password", "account password", "user password"
  ],
  grade: [
    "grade", "gradelevel", "yearinschool", "classyear", "schoolgrade", "studentgrade", "educationlevel", "currentgrade", "level", "academicyear"
  ],
  graduation: [
    "graduation", "graduationyear", "gradyear", "expectedgraduation", "hsgradyear", "hsgraduationyear", "completionyear", "expectedgrad", "grad_date"
  ],
  studentID: [
    "studentid", "id", "studentnumber", "schoolid", "sid", "pupilid", "learnerid", "idnumber", "student_id", "school_id"
  ],
  ethnicity: [
    "ethnicity", "race", "ethnicgroup", "raceethnicity", "ethnicbackground", "culturalbackground", "demographicethnicity", "ethnicorigin", "ethnicidentity", "ethnicityrace", "ethnic", "background", "person[ethnicity]"
  ],
  insuranceCompany: [
    "insurancecompany", "medicalinsurance", "healthinsurance", "insuranceprovider", "insurer", "insurance", "insurance_name", "medicalinsurer", "provider"
  ],
  insuranceNumber: [
    "insurancenumber", "insuranceid", "policyid", "accountnumber", "healthid", "insuranceaccount", "medicalid", "policy_number", "insurancepolicy", "insuranceaccountnumber"
  ],
  physicianName: [
    "physician", "doctorname", "physicianname", "primarycare", "pcp", "familydoctor", "providername", "medicalprovider"
  ],
  physicianPhone: [
    "physicianphone", "doctorphone", "providerphone", "medicalphone", "physiciancontact", "doctor_contact", "contact_physician"
  ],
  medicalInfo: [
    "medicalinfo", "medicalinformation", "healthinfo", "medications", "healthconditions", "emergencyinfo", "medicalhistory", "healthnotes"
  ],
  emergencyContactFirst: [
    "emergencyfirstname", "emergencycontactfirst", "contactfirst", "econtactfname", "emergency_first_name", "emergencyfname"
  ],  
  emergencyContactLast: [
    "emergencylastname", "emergencycontactlast", "contactlast", "econtactlname", "emergency_last_name", "emergencylname"
  ],  
  emergencyContactPhone: [
    "emergencyphone", "emergencycontactphone", "ecphone", "contactphone", "backupcontactphone"
  ],
  emergencyRelationship: [
    "relationship", "emergencyrelationship", "relationtoparticipant", "contactrelation", "ecrelationship", "relationshiptype"
  ],

  notes: [
    "notes",
    "comments",
    "remarks",
    "additional_info",
    "additional_notes",
    "sidenotes",
    "additional_comments",
  ],
};
