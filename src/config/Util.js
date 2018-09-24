let ConstantHelper = {

    "productFlavors": 'internaltest',    // dev, internaltest, staging, production, itmstaging, itmproduction
    "isTest":false,

    /////////////////////////////////////
    // APIs
    // "service_url":getServiceUrl(),
    "api_login":"AuthenticateUser",                     // ?username=tomv&password=123456
    "api_GetWSREEnableSetting":"GetWSREEnableSetting",
    "api_GetUserPreference":"GetUserPreference",
    "api_GetCustomerList":"GetCustomerList",            // ?userName=tomv
    "api_GetJobsiteList":"GetJobsitesByCustomer",       // ?customerAuto=192&userName=tomv
    "api_GetModelsByJobsite":"GetModelsByJobsite",      // ?jobsiteAuto
    "api_apiGetEquipmentByJobsiteAndModel":"GetEquipmentByJobsiteAndModel",  // ?jobsiteAuto=&modelAuto=    
    "api_GetSelectedEquipment":"GetSelectedEquipment",
    "api_GetSelectedComponents":"GetSelectedComponents",
    "api_GetTestPointImages":"GetTestPointImages",
    "api_GetUCLimits":"GetUCLimits",
    "api_GetDealershipLimits":"GetDealershipLimits",
    "api_SaveEquipmentsInspectionsData":"Save_iOS_EquipmentsInspectionsData",    // sync    
    "api_upload_image":"PostWSREImage", //

    "FIREBASE_API_KEY":"AIzaSyDrjyAr7CXpDf1lpu4OFoi0ZotWaN6ARrE",
    "FIREBASE_AUTH_DOMAIN":"undercarriage-9b1fc.firebaseapp.com",
    "FIREBASE_DATABASE_URL":"https://undercarriage-9b1fc.firebaseio.com",
    "FIREBASE_PROJECT_ID":"undercarriage-9b1fc",
    "FIREBASE_STORAGE_BUCKET":"undercarriage-9b1fc.appspot.com",
    "FIREBASE_MESSAGING_SENDER_ID":"950344303260",

    /////////////////////////////////////
    // DB
    "db_name":"tracktreads.db",

    /////////////////////////////////////
    // File folder
    "photo_save_folder":"tracktreads",

    //////////////////////
    // Messages
    "TOOL_UNAVAILABLE":"Tool un-available for component - no limits are set",

    ////////////////
    // SWIPE
    "SWIPE_CONFIG":{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    }
}

const Functions = {

    validateString(text) {
        if (text === undefined || text === null || text === '')
            return false

        return true
    },

    validateNumber(number) {
        if (number === undefined || number === null || number === '')
            return false

        return true
    },

    validateObj(obj) {
        if (obj === undefined || obj === null)
            return false

        return true
    },

    getServiceUrl() {
        let SERVICE_URL = ''
        if (ConstantHelper.productFlavors == 'dev')
            SERVICE_URL = 'http://itk-11.infotrak.local/undercarriagemobileservice/InfoTrakMobileService/MobileService.svc/'
        else if (ConstantHelper.productFlavors == 'internaltest')
            SERVICE_URL = 'http://ucservice-devtest.tracktreads.com/MobileService.svc/'
        else if (ConstantHelper.productFlavors == 'staging')
            SERVICE_URL = 'http://ucservice-test.tracktreads.com/MobileService.svc/'
        else if (ConstantHelper.productFlavors == 'production')
            SERVICE_URL = 'http://ucservice.tracktreads.com/MobileService.svc/'
        else if (ConstantHelper.productFlavors == 'itmstaging')
            SERVICE_URL = 'http://uctest.trackadvice.com/MobileService.svc/'
        else if (ConstantHelper.productFlavors == 'itmproduction')
            SERVICE_URL = 'http://uc.trackadvice.com/MobileService.svc/'
        console.log(ConstantHelper.productFlavors)
        console.log(SERVICE_URL)
        return SERVICE_URL
    },

    getCurrentTimeStamp() {

        let currentdate = new Date()
        let dd = currentdate.getDate()
        let mm = currentdate.getMonth() + 1 //January is 0!
        let yyyy = currentdate.getFullYear()

        if(dd < 10){
            dd='0'+dd;
        } 
        if(mm < 10){
            mm='0'+mm;
        }

        return yyyy + mm + dd + '_' + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds()
    },

    getCurrentDateTime() {
        let currentdate = new Date(); 
        let datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        return datetime;
    },

    getSyncDateTime() {
        let currentdate = new Date()
        let dd = currentdate.getDate()
        let mm = currentdate.getMonth() + 1 //January is 0!
        let yyyy = currentdate.getFullYear()
        if(dd < 10){
            dd='0'+dd;
        } 
        if(mm < 10){
            mm='0'+mm;
        }
        return dd + ' ' + mm + ' ' + yyyy
    },

    getFileNameFromPath(fullPath) { // file://xxxxx/yyy.db
        return fullPath.replace(/^.*[\\\/]/, '')
    },

    promisesXML2js(string) {
        let xml2jsParser = require('react-native-xml2js').parseString
        return new Promise(function(resolve, reject)
        {
            xml2jsParser(string, function(err, result) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            })
        })
    },

    async asyncXML2js(string) {
        let xml2jsParser = require('react-native-xml2js').parseString
        try {
            return await xml2jsParser(string)
        } catch (err) {
            return err
        }
    },
}

export const Util = {
    ConstantHelper,
    Functions
};

export default Util;