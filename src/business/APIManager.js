import { Util } from "../config/Util";
import axios from "axios";

export default class APIManager {
        
    constructor() {

    }

    ///////////
    // LOGIN //
    ///////////
    static async AuthenticateUser(username, password) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_login
                + "?username=" + username
                + "&password=" + password;
            let returnVal = await axios.get(apiUrl);
            return returnVal.data;
        } catch (error) {
            return false;
        }
    }

    static async GetWSREEnableSetting() {
        // try {
        //     const apiUrl = Util.Functions.getServiceUrl()
        //         + Util.ConstantHelper.api_GetWSREEnableSetting;
        //     let result = await axios.get(apiUrl);
        //     return result.data;
        // } catch (error) {
        //     return false;
        // }
        return false
    }

    static async GetUserPreference(userId) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetUserPreference
                + "?userId=" + userId
            console.log(apiUrl)
            let result = await axios.get(apiUrl)
            return result.data;
        } catch (error) {
            return false;
        }
    }

    ////////////
    // UCMain //
    ////////////
    static async GetCustomerList(userId) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetCustomerList
                + '?userName=' + userId
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetJobsiteList(customerId, userId) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetJobsiteList
                + '?customerAuto=' + customerId
                + '&userName=' + userId
                console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetModelList(jobsiteId) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetModelsByJobsite
                + '?jobsiteAuto=' + jobsiteId
                console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetEquipmentList(jobsiteId, modelId) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_apiGetEquipmentByJobsiteAndModel
                + '?jobsiteAuto=' + jobsiteId
                + '&modelAuto=' + modelId
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    //////////////////////////////
    // DOWNLOAD EQUIPMENT DATA
    static async GetXMLEquipmentData(equipmentList) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetSelectedEquipment
                + '?equipmentList=' + equipmentList
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetSelectedComponents(equipmentList) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetSelectedComponents
                + '?equipmentList=' + equipmentList
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetTestPointImages(equipmentList) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetTestPointImages
                + '?equipmentList=' + equipmentList
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetUCLimits(equipmentList) {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetUCLimits
                + '?equipmentList=' + equipmentList
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async GetDealershipLimits() {
        try {
            const apiUrl = Util.Functions.getServiceUrl()
                + Util.ConstantHelper.api_GetDealershipLimits
            console.log(apiUrl)
            let result = await axios.get(apiUrl);
            return result.data;
        } catch (error) {
            return false;
        }
    }

    static async UploadPhoto(syncObj) {
        try {
            let jsonData = JSON.stringify(syncObj);
            let apiUrl = Util.Functions.getServiceUrl() + Util.ConstantHelper.api_upload_image;

            console.log(apiUrl);
            //http://itk-11.infotrak.local/undercarriagemobileservice/InfoTrakMobileService/MobileService.svc/PostWSREImage
            
            ////////////////////
            // Axios with POST
            // let headers = {
            //     Accept: 'application/json',
            //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            // };

            // let returnVal = await axios.post(
            //     apiUrl,     // url
            //     jsonData,   // data
            //     headers
            // );
            // return returnVal;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: jsonData
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
            return false;
        }

        //////////////
        // fetch
        // fetch(apiUrl, {
        //     method: 'POST',
        //     headers: { 
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json' 
        //     },
        //     body: jsonData
        // })
        // .then((response) => JSON.stringify(response.json())) 
        // .then((responseData) => { console.log("response: " + responseData); })
        // .catch((err) => { console.log(err); });
    }
}