import { Util } from "../config/Util"
import APIManager from "./APIManager"
import SQLiteManager from "../database/SQLiteManager"
import xml2js from 'react-native-xml2js'

export default class UCEquipDetailsManager {

    static async saveEquipmentDetail(inspectionId, smu, forwardHrs, reverseHrs, image) {
        let result = null
        await SQLiteManager.updateInspectionDetail(
            inspectionId, smu, forwardHrs, reverseHrs, image)
        .then(
            (response) => {
                console.log(response)
            }
        )
        
        return result
    }


}