import { Util } from "../config/Util"
import APIManager from "./APIManager"
import SQLiteManager from "../database/SQLiteManager"
import xml2js from 'react-native-xml2js'

export default class UCEquipConditionManager {

    static async getJobsiteDetail(inspectionId) {

        let result = null

        await SQLiteManager.selectJobsiteRecord(inspectionId)    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                let jobsiteObj = response._array[0]
                result = jobsiteObj
            }          
        })

        return result
    }

    static async saveJobsiteDetail(inspectionId, crsfAuto, jobsite, valueObj) {

        let result = null

        /////////////////
        // Check exist
        let jobsiteId = 0
        await SQLiteManager.selectJobsiteRecord(inspectionId)    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                let jobsiteObj = response._array[0]
                jobsiteId = jobsiteObj.id
            }          
        })
    
        if (jobsiteId <= 0) {
            
            ////////////////////////
            // Not exist, insert
            await SQLiteManager.insertJobsiteDetail(inspectionId, crsfAuto, jobsite, valueObj)
            .then(
                (response) => {
                    console.log('Inserted!')
                    console.log(response)
                    result = true
                }
            )
            .catch(
                (reject) => {
                    console.log(reject)
                    result = false
                }
            )

        } else {
            
            //////////////////////
            // Exist, update
            await SQLiteManager.updateJobsiteDetail(jobsiteId, valueObj)
            .then(
                (response) => {
                    console.log('Updated!')
                    console.log(response)
                    result = true
                }
            )
            .catch(
                (reject) => {
                    console.log(reject)
                    result = false
                }
            )

        }
        
        return result
    }
}