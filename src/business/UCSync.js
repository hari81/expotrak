import SQLiteManager from '../database/SQLiteManager'
import Util from '../config/Util'
import axios from 'axios'
import APIManager from '../business/APIManager'
import PhotoManager from '../business/PhotoManager'
import mockData from '../__mock_data__/data'

export async function getSyncInspections(inspectionIdList) {

    let syncObject = {}
    let syncArrayInspectionList = []

    for (let i = 0; i < inspectionIdList.length; i++) {

        let syncEquipmentInfo = {}

        // Get logged in user
        await getSyncLoginInfo(syncEquipmentInfo)

        // Get equipment info
        await getSyncEquipmentInfo(1, syncEquipmentInfo)

        // Get jobsite info
        await getSyncJobsiteInfo(1, syncEquipmentInfo)

        // Get component info
        await getSyncComponentInfo(1, syncEquipmentInfo)

        syncArrayInspectionList.push(syncEquipmentInfo)

    }

    syncObject = {
        _equipmentsInspection: syncArrayInspectionList,
        _newEquipments: [],
        _totalEquipments: 1
    }
    console.log(syncObject)

    // Call API to save inspection into DB
    await postInspectionXMLHTTPRequest(syncObject)
    .then((response) => {
        console.log(response)
    })
    .catch(
        (error) => {
            console.log(error)
        }
    )
}

export async function getSyncLoginInfo(syncEquipmentInfo) {
    await SQLiteManager.selectLoggedIn()    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array[0]

            syncEquipmentInfo.Examiner = result.userid
        }          
    })
}

export async function getSyncEquipmentInfo(inspectionId, syncEquipmentInfo) {

    // Get inspection general info
    await SQLiteManager.selectInspection(inspectionId)    
    .then((response) => {

        if (response != null && response._array.length > 0)
        {
            let inspectionInfo = response._array[0]

            ///////////////////
            // GENERAL INFO
            syncEquipmentInfo.EquipmentIdAuto = inspectionInfo.equipmentid_auto
            syncEquipmentInfo.InspectionDate = Util.Functions.getSyncDateTime()
            syncEquipmentInfo.SMU = inspectionInfo.currentsmu
            syncEquipmentInfo.SerialNo = inspectionInfo.serialno
            syncEquipmentInfo.travelForward = 
                Util.Functions.validateNumber(inspectionInfo.travel_forward)
                    ? inspectionInfo.travel_forward
                    : 0
            syncEquipmentInfo.travelReverse = 
                Util.Functions.validateNumber(inspectionInfo.travel_reverse)
                    ? inspectionInfo.travel_reverse
                    : 0
            //syncEquipmentInfo.travelledByKms = false                    // !!!!!!
            syncEquipmentInfo.EquipmentImage = inspectionInfo.image
        }     
    })
}

export async function getSyncJobsiteInfo(inspectionId, syncEquipmentInfo) {

    // Get inspection general info
    await SQLiteManager.selectJobsiteRecord(inspectionId)    
    .then( async (response) => {
        if (response != null && response._array.length > 0)
        {
            let jobsiteInfo = response._array[0]

            ///////////////////
            // JOSBITE INFO
            syncEquipmentInfo.Impact = jobsiteInfo.impact
            syncEquipmentInfo.Abrasive = jobsiteInfo.abrasive
            syncEquipmentInfo.Moisture = jobsiteInfo.moisture
            syncEquipmentInfo.Packing = jobsiteInfo.packing
            syncEquipmentInfo.TrackSagLeft = 
                Util.Functions.validateNumber(jobsiteInfo.track_sag_left)
                    ? jobsiteInfo.track_sag_left
                    : 0.0
            syncEquipmentInfo.TrackSagRight = 
                Util.Functions.validateNumber(jobsiteInfo.track_sag_right)
                    ? jobsiteInfo.track_sag_right
                    : 0.0
            syncEquipmentInfo.DryJointsLeft = 
                Util.Functions.validateNumber(jobsiteInfo.dry_joints_left)
                    ? jobsiteInfo.dry_joints_left
                    : 0.0
            syncEquipmentInfo.DryJointsRight = 
                Util.Functions.validateNumber(jobsiteInfo.dry_joints_right)
                    ? jobsiteInfo.dry_joints_right
                    : 0.0
            syncEquipmentInfo.ExtCannonLeft = 
                Util.Functions.validateNumber(jobsiteInfo.ext_cannon_left)
                    ? jobsiteInfo.ext_cannon_left
                    : 0.0
            syncEquipmentInfo.ExtCannonRight = 
                Util.Functions.validateNumber(jobsiteInfo.ext_cannon_right)
                    ? jobsiteInfo.ext_cannon_right
                    : 0.0
            syncEquipmentInfo.JobsiteComments = jobsiteInfo.jobsite_note
            syncEquipmentInfo.InspectorComments = jobsiteInfo.inspector_note
            syncEquipmentInfo.leftTrackSagComment = jobsiteInfo.track_sag_left_comment
            syncEquipmentInfo.rightTrackSagComment = jobsiteInfo.track_sag_right_comment
            syncEquipmentInfo.leftCannonExtComment = jobsiteInfo.ext_cannon_left_comment
            syncEquipmentInfo.rightCannonExtComment = jobsiteInfo.ext_cannon_right_comment
            await PhotoManager.resizePhoto(jobsiteInfo.track_sag_left_image)
                .then((base64response) => {
                    syncEquipmentInfo.leftTrackSagImage = base64response
                })
                .catch((error) => {
                    syncEquipmentInfo.leftTrackSagImage = null
                })
            await PhotoManager.resizePhoto(jobsiteInfo.track_sag_right_image)
                .then((base64response) => {
                    syncEquipmentInfo.rightTrackSagImage = base64response
                })
                .catch((error) => {
                    syncEquipmentInfo.rightTrackSagImage = null
                })
            await PhotoManager.resizePhoto(jobsiteInfo.ext_cannon_left_image)
                .then((base64response) => {
                    syncEquipmentInfo.leftCannonExtImage = base64response
                })
                .catch((error) => {
                    syncEquipmentInfo.leftCannonExtImage = null
                })
            await PhotoManager.resizePhoto(jobsiteInfo.ext_cannon_right_image)
                .then((base64response) => {
                    syncEquipmentInfo.rightCannonExtImage = base64response
                })
                .catch((error) => {
                    syncEquipmentInfo.rightCannonExtImage = null
                })
            syncEquipmentInfo.leftScallop =
                Util.Functions.validateNumber(jobsiteInfo.scallop_left)
                    ? jobsiteInfo.scallop_left
                    : 0
            syncEquipmentInfo.rightScallop = 
                Util.Functions.validateNumber(jobsiteInfo.scallop_right)
                    ? jobsiteInfo.scallop_right
                    : 0
        }
    })
}

export async function getSyncComponentInfo(inspectionId, syncEquipmentInfo) {

    let syncDetails = []

    // Get components info
    await SQLiteManager.selectComponents(inspectionId)    
    .then(async (response) => {
        if (response != null && response._array.length > 0)
        {   
            let componentList = response._array
            for (let i = 0; i < componentList.length; i++) {

                // Component
                let currComponent = componentList[i]
                
                // Create sync object
                let details = {}
                details.TrackUnitAuto = currComponent.equnit_auto
                details.CompartIdAuto = currComponent.compartid_auto
                details.Comments = currComponent.comments
                await PhotoManager.resizePhoto(currComponent.inspection_image)
                    .then((base64response) => {
                        details.Image = base64response
                    })
                    .catch((error) => {
                        details.Image = null
                    })
                if((details.Comments != null || details.Image != null) 
                    && !Util.Functions.validateString(currComponent.reading))
                    details.Reading = '0'
                else
                    details.Reading = currComponent.reading
                details.PercentageWorn = 
                    Util.Functions.validateNumber(currComponent.worn_percentage)
                        ? currComponent.worn_percentage
                        : -1
                details.ToolUsed = currComponent.tool
                details.AttachmentType = (currComponent.side === "Left" ? 3 : 4);
                details.FlangeType = currComponent.flange_type
    
                syncDetails.push(details);
            }
        }          
    })

    // Update
    syncEquipmentInfo.Details = syncDetails
}

export async function postInspectionXMLHTTPRequest(syncObj) {

    let apiUrl = Util.Functions.getServiceUrl() + Util.ConstantHelper.api_SaveEquipmentsInspectionsData;
    console.log(apiUrl)
    let string = JSON.stringify(syncObj)

    return new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest()
        x.open('POST', apiUrl, true)
        x.setRequestHeader('Content-type','application/json; charset=utf-8')
        x.setRequestHeader("Content-length", string.length)
        x.setRequestHeader("Connection", "close")
        x.onreadystatechange = function() {
            if (x.readyState != 4) return
            if (x.status != 200 && x.status != 304) {
                reject(x.status)
            }
            resolve(x.response)
        }
        x.ontimeout = function () {
            reject('timeout')
        }
        x.send(string)
    })
}

export async function getSyncResult(inspectionId, response) {
    
    let syncResult = 0  // Failed
    let responseId = response[0].Id
    if (responseId > 0) {

        // Sync succeeded
        await SQLiteManager.updateInspectionStatus(inspectionId, 'synced')
        .then(
            (response) => {
                console.log(response)
            }
        )
        syncResult = 1
    }
    
    return syncResult
}

export async function postInspectionFetch(syncObj) {
    try {
        let apiUrl = Util.Functions.getServiceUrl() + Util.ConstantHelper.api_SaveEquipmentsInspectionsData;
        console.log(apiUrl)
        let string = JSON.stringify(syncObj);   

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: string
        });
        //const responseJson = await response.json();
        const responseJson = await response
        .then((response) => {
            console.log('1111111111111111111111')
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })

        return responseJson;
    } catch (error) {
        console.log('2222222222222222222222')
        console.log(error);
        return false;
    }
}

export async function postInspectionAxios(syncObj) {

    let apiUrl = Util.Functions.getServiceUrl() + Util.ConstantHelper.api_SaveEquipmentsInspectionsData;
    console.log(apiUrl) 

    await axios.post(
        apiUrl,
        syncObj)
    .then(function (response) {
        console.log('1111111111111111111111111');
        console.log(response);
    })
    .catch(function (error) {
        console.log('2222222222222222222222222');
        console.log(error);
    });
}

export async function removeSyncedInspections(inspectionIds) {
    await SQLiteManager.deleteInspections(inspectionIds)
    .then((response)=>{}).catch((error)=>{})
}
