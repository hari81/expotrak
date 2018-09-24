import { FileSystem, SQLite } from 'expo'

import Util from "../config/Util";
import { SQLiteDefinition } from './SQLiteDefinition'

export default class SQLiteManager {
    
    constructor() {}

    static exportDbFile() {
        let filePath = Expo.FileSystem.documentDirectory 
            + '/SQLite/' + Util.ConstantHelper.db_name
        console.log(filePath)
    }

    ////////////////////////
    // APPLICATION_CONFIG //
    ////////////////////////
    static insertLoginRecord(username, password, remember_me) {        
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('insert into ' 
                + SQLiteDefinition.TABLES.LOG_IN + ' (' 
                + SQLiteDefinition.FIELDS.USER_ID + ', ' 
                + SQLiteDefinition.FIELDS.PASSWORD + ', ' 
                + SQLiteDefinition.FIELDS.REMEMBER_ME + ') ' 
                + 'values (?, ?, ?)' 
                , [username, password, remember_me]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Config table');
        return insertSuccess;
    }

    static deleteConfigTable() {
        let result = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('delete from ' + SQLiteDefinition.TABLES.LOG_IN + '')
            },
            null,
            () => {
                result = true
            }
        );
        console.log('Deleted Config table');
        return result;
    }

    static selectLoggedIn() {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.LOG_IN + '',
                        [],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    ////////////////
    // EQUIPMENTS //
    ////////////////
    static selectEquipmentRecordById(equipmentAuto) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.EQUIPMENTS + ' where '
                        + SQLiteDefinition.FIELDS.EQUIPMENTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.STATUS + ' != ? ',
                        [equipmentAuto,'synced'],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static selectUnsyncedEquipments() {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.EQUIPMENTS + ' where '
                        + SQLiteDefinition.FIELDS.STATUS + ' is null or '
                        + SQLiteDefinition.FIELDS.STATUS + ' != ? ',
                        ['synced'],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertEquipmentRecord(equipmentObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('insert into ' 
                + SQLiteDefinition.TABLES.EQUIPMENTS + ' (' 
                + SQLiteDefinition.FIELDS.EQUIPMENTID_AUTO + ', '
                + SQLiteDefinition.FIELDS.CRSF_AUTO + ', '
                + SQLiteDefinition.FIELDS.SERIALNO + ', '
                + SQLiteDefinition.FIELDS.UNITNO + ', '
                + SQLiteDefinition.FIELDS.FAMILY + ', '
                + SQLiteDefinition.FIELDS.MODEL + ', '
                + SQLiteDefinition.FIELDS.CUSTOMER + ', '
                + SQLiteDefinition.FIELDS.JOBSITE + ', '
                + SQLiteDefinition.FIELDS.CUSTOMER_AUTO + ', '
                + SQLiteDefinition.FIELDS.STATUS + ', '
                + SQLiteDefinition.FIELDS.MODEL_AUTO + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                , [ equipmentObj.EquipmentId,
                    equipmentObj.EquipmentJobsiteAuto,
                    equipmentObj.EquipmentSerialNo,
                    equipmentObj.EquipmentUnitNo,
                    equipmentObj.EquipmentFamily,
                    equipmentObj.EquipmentModel,
                    equipmentObj.EquipmentCustomer,
                    equipmentObj.EquipmentJobsite,
                    equipmentObj.CustomerAuto,
                    'Not Started',
                    equipmentObj.EquipmentModelAuto
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Equipments table');
        return insertSuccess;
    }

    static insertXMLEquipmentRecord(equipmentObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('insert into ' 
                + SQLiteDefinition.TABLES.EQUIPMENTS + ' (' 
                + SQLiteDefinition.FIELDS.EQUIPMENTID_AUTO + ', '
                + SQLiteDefinition.FIELDS.CRSF_AUTO + ', '
                + SQLiteDefinition.FIELDS.SERIALNO + ', '
                + SQLiteDefinition.FIELDS.UNITNO + ', '
                + SQLiteDefinition.FIELDS.FAMILY + ', '
                + SQLiteDefinition.FIELDS.MODEL + ', '
                + SQLiteDefinition.FIELDS.CUSTOMER + ', '
                + SQLiteDefinition.FIELDS.JOBSITE + ', '
                + SQLiteDefinition.FIELDS.CUSTOMER_AUTO + ', '
                + SQLiteDefinition.FIELDS.STATUS + ', '
                + SQLiteDefinition.FIELDS.CURRENTSMU + ', '
                + SQLiteDefinition.FIELDS.IMAGE + ', '
                + SQLiteDefinition.FIELDS.LOCATION + ', '
                + SQLiteDefinition.FIELDS.UC_SERIAL_LEFT + ', '
                + SQLiteDefinition.FIELDS.UC_SERIAL_RIGHT + ', '
                + SQLiteDefinition.FIELDS.MODEL_AUTO + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                , [ equipmentObj['a:EquipmentId'][0],
                    equipmentObj['a:EquipmentJobsiteAuto'][0],
                    equipmentObj['a:EquipmentSerialNo'][0],
                    equipmentObj['a:EquipmentUnitNo'][0],
                    equipmentObj['a:EquipmentFamily'][0],
                    equipmentObj['a:EquipmentModel'][0],
                    equipmentObj['a:EquipmentCustomer'][0],
                    equipmentObj['a:EquipmentJobsite'][0],
                    equipmentObj.CustomerAuto,
                    'Not Started',
                    equipmentObj['a:EquipmentSMU'][0], // current smu
                    equipmentObj['a:EquipmentImage'][0], // image
                    equipmentObj['a:EquipmentLocation'][0], // location
                    equipmentObj['a:UCSerialLeft'][0], // left serial
                    equipmentObj['a:UCSerialRight'][0], // right serial
                    equipmentObj['a:EquipmentModelAuto'][0]
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Equipments table');
        return insertSuccess;
    }

    static updateInspectionDetail(inspectionId, smu, forwardHrs, reverseHrs, image) {
        console.log('updateInspectionDetail ' + inspectionId + ', ' + smu + ', ' + forwardHrs + ', ' + reverseHrs)
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise(function(resolve, reject)
        {
            db.transaction(
                tx => {
                    tx.executeSql('update ' 
                    + SQLiteDefinition.TABLES.EQUIPMENTS + ' SET ' 
                    + SQLiteDefinition.FIELDS.CURRENTSMU + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRAVEL_FORWARD + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRAVEL_REVERSE + ' = ?, '
                    + SQLiteDefinition.FIELDS.IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.STATUS + ' = ? '
                    + ' WHERE ' + SQLiteDefinition.FIELDS.ID + ' = ? '
                    , [smu, forwardHrs, reverseHrs, image, 'In Progress', inspectionId]);
                },
                () => {
                    return reject(false)
                },
                () => {
                    return resolve(true)
                }
            )
        })
    }

    static updateInspectionStatus(inspectionId, status) {
        console.log('updateInspectionStatus ' + inspectionId + ', ' + status)
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise(function(resolve, reject)
        {
            db.transaction(
                tx => {
                    tx.executeSql('update ' 
                    + SQLiteDefinition.TABLES.EQUIPMENTS + ' SET ' 
                    + SQLiteDefinition.FIELDS.STATUS + ' = ? '
                    + ' WHERE ' + SQLiteDefinition.FIELDS.ID + ' = ? '
                    , [status, inspectionId]);
                },
                () => {
                    return reject(false)
                },
                () => {
                    return resolve(true)
                }
            )
        })
    }

    static selectInspection(inspectionId) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.EQUIPMENTS + ' where '
                        + SQLiteDefinition.FIELDS.ID + ' = ? ',
                        [inspectionId],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    )
            },
            null,
            null)
        })
    }

    /////////////
    // JOBSITE //
    /////////////
    static selectJobsiteRecord(inspectionId) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.JOBSITE + ' where '
                        + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' = ? ',
                        [inspectionId],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertJobsiteDetail(inspectionId, crsfAuto, jobsite, valueObj) {
        console.log('insertJobsiteDetail ' + inspectionId + ', ' + crsfAuto + ', ' + jobsite)
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise(function(resolve, reject)
        {
            db.transaction(
                tx => {
                    tx.executeSql('insert into ' 
                    + SQLiteDefinition.TABLES.JOBSITE + ' (' 
                        + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ', '
                        + SQLiteDefinition.FIELDS.CRSF_AUTO + ', '
                        + SQLiteDefinition.FIELDS.JOBSITE + ', '
                        + SQLiteDefinition.FIELDS.UOM + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT + ', '
                        + SQLiteDefinition.FIELDS.DRY_JOINTS_LEFT + ', '
                        + SQLiteDefinition.FIELDS.DRY_JOINTS_RIGHT + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT + ', '
                        + SQLiteDefinition.FIELDS.IMPACT + ', '
                        + SQLiteDefinition.FIELDS.ABRASIVE + ', '
                        + SQLiteDefinition.FIELDS.MOISTURE + ', '
                        + SQLiteDefinition.FIELDS.PACKING + ', '
                        + SQLiteDefinition.FIELDS.INSPECTOR_NOTE + ', '
                        + SQLiteDefinition.FIELDS.JOBSITE_NOTE + ', '
                        + SQLiteDefinition.FIELDS.INSPECTION_DATE + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT_COMMENT + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT_COMMENT + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT_COMMENT + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT_COMMENT + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT_IMAGE + ', '
                        + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT_IMAGE + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT_IMAGE + ', '
                        + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT_IMAGE + ', '
                        + SQLiteDefinition.FIELDS.SCALLOP_LEFT + ', '
                        + SQLiteDefinition.FIELDS.SCALLOP_RIGHT + ') '
                    + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                    , [ inspectionId,
                        crsfAuto,
                        jobsite,
                        valueObj.uom,
                        valueObj.track_sag_left,
                        valueObj.track_sag_right,
                        valueObj.dry_joints_left,
                        valueObj.dry_joints_right,
                        valueObj.ext_cannon_left,
                        valueObj.ext_cannon_right,
                        valueObj.impact,
                        valueObj.abrasive,
                        valueObj.moisture,
                        valueObj.packing,
                        valueObj.inspector_note,
                        valueObj.jobsite_note,
                        Util.Functions.getCurrentDateTime(),
                        valueObj.track_sag_left_comment,
                        valueObj.track_sag_right_comment,
                        valueObj.ext_cannon_left_comment,
                        valueObj.ext_cannon_right_comment,
                        valueObj.track_sag_left_image,
                        valueObj.track_sag_right_image,
                        valueObj.ext_cannon_left_image,
                        valueObj.ext_cannon_right_image,
                        valueObj.scallop_left,
                        valueObj.scallop_right
                    ])
                },
                (error) => {
                    return reject(error)
                },
                () => {
                    return resolve(true)
                }
            );
        })
    }

    static updateJobsiteDetail(jobsiteId, valueObj) {
        console.log('updateJobsiteDetail ' + valueObj)
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise(function(resolve, reject)
        {
            db.transaction(
                tx => {
                    tx.executeSql('update ' 
                    + SQLiteDefinition.TABLES.JOBSITE + ' SET ' 
                    + SQLiteDefinition.FIELDS.UOM + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT + ' = ?, '
                    + SQLiteDefinition.FIELDS.DRY_JOINTS_LEFT + ' = ?, '
                    + SQLiteDefinition.FIELDS.DRY_JOINTS_RIGHT + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT + ' = ?, '
                    + SQLiteDefinition.FIELDS.IMPACT + ' = ?, '
                    + SQLiteDefinition.FIELDS.ABRASIVE + ' = ?, '
                    + SQLiteDefinition.FIELDS.MOISTURE + ' = ?, '
                    + SQLiteDefinition.FIELDS.PACKING + ' = ?, '
                    + SQLiteDefinition.FIELDS.INSPECTOR_NOTE + ' = ?, '
                    + SQLiteDefinition.FIELDS.JOBSITE_NOTE + ' = ?, '
                    + SQLiteDefinition.FIELDS.INSPECTION_DATE + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT_COMMENT + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT_COMMENT + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT_COMMENT + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT_COMMENT + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_LEFT_IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.TRACK_SAG_RIGHT_IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_LEFT_IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.EXT_CANNON_RIGHT_IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.SCALLOP_LEFT + ' = ?, '
                    + SQLiteDefinition.FIELDS.SCALLOP_RIGHT + ' = ? '
                    + ' WHERE ' + SQLiteDefinition.FIELDS.ID + ' = ? '
                    , [
                        valueObj.uom,
                        valueObj.track_sag_left,
                        valueObj.track_sag_right,
                        valueObj.dry_joints_left,
                        valueObj.dry_joints_right,
                        valueObj.ext_cannon_left,
                        valueObj.ext_cannon_right,
                        valueObj.impact,
                        valueObj.abrasive,
                        valueObj.moisture,
                        valueObj.packing,
                        valueObj.inspector_note,
                        valueObj.jobsite_note,
                        Util.Functions.getCurrentDateTime(),
                        valueObj.track_sag_left_comment,
                        valueObj.track_sag_right_comment,
                        valueObj.ext_cannon_left_comment,
                        valueObj.ext_cannon_right_comment,
                        valueObj.track_sag_left_image,
                        valueObj.track_sag_right_image,
                        valueObj.ext_cannon_left_image,
                        valueObj.ext_cannon_right_image,
                        valueObj.scallop_left,
                        valueObj.scallop_right,

                        jobsiteId
                    ]);
                },
                (error) => {
                    return reject(error)
                },
                () => {
                    return resolve(true)
                }
            )
        })
    }

    ////////////////
    // COMPONENTS //
    ////////////////
    static insertXMLComponentRecord(inspectionId ,componentObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('insert into ' 
                + SQLiteDefinition.TABLES.COMPONENTS + ' (' 
                    + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ', '
                    + SQLiteDefinition.FIELDS.EQUIPMENTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.EQUNIT_AUTO + ', '
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.COMPARTID + ', '
                    + SQLiteDefinition.FIELDS.COMPART + ', '
                    + SQLiteDefinition.FIELDS.SIDE + ', '
                    + SQLiteDefinition.FIELDS.POSITION + ', '
                    //+ SQLiteDefinition.FIELDS.READING + ', '
                    + SQLiteDefinition.FIELDS.TOOL + ', '
                    + SQLiteDefinition.FIELDS.METHOD + ', '
                    + SQLiteDefinition.FIELDS.COMPARTTYPE_AUTO + ', '
                    //+ SQLiteDefinition.FIELDS.COMMENTS + ', '
                    + SQLiteDefinition.FIELDS.IMAGE + ', '
                    //+ SQLiteDefinition.FIELDS.FLANGE_TYPE + ', '
                    + SQLiteDefinition.FIELDS.LAST_READING + ', '
                    + SQLiteDefinition.FIELDS.LAST_WORN_PERCENTAGE + ', '
                    + SQLiteDefinition.FIELDS.LAST_TOOL_ID + ', '
                    + SQLiteDefinition.FIELDS.LAST_TOOL_SYMBOL + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                , [
                    inspectionId,
                    componentObj['a:EquipmentId'][0],
                    componentObj['a:ComponentId'][0],
                    componentObj['a:ComponentIdAuto'][0],
                    componentObj['a:PartNo'][0],
                    componentObj['a:ComponentName'][0],
                    componentObj['a:ComponentSide'][0],
                    componentObj['a:ComponentPosition'][0],
                    //+ SQLiteDefinition.FIELDS.READING + ', '
                    componentObj['a:DefaultTool'][0],
                    componentObj['a:ComponentMethod'][0],
                    componentObj['a:ComponentType'][0],
                    //+ SQLiteDefinition.FIELDS.COMMENTS + ', '
                    componentObj['a:ComponentImage'][0],
                    //+ SQLiteDefinition.FIELDS.FLANGE_TYPE + ', '
                    componentObj['a:LastReading'][0],
                    componentObj['a:LastWornPercentage'][0],
                    componentObj['a:ToolId'][0],
                    componentObj['a:ToolSymbol'][0]
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Components table');
        return insertSuccess;
    }

    static updateComponentDetail(inspectionId, equnitAuto, valueObj) {
        console.log('updateComponentDetail ' + valueObj)
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise(function(resolve, reject)
        {
            db.transaction(
                tx => {
                    tx.executeSql('update ' 
                    + SQLiteDefinition.TABLES.COMPONENTS + ' SET ' 
                    + SQLiteDefinition.FIELDS.READING + ' = ?, '
                    + SQLiteDefinition.FIELDS.WORN_PERCENTAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.INSPECTION_IMAGE + ' = ?, '
                    + SQLiteDefinition.FIELDS.COMMENTS + ' = ?, '
                    + SQLiteDefinition.FIELDS.FLANGE_TYPE + ' = ?, '
                    + SQLiteDefinition.FIELDS.TOOL + ' = ? '
                    + ' WHERE ' + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' = ? '
                    + ' AND ' + SQLiteDefinition.FIELDS.EQUNIT_AUTO + ' = ? '
                    , [
                        valueObj.reading,
                        valueObj.worn_percentage,
                        valueObj.inspection_image,
                        valueObj.comments,
                        valueObj.flange_type,
                        valueObj.tool,
                        inspectionId,
                        equnitAuto
                    ])
                },
                (error) => {
                    return reject(error)
                },
                () => {
                    return resolve(true)
                }
            )
        })
    }

    static selectComponents(inspectionId) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.COMPONENTS + ' where '
                        + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' = ? ',
                        [inspectionId],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    ///////////////////////
    // TEST POINT IMAGES //
    ///////////////////////
    static insertXMLTestPointImgRecord(inspectionId, obj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('insert into ' 
                + SQLiteDefinition.TABLES.TEST_POINT_IMAGES + ' (' 
                    + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ', '
                    + SQLiteDefinition.FIELDS.COMPARTTYPE_AUTO + ', '
                    + SQLiteDefinition.FIELDS.TOOL + ', '
                    + SQLiteDefinition.FIELDS.IMAGE + ') ' 
                + 'values (?, ?, ?, ?)'
                , [
                    inspectionId,
                    obj['a:CompartType'][0],
                    obj['a:Tool'][0],
                    obj['a:TestPointImage'][0]
                ])
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Test Point Images table');
        return insertSuccess;
    }

    static selectTestPoint(compartTypeAuto, tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.TEST_POINT_IMAGES + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTTYPE_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.TOOL + ' = ? ',
                        [compartTypeAuto, tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    //////////////
    // UCLimits //
    //////////////
    static insertCATLimitRecord(limitObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('INSERT or IGNORE into ' 
                + SQLiteDefinition.TABLES.CAT_WORN_LIMITS + ' (' 
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.CAT_TOOL + ', '
                    + SQLiteDefinition.FIELDS.CAT_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.CAT_ADJ_TO_BASE + ', '
                    + SQLiteDefinition.FIELDS.CAT_HI_INFLECTION_POINT + ', '
                    + SQLiteDefinition.FIELDS.CAT_HI_SLOPE1 + ', '
                    + SQLiteDefinition.FIELDS.CAT_HI_INTERCEPT1 + ', '
                    + SQLiteDefinition.FIELDS.CAT_HI_SLOPE2 + ', '
                    + SQLiteDefinition.FIELDS.CAT_HI_INTERCEPT2 + ', '
                    + SQLiteDefinition.FIELDS.CAT_MI_INFLECTION_POINT + ', '
                    + SQLiteDefinition.FIELDS.CAT_MI_SLOPE1 + ', '
                    + SQLiteDefinition.FIELDS.CAT_MI_INTERCEPT1 + ', '
                    + SQLiteDefinition.FIELDS.CAT_MI_SLOPE2 + ', '
                    + SQLiteDefinition.FIELDS.CAT_MI_INTERCEPT2 + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                , [
                    limitObj.CompartIdAuto,
                    limitObj.CATTool,
                    limitObj.Slope,
                    limitObj.AdjToBase,
                    limitObj.HiInflectionPoint,
                    limitObj.HiSlope1,
                    limitObj.HiIntercept1,
                    limitObj.HiSlope2,
                    limitObj.HiIntercept2,
                    limitObj.MiInflectionPoint,
                    limitObj.MiSlope1,
                    limitObj.MiIntercept1,
                    limitObj.MiSlope2,
                    limitObj.MiIntercept2
                ]);
            },
            (error) => {
                insertSuccess = false
                console.log(error);
            },
            () => {
                insertSuccess = true
            }
        );

        return insertSuccess;
    }

    static selectCATLimit(compartid_auto, cat_tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.CAT_WORN_LIMITS + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.CAT_TOOL + ' = ? ',
                        [compartid_auto, cat_tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertITMLimitRecord(limitObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('INSERT or IGNORE into ' 
                + SQLiteDefinition.TABLES.ITM_WORN_LIMITS + ' (' 
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.ITM_TOOL + ', '
                    + SQLiteDefinition.FIELDS.ITM_NEW + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_10_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_20_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_30_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_40_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_50_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_60_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_70_PERCENT + ', ' 
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_80_PERCENT + ', ' 
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_90_PERCENT + ', ' 
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_100_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_110_PERCENT + ', '
                    + SQLiteDefinition.FIELDS.ITM_WEAR_DEPTH_120_PERCENT + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
                , [
                    limitObj.CompartIdAuto,
                    limitObj.ITMTool,
                    limitObj.StartDepthNew,
                    limitObj.WearDepth10Percent,
                    limitObj.WearDepth20Percent,
                    limitObj.WearDepth30Percent,
                    limitObj.WearDepth40Percent,
                    limitObj.WearDepth50Percent,
                    limitObj.WearDepth60Percent,
                    limitObj.WearDepth70Percent,
                    limitObj.WearDepth80Percent,
                    limitObj.WearDepth90Percent,
                    limitObj.WearDepth100Percent,
                    limitObj.WearDepth110Percent,
                    limitObj.WearDepth120Percent
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted ITM Limit table');
        return insertSuccess;
    }

    static selectITMLimit(compartid_auto, tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.ITM_WORN_LIMITS + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.ITM_TOOL + ' = ? ',
                        [compartid_auto, tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertKomatsuLimitRecord(limitObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('INSERT or IGNORE into ' 
                + SQLiteDefinition.TABLES.KOMATSU_WORN_LIMITS + ' (' 
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.KOMATSU_TOOL + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_SECONDORDER + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_INTERCEPT + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_SECONDORDER + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_INTERCEPT + ') ' 
                + 'values (?, ?, ?, ?, ?, ?, ?, ?)'
                , [
                    limitObj.CompartIdAuto,
                    limitObj.KomatsuTool,
                    limitObj.ImpactSecondOrder,
                    limitObj.ImpactSlope,
                    limitObj.ImpactIntercept,                    
                    limitObj.NormalSecondOrder,                    
                    limitObj.NormalSlope,                    
                    limitObj.NormalIntercept
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Komatsu Limit table');
        return insertSuccess;
    }

    static selectKOMATSULimit(compartid_auto, tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.KOMATSU_WORN_LIMITS + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.KOMATSU_TOOL + ' = ? ',
                        [compartid_auto, tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertHitachiLimitRecord(limitObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('INSERT or IGNORE into ' 
                + SQLiteDefinition.TABLES.HITACHI_WORN_LIMITS + ' (' 
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.HITACHI_TOOL + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_INTERCEPT + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_INTERCEPT + ') '
                + 'values (?, ?, ?, ?, ?, ?)'
                , [
                    limitObj.CompartIdAuto,
                    limitObj.HitachiTool,
                    limitObj.ImpactSlopeHit,
                    limitObj.ImpactInterceptHit,
                    limitObj.NormalSlopeHit,                    
                    limitObj.NormalInterceptHit
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Hitachi Limit table');
        return insertSuccess;
    }

    static selectHITACHILimit(compartid_auto, tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.HITACHI_WORN_LIMITS + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.HITACHI_TOOL + ' = ? ',
                        [compartid_auto, tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    static insertLiebherrLimitRecord(limitObj) {
        let insertSuccess = false;
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        db.transaction(
            tx => {
                tx.executeSql('INSERT or IGNORE into ' 
                + SQLiteDefinition.TABLES.LIEBHERR_WORN_LIMITS + ' (' 
                    + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ', '
                    + SQLiteDefinition.FIELDS.LIEBHERR_TOOL + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.IMPACT_INTERCEPT + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_SLOPE + ', '
                    + SQLiteDefinition.FIELDS.NORMAL_INTERCEPT + ') '
                + 'values (?, ?, ?, ?, ?, ?)'
                , [
                    limitObj.CompartIdAuto,
                    limitObj.LiebherrTool,
                    limitObj.ImpactSlopeLie,
                    limitObj.ImpactInterceptLie,
                    limitObj.NormalSlopeLie,
                    limitObj.NormalInterceptLie
                ]);
            },
            null,                      // error
            () => {
                insertSuccess = true
            }
        );
        console.log('Inserted Liebherr Limit table');
        return insertSuccess;
    }

    static selectLIEBHERRLimit(compartid_auto, tool) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.LIEBHERR_WORN_LIMITS + ' where '
                        + SQLiteDefinition.FIELDS.COMPARTID_AUTO + ' = ? AND '
                        + SQLiteDefinition.FIELDS.LIEBHERR_TOOL + ' = ? ',
                        [compartid_auto, tool],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    //////////////////////
    // COMPONENTS TABLE //
    //////////////////////
    static selectComponents(inspectionId) {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name);
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql('select * from ' + SQLiteDefinition.TABLES.COMPONENTS + ' where '
                        + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' =? ',
                        [inspectionId],
                        (_, { rows } ) => {
                            response(rows)
                        },  // Success
                    );
            }, null, null);
        });
    }

    ///////////////////////////
    // Remove item from list //
    ///////////////////////////
    static deleteInspections(inspectionIds)  // inspectionIds = (1,25,6)
    {
        let db = SQLite.openDatabase(Util.ConstantHelper.db_name)
        return new Promise((response, reject) => { 
            db.transaction(
                tx => {
                    tx.executeSql(
                        'delete from ' + SQLiteDefinition.TABLES.EQUIPMENTS + ' where ' + SQLiteDefinition.FIELDS.ID + ' IN ' + inspectionIds + ';'
                    )
                    tx.executeSql(
                        'delete from ' + SQLiteDefinition.TABLES.JOBSITE + ' where ' + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' IN ' + inspectionIds + ';'
                    )
                    tx.executeSql(
                        'delete from ' + SQLiteDefinition.TABLES.COMPONENTS + ' where ' + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' IN ' + inspectionIds + ';'
                    )
                    tx.executeSql(
                        'delete from ' + SQLiteDefinition.TABLES.TEST_POINT_IMAGES + ' where ' + SQLiteDefinition.FIELDS.FK_INSPECTION_ID + ' IN ' + inspectionIds + ';'
                    )
                },
                () => {
                    return reject(false)
                },
                async () => {
    
                    // Delete image folders
                    inspectionIds = inspectionIds.replace('(', '')
                    inspectionIds = inspectionIds.replace(')', '')
                    let arrInpectionId = inspectionIds.split(',')
                    for (let i = 0; i < arrInpectionId.length; i++) {
                        let imgFolderPath = FileSystem.documentDirectory 
                            + Util.ConstantHelper.photo_save_folder + '/'
                            + arrInpectionId[i]
                        await FileSystem.deleteAsync(imgFolderPath).then((response)=>{}).catch((error)=>{})
                    }                   
                    console.log('Deleted Inspection ' + inspectionIds)
                    return response(true)
                }
            );        
        })
    }
    
}