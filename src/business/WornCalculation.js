import SQLiteManager from '../database/SQLiteManager'
import Util from '../config/Util'

export async function calculateWorn(
    method,
    compartIdAuto, tool,
    reading, impact, measureUnit) {

    if (!Util.Functions.validateString(reading)) return -1

    let worn = 0
    let convertReading = reading
    if( measureUnit == 1 ) {  // is mm need convert
        convertReading = reading / 25.4
    }

    switch (method.toLowerCase().trim()) {

        case 'cat':
            let componentCATLimits = null
            await getCATLimits(compartIdAuto, tool)
            .then(
                (response) => {
                    if (response !== null) {
                        componentCATLimits = response[0]
                    }
                    worn = calculateCATMethod(convertReading, impact, componentCATLimits)
                }
            )
            return worn

        case 'itm':
            let componentITMLimits = null
            await getITMLimits(compartIdAuto, tool)
            .then(
                (response) => {
                    if (response !== null) {
                        componentITMLimits = response[0]
                    }
                    worn = calculateITMMethod(reading, impact, componentITMLimits)
                }
            )
            return worn

        case 'komatsu':
            let componentKOMATSULimits = null
            await getKOMATSULimits(compartIdAuto, tool)
            .then(
                (response) => {
                    if (response !== null) {
                        componentKOMATSULimits = response[0]
                    }
                    worn = calculateKOMATSUMethod(convertReading, impact, componentKOMATSULimits)
                }
            )
            return worn

        case 'hitachi':
            let componentHITACHILimits = null
            await getHITACHILimits(compartIdAuto, tool)
            .then(
                (response) => {
                    if (response !== null) {
                        componentHITACHILimits = response[0]
                    }
                    worn = calculateHITACHIMethod(convertReading, impact, componentHITACHILimits)
                }
            )
            return worn

        case 'liebherr':
            let componentLIEBHERRLimits = null
            await getLIEBHERRLimits(compartIdAuto, tool)
            .then(
                (response) => {
                    if (response !== null) {
                        componentLIEBHERRLimits = response[0]
                    }
                    worn = calculateLIEBHERRMethod(convertReading, impact, componentLIEBHERRLimits)
                }
            )
            return worn
    }

    return 0
}

///////////////
// CAT Limits
async function getCATLimits(compartIdAuto, catTool) {
    let result = null
    await SQLiteManager.selectCATLimit(compartIdAuto, catTool)    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array
        }
    })
    return result
}

function calculateCATMethod(reading, impact, componentCATLimits) {

    let slope = 0
    let intercept = 0
    if (componentCATLimits !== null) {

        reading = reading + componentCATLimits.adj_to_base
        if (componentCATLimits.sloper === 0) {
            if (impact < 2) {
                if (reading >= componentCATLimits.mi_inflection_point) {
                    slope = componentCATLimits.mi_slope1
                    intercept = componentCATLimits.mi_intercept1
                }
                else {
                    slope = componentCATLimits.mi_slope2
                    intercept = componentCATLimits.mi_intercept2
                }
            } else {
                if (reading >= componentCATLimits.hi_inflection_point) {
                    slope = componentCATLimits.hi_slope1
                    intercept = componentCATLimits.hi_intercept1
                } else {
                    slope = componentCATLimits.hi_slope2
                    intercept = componentCATLimits.hi_intercept2
                }
            }
        } else {
            if (impact < 2){
                if (reading <= componentCATLimits.mi_inflection_point) {
                    slope = componentCATLimits.mi_slope1
                    intercept = componentCATLimits.mi_intercept1
                }
                else {
                    slope = componentCATLimits.mi_slope2
                    intercept = componentCATLimits.mi_intercept2
                }
            }else {
                if (reading <= componentCATLimits.hi_inflection_point) {
                    slope = componentCATLimits.hi_slope1
                    intercept = componentCATLimits.hi_intercept1
                } else {
                    slope = componentCATLimits.hi_slope2
                    intercept = componentCATLimits.hi_intercept2
                }
            }
        }    
    }

    return Math.round((reading*slope) + intercept)
}

///////////////
// ITM Limits
async function getITMLimits(compartIdAuto, tool) {
    let result = null
    await SQLiteManager.selectITMLimit(compartIdAuto, tool)    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array
        }
    })
    return result
}

function LinearFunction(x2, x1, y2, y1, reading) {
    let m = (y2 - y1)/(x2 - x1);
    let c = y1 - (x1*m);

    return Math.round((m*reading) + c);
}

function calculateITMMethod(reading, itmLimits) {

    if (itmLimits !== null) {
        if(itmLimits.start_depth_new > itmLimits.wear_depth_100_percent) {
            if (reading <= itmLimits.start_depth_new && reading > itmLimits.wear_depth_10_percent)
                return LinearFunction(itmLimits.wear_depth_10_percent, itmLimits.start_depth_new, 10, 0, reading);
            if (reading <= itmLimits.wear_depth_10_percent && reading > itmLimits.wear_depth_20_percent)
                return LinearFunction(itmLimits.wear_depth_20_percent, itmLimits.wear_depth_10_percent, 20, 10, reading);
            if (reading <= itmLimits.wear_depth_20_percent && reading > itmLimits.wear_depth_30_percent)
                return LinearFunction(itmLimits.wear_depth_30_percent, itmLimits.wear_depth_20_percent, 30, 20, reading);
            if (reading <= itmLimits.wear_depth_30_percent && reading > itmLimits.wear_depth_40_percent)
                return LinearFunction(itmLimits.wear_depth_40_percent, itmLimits.wear_depth_30_percent, 40, 30, reading);
            if (reading <= itmLimits.wear_depth_40_percent && reading > itmLimits.wear_depth_50_percent)
                return LinearFunction(itmLimits.wear_depth_50_percent, itmLimits.wear_depth_40_percent, 50, 40, reading);
            if (reading <= itmLimits.wear_depth_50_percent && reading > itmLimits.wear_depth_60_percent)
                return LinearFunction(itmLimits.wear_depth_60_percent, itmLimits.wear_depth_50_percent, 60, 50, reading);
            if (reading <= itmLimits.wear_depth_60_percent && reading > itmLimits.wear_depth_70_percent)
                return LinearFunction(itmLimits.wear_depth_70_percent, itmLimits.wear_depth_60_percent, 70, 60, reading);
            if (reading <= itmLimits.wear_depth_70_percent && reading > itmLimits.wear_depth_80_percent)
                return LinearFunction(itmLimits.wear_depth_80_percent, itmLimits.wear_depth_70_percent, 80, 70, reading);
            if (reading <= itmLimits.wear_depth_80_percent && reading > itmLimits.wear_depth_90_percent)
                return LinearFunction(itmLimits.wear_depth_90_percent, itmLimits.wear_depth_80_percent, 90, 80, reading);
            if (reading <= itmLimits.wear_depth_90_percent && reading > itmLimits.wear_depth_100_percent)
                return LinearFunction(itmLimits.wear_depth_100_percent, itmLimits.wear_depth_90_percent, 100, 90, reading);
            if (reading <= itmLimits.wear_depth_100_percent && reading > itmLimits.wear_depth_110_percent)
                return LinearFunction(itmLimits.wear_depth_110_percent, itmLimits.wear_depth_100_percent, 110, 100, reading);
            if (reading <= itmLimits.wear_depth_110_percent && reading > itmLimits.wear_depth_120_percent)
                return LinearFunction(itmLimits.wear_depth_120_percent, itmLimits.wear_depth_110_percent, 120, 110, reading);

            return 120
        }else {
            if (reading >= itmLimits.start_depth_new && reading < itmLimits.wear_depth_10_percent)
                return LinearFunction(itmLimits.wear_depth_10_percent, itmLimits.start_depth_new, 10, 0, reading);
            if (reading >= itmLimits.wear_depth_10_percent && reading < itmLimits.wear_depth_20_percent)
                return LinearFunction(itmLimits.wear_depth_20_percent, itmLimits.wear_depth_10_percent, 20, 10, reading);
            if (reading >= itmLimits.wear_depth_20_percent && reading < itmLimits.wear_depth_30_percent)
                return LinearFunction(itmLimits.wear_depth_30_percent, itmLimits.wear_depth_20_percent, 30, 20, reading);
            if (reading >= itmLimits.wear_depth_30_percent && reading < itmLimits.wear_depth_40_percent)
                return LinearFunction(itmLimits.wear_depth_40_percent, itmLimits.wear_depth_30_percent, 40, 30, reading);
            if (reading >= itmLimits.wear_depth_40_percent && reading < itmLimits.wear_depth_50_percent)
                return LinearFunction(itmLimits.wear_depth_50_percent, itmLimits.wear_depth_40_percent, 50, 40, reading);
            if (reading >= itmLimits.wear_depth_50_percent && reading < itmLimits.wear_depth_60_percent)
                return LinearFunction(itmLimits.wear_depth_60_percent, itmLimits.wear_depth_50_percent, 60, 50, reading);
            if (reading >= itmLimits.wear_depth_60_percent && reading < itmLimits.wear_depth_70_percent)
                return LinearFunction(itmLimits.wear_depth_70_percent, itmLimits.wear_depth_60_percent, 70, 60, reading);
            if (reading >= itmLimits.wear_depth_70_percent && reading < itmLimits.wear_depth_80_percent)
                return LinearFunction(itmLimits.wear_depth_80_percent, itmLimits.wear_depth_70_percent, 80, 70, reading);
            if (reading >= itmLimits.wear_depth_80_percent && reading < itmLimits.wear_depth_90_percent)
                return LinearFunction(itmLimits.wear_depth_90_percent, itmLimits.wear_depth_80_percent, 90, 80, reading);
            if (reading >= itmLimits.wear_depth_90_percent && reading < itmLimits.wear_depth_100_percent)
                return LinearFunction(itmLimits.wear_depth_100_percent, itmLimits.wear_depth_90_percent, 100, 90, reading);
            if (reading >= itmLimits.wear_depth_100_percent && reading < itmLimits.wear_depth_110_percent)
                return LinearFunction(itmLimits.wear_depth_110_percent, itmLimits.wear_depth_100_percent, 110, 100, reading);
            if (reading >= itmLimits.wear_depth_110_percent && reading < itmLimits.wear_depth_120_percent)
                return LinearFunction(itmLimits.wear_depth_120_percent, itmLimits.wear_depth_110_percent, 120, 110, reading);

            return 120
        }   
    } else {
        return 0
    }
}

//////////////////
// KOMATSU
async function getKOMATSULimits(compartIdAuto, tool) {
    let result = null
    await SQLiteManager.selectKOMATSULimit(compartIdAuto, tool)    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array
        }
    })
    return result
}

function calculateKOMATSUMethod(reading, impact, componentKOMATSULimits) {

    let secondorder = 0
    let slope = 0
    let intercept = 0
    if (componentKOMATSULimits != null) {
        if (impact < 2){
            secondorder = limitsForComponent.normal_secondorder
            slope = limitsForComponent.normal_slope
            intercept = limitsForComponent.normal_intercept
        } else {
            secondorder = limitsForComponent.impact_secondorder
            slope = limitsForComponent.impact_slope
            intercept = limitsForComponent.impact_intercept
        }
    }

    return Math.round((Math.pow(reading, 2.0)*secondorder) + (reading*slope) + intercept);
}

//////////////////
// HITACHI
async function getHITACHILimits(compartIdAuto, tool) {
    let result = null
    await SQLiteManager.selectHITACHILimit(compartIdAuto, tool)    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array
        }
    })
    return result
}

function calculateHITACHIMethod(reading, impact, componentHITACHILimits) {

    let slope = 0
    let intercept = 0
    if (componentHITACHILimits != null) {
        if (impact < 2){
            slope = componentHITACHILimits.normal_slope
            intercept = componentHITACHILimits.normal_intercept
        } else {
            slope = componentHITACHILimits.impact_slope
            intercept = componentHITACHILimits.impact_intercept
        }
    }

    return Math.round((reading*slope)+intercept);
}

//////////////////
// LIEBHERR
async function getLIEBHERRLimits(compartIdAuto, tool) {
    let result = null
    await SQLiteManager.selectLIEBHERRLimit(compartIdAuto, tool)    
    .then((response) => {
        if (response != null && response._array.length > 0)
        {
            result = response._array
        }
    })
    return result
}

function calculateLIEBHERRMethod(reading, impact, componentLIEBHERRLimits) {

    let slope = 0
    let intercept = 0
    if (componentLIEBHERRLimits != null) {
        if (impact < 2) {
            slope = componentLIEBHERRLimits.normal_slope
            intercept = componentLIEBHERRLimits.normal_intercept
        } else {
            slope = componentLIEBHERRLimits.impact_slope
            intercept = componentLIEBHERRLimits.impact_intercept
        }
    }

    return Math.round((reading*slope)+intercept);
}