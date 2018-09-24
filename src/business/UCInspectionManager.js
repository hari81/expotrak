import { Util } from "../config/Util"
import APIManager from "./APIManager"
import SQLiteManager from "../database/SQLiteManager"
import CommonStyles from "../styles/Common";

export default class UCInspectionManager {

    static async getComponentList(inspectionId) {
        console.log('getComponentList: ' + inspectionId)
        let result = null
        await SQLiteManager.selectComponents(inspectionId)    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                result = response._array
            }
        })
        return result
    }

    static async DownloadDealershipLimits() {

        let result = null
        await APIManager.GetDealershipLimits().then( (response) => {
            
            if (response.GetDealershipLimitsResult.length > 0) {
                result = response.GetDealershipLimitsResult[0]
            }

        })
        
        return result
    }

    static async getTestPoint(compartTypeAuto, tool) {
        console.log('getTestPoint: ' + tool + ', compartTypeAuto: ' + compartTypeAuto)
        let result = null
        await SQLiteManager.selectTestPoint(compartTypeAuto, tool)    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                result = response._array
            }
        })
        return result
    }

    static getPreviousComponent(selectedComponent, arrComponentList) {
        let selectedIndex = 0
        arrComponentList.filter( (item, index, array) => {
            if (item.equnit_auto === selectedComponent.equnit_auto) {
                selectedIndex = index
                return item
            }
        })

        if (selectedIndex > 0) 
            return arrComponentList[selectedIndex - 1]
        else
            return null
    }

    static getNextComponent(selectedComponent, arrComponentList) {
        let selectedIndex = 0
        arrComponentList.filter( (item, index, array) => {
            if (item.equnit_auto === selectedComponent.equnit_auto) {
                selectedIndex = index
                return item
            }
        })

        if (selectedIndex == arrComponentList.length - 1) 
            return null
        else
            return arrComponentList[selectedIndex + 1]
    }

    static async saveComponentDetail(inspectionId, equnitAuto, valueObj) {

        let result = null

        //////////////////////
        // Exist, update
        await SQLiteManager.updateComponentDetail(inspectionId, equnitAuto, valueObj)
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
        
        return result
    }

    static displayWornPercentage = (percWorn) => {
        //let percWorn = this.props.selectedComponent.worn_percentage
        let percString = ''
        if(percWorn > 120)
            percString = '120% >'
        else if (percWorn < 0)
            percString = '< 0%'
        else
            percString = (percWorn < 0) 
                ? '0' 
                : (Util.Functions.validateNumber(percWorn) 
                        ? percWorn.toString() + '%' 
                        : '')

        return percString
    }

    static displayWornPercentageColor = (percWorn, dealershipLimits) => {

        if (dealershipLimits === undefined)
            return CommonStyles.COLOR_GREEN

        //let percWorn = this.props.selectedComponent.worn_percentage        
        if (percWorn < 0) {
            return CommonStyles.COLOR_DARK_GREY
        }
        if (percWorn <= dealershipLimits.ALimit) {
            return CommonStyles.COLOR_GREEN
        }
        if (percWorn <= dealershipLimits.BLimit) {
            return CommonStyles.COLOR_YELLOW
        }
        if (percWorn <= dealershipLimits.CLimit) {
            return CommonStyles.COLOR_ORANGE
        }

        return CommonStyles.COLOR_RED         // X
    }

}