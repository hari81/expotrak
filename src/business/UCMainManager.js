import { Util } from "../config/Util"
import APIManager from "./APIManager"
import SQLiteManager from "../database/SQLiteManager"
import xml2js from 'react-native-xml2js'

export default class UCMainManager {

    static async getEquipmentById(EquipmentAuto) {
        let result = null
        await SQLiteManager.selectEquipmentRecordById(EquipmentAuto)    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                result = response._array[0]
            }          
        });

        return result
    }

    static async getUnsyncedEquipments() {
        let result = null
        await SQLiteManager.selectUnsyncedEquipments()    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                result = response._array
            }
        })
        return result
    }

    static async saveEquipmentRecord(equipmentArray) {

        for (let i=0; i<equipmentArray.length; i++) {
            
            let equipmentObj = equipmentArray[i]

            // Check exist
            await this.getEquipmentById(equipmentObj.EquipmentId)
                .then((response) => {
                    if (response == null) 
                        
                        // Not exist, insert
                        SQLiteManager.insertEquipmentRecord(equipmentObj)
                    })
        }

        return true
    }

    static getEquipmentList(equipmentArray) {
        let result = ''
        for (let i=0; i<equipmentArray.length; i++) {

            let equipment = equipmentArray[i]
            if (!equipment.selected) continue;

            result = result + equipment.EquipmentId + ','
        }

        return result
    }

    static async saveXMLEquipmentData(insertEquipments) {

        let equipmentAutoList = this.getEquipmentList(insertEquipments)
        await APIManager.GetXMLEquipmentData(equipmentAutoList).then( async (response) => {
            console.log('GetXMLEquipmentData')
            if (response != false)
            {
                var parseString = require('react-native-xml2js').parseString;
                await parseString (response, async (err, result) => {

                    // GET
                    let arrEquipment = result.GetSelectedEquipmentResponse.GetSelectedEquipmentResult[0]['a:EquipmentEntity']
                    
                    // SAVE
                    await this.saveXMLEquipmentRecord(arrEquipment)
                    .then((response) => {

                        // Saved!

                    })
                })
            } else {
                console.log(response)
            }
        })
    }

    static async saveXMLEquipmentRecord(equipmentArray) {

        for (let i=0; i<equipmentArray.length; i++) {
            
            let equipmentObj = equipmentArray[i]

            // Check exist
            await this.getEquipmentById(equipmentObj['a:EquipmentId'][0])
            .then((response) => {
                if (response == null) 
                    
                    // Not exist, insert
                    SQLiteManager.insertXMLEquipmentRecord(equipmentObj)
                })
        }

        return true
    }

    static async DownloadComponents(equipmentAutoList) {

        await APIManager.GetSelectedComponents(equipmentAutoList).then( async (response) => {            
            console.log('GetSelectedComponents')
            
            await Util.Functions.promisesXML2js(response)
            .then(
                async (componentResponse) => {
                    let componentArray = componentResponse.GetSelectedComponentsResponse.GetSelectedComponentsResult[0]['a:ComponentEntity']
                    if (componentArray !== undefined)
                        await this.saveXMLComponentRecord(componentArray)
                }
            )
            .catch()
        })
    }

    static async saveXMLComponentRecord(componentArray) {

        for (let i=0; i<componentArray.length; i++) {            
            
            let componentObj = componentArray[i]
            let equipmentAuto = componentObj['a:EquipmentId'][0]
            let inspectionId = 0

            await SQLiteManager.selectEquipmentRecordById(equipmentAuto)    
            .then((response) => {
                if (response != null && response._array.length > 0)
                {
                    let equipmentObj = response._array[0]
                    inspectionId = equipmentObj.id
                }          
            })

            if (inspectionId > 0) {
                console.log('Inspection ID: ' + inspectionId)
                await SQLiteManager.insertXMLComponentRecord(inspectionId, componentObj)
            }
        }

        return true
    }

    static async DownloadTestpointImages(equipmentAutoList) {

        console.log(equipmentAutoList)
        let arrEquipments = equipmentAutoList.split(',')
        for (let i=0; i<arrEquipments.length; i++) {
            
            let equipmentAuto = arrEquipments[i]
            if (equipmentAuto === undefined) continue

            let inspectionId = 0
            await SQLiteManager.selectEquipmentRecordById(equipmentAuto)    
            .then((response) => {
                if (response != null && response._array.length > 0)
                {
                    let equipmentObj = response._array[0]
                    inspectionId = equipmentObj.id
                }          
            })

            if (inspectionId <= 0) continue
            await APIManager.GetTestPointImages(equipmentAuto).then((response) => {                    
                Util.Functions.promisesXML2js(response)
                .then(
                    (jsonResponse) => {
                        let testpointArray = 
                            jsonResponse.GetTestPointImagesResponse.GetTestPointImagesResult[0]['a:TestPointImageEntity']
                        if (testpointArray !== undefined)
                            this.saveXMLTestPointImgRecord(inspectionId, testpointArray)
                    }
                )
                .catch()
            })
        }


    }

    static async saveXMLTestPointImgRecord(inspectionId, testpointArray) {

        for (let i=0; i<testpointArray.length; i++) {            
            
            console.log('Inspection ID: ' + inspectionId)
            let obj = testpointArray[i]
            await SQLiteManager.insertXMLTestPointImgRecord(inspectionId, obj)
        }

        return true
    }

    static async DownloadUCLimits(equipmentAutoList) {

        await APIManager.GetUCLimits(equipmentAutoList).then(async (response) => {            
            
            console.log('GetUCLimits')
            let limitsArray = response.GetUCLimitsResult
            for (let i = 0; i < limitsArray.length; i++) {
                
                let limitObj = limitsArray[i]
                if (limitObj.Method.toLowerCase().trim() === 'cat') {
                    await SQLiteManager.insertCATLimitRecord(limitObj)
                } else if (limitObj.Method.toLowerCase().trim() === 'itm') {
                    await SQLiteManager.insertITMLimitRecord(limitObj)
                } else if (limitObj.Method.toLowerCase().trim() === 'komatsu') {
                    await SQLiteManager.insertKomatsuLimitRecord(limitObj)
                } else if (limitObj.Method.toLowerCase().trim() === 'hitachi') {
                    await SQLiteManager.insertHitachiLimitRecord(limitObj)
                } else if (limitObj.Method.toLowerCase().trim() === 'liebherr') {
                    await SQLiteManager.insertLiebherrLimitRecord(limitObj)
                }
            }
        })
    }

    ////////////////////////
    // Download and Save
    static async downloadAndSaveData(equipmentAutoList) {

        // Download Equipment
        await APIManager.GetXMLEquipmentData(equipmentAutoList)
        .then( async (response) => {

            if (response != false) {

                console.log('Downloaded Equipments!')
                
                await Util.Functions.promisesXML2js(response)
                .then(
                    async (jsonResponse) => {
                        
                        // Parse equipment
                        let arrEquipment = jsonResponse.GetSelectedEquipmentResponse.GetSelectedEquipmentResult[0]['a:EquipmentEntity']
                        if (arrEquipment === undefined) return false
                        
                        // Save equipment
                        await this.saveXMLEquipmentRecord(arrEquipment)
                        .then(
                            async (response) => {
                                
                                // Download Components
                                await this.DownloadComponents(equipmentAutoList)
                                .then(
                                    (response => {
                                        console.log('Saved Components!')
                                    })
                                )

                                // Download test point images
                                await this.DownloadTestpointImages(equipmentAutoList)
                                .then (() => {
                                    console.log('Saved Testpoint Images!')
                                })

                                // Download UC Limits
                                await this.DownloadUCLimits(equipmentAutoList)
                                .then (() => {
                                    console.log('Saved UC Limits!')
                                })
                            }
                        )
                    }
                )
            } else {
                console.log('Failed to download equipment data')
            }
        })
    }


}