const fieldSynonyms = {
  fname: [
    "firstname", "givenname", "first", "fname", "forename", "namefirst", "personalname", "firstnm", "namegiven", "initialname"
  ],
  mname: [
    "middlename", "middleinitial", "middle", "initial", "mi", "mname", "midnm", "mid", "secondname", "secondinitial"
  ],
  lname: [
    "lastname", "surname", "familyname", "last", "lname", "namelast", "secondname", "surnamefamily", "familialname"
  ],
  preferredName: [
    "preferredname", "nickname", "chosenname", "pseudonym", "callsign", "displayname", "usualname", "namepreferred", "informalname", "familiarname"
  ],
  dob: [
    "dateofbirth", "birthdate", "dob", "birthday", "birth", "dateborn", "whenborn", "yob", "birthyear", "birthmonthday"
  ],
  gender: [
    "gender", "sex", "identity", "malefemale", "gendertype", "genderidentity", "biologicalsex", "assignedsex", "yourgender", "genderoption"
  ],
  nationality: [
    "nationality", "country", "citizenship", "nation", "countryofcitizenship", "nationalorigin", "placeofbirthcountry", "yournationality", "nationalstatus", "countryname"
  ],
  email: [
    "email", "emailaddress", "e-mail", "eaddress", "mail", "youremail", "emailid", "electronicmail", "internetemail", "emailaddr"
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
// remove?
  username: [
    "username", "userid", "login", "accountname", "screenname", "userlogin", "nameuser", "yourusername", "logonid", "memberid"
  ],
  password: [
    "password", "pwd", "pass", "passwordfield", "yourpassword", "loginpassword", "accountpassword", "enterpassword", "userpassword", "securitycode"
  ],

  ccNumber: [
    "ccnumber", "creditcardnumber", "cardnumber", "creditcardno", "ccno", "paymentcardnumber", "creditcard#", "cardno", "numbercreditcard", "creditcardaccountnumber"
  ],
  ccExpiry: [
    "ccexpiry", "creditcardexpiry", "cardexpiry", "expirydate", "expirationdate", "ccexpiration", "validuntil", "expiredate", "ccvaliduntil", "cardexpirationdate"
  ],
  ccCvv: [
    "cccvv", "cvv", "securitycode", "cardverificationvalue", "cvn", "cardsecuritycode", "ccsecuritycode", "cvvcode", "securitynumber", "cardcode"
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
