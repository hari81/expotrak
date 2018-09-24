import { SQLite } from 'expo';

import Util from "../config/Util";

const TABLES = {
    LOG_IN:'LOG_IN',
    EQUIPMENTS:'EQUIPMENTS',
    JOBSITE:'JOBSITE',
    COMPONENTS:'COMPONENTS',
    TEST_POINT_IMAGES:'TEST_POINT_IMAGES',
    CAT_WORN_LIMITS:'CAT_WORN_LIMITS',
    ITM_WORN_LIMITS:'ITM_WORN_LIMITS',
    KOMATSU_WORN_LIMITS:'KOMATSU_WORN_LIMITS',
    HITACHI_WORN_LIMITS:'HITACHI_WORN_LIMITS',
    LIEBHERR_WORN_LIMITS:'LIEBHERR_WORN_LIMITS',
}

const FIELDS = {

    //////////
    // LOGIN
    TABLE_LOG_IN:'LOG_IN',
    TABLE_EQUIPMENTS:'EQUIPMENTS',
    USER_ID:'userid',
    PASSWORD:'password',
    REMEMBER_ME:'remember_me',

    ///////////////
    // EQUIPMENTS
    ID:'id',
    EQUIPMENTID_AUTO:'equipmentid_auto',
    CRSF_AUTO:'crsf_auto',
    SERIALNO:'serialno',
    UNITNO:'unitno',
    FAMILY:'family',
    MODEL:'model',
    CUSTOMER:'customer',
    JOBSITE:'jobsite',
    LOCATION:'location',
    IMAGE:'image',
    STATUS:'status',
    CURRENTSMU:'currentsmu',
    IS_CREATE_NEW:'is_create_new',
    CUSTOMER_AUTO:'customer_auto',
    MODEL_AUTO:'model_auto',
    UC_SERIAL_LEFT:'uc_serial_left',
    UC_SERIAL_RIGHT:'uc_serial_right',
    TRAVEL_FORWARD:'travel_forward',
    TRAVEL_REVERSE:'travel_reverse',

    ////////////////
    // JOBSITE
    UOM:'uom',
    TRACK_SAG_LEFT:'track_sag_left',
    TRACK_SAG_RIGHT:'track_sag_right',
    TRACK_SAG_LEFT_COMMENT:'track_sag_left_comment',
    TRACK_SAG_RIGHT_COMMENT:'track_sag_right_comment',
    TRACK_SAG_LEFT_IMAGE:'track_sag_left_image',
    TRACK_SAG_RIGHT_IMAGE:'track_sag_right_image',
    DRY_JOINTS_LEFT:'dry_joints_left',
    DRY_JOINTS_RIGHT:'dry_joints_right',
    EXT_CANNON_LEFT:'ext_cannon_left',
    EXT_CANNON_RIGHT:'ext_cannon_right',
    EXT_CANNON_LEFT_COMMENT:'ext_cannon_left_comment',
    EXT_CANNON_RIGHT_COMMENT:'ext_cannon_right_comment',
    EXT_CANNON_LEFT_IMAGE:'ext_cannon_left_image',
    EXT_CANNON_RIGHT_IMAGE:'ext_cannon_right_image',
    SCALLOP_LEFT:'scallop_left',
    SCALLOP_RIGHT:'scallop_right',
    IMPACT:'impact',
    ABRASIVE:'abrasive',
    MOISTURE:'moisture',
    PACKING:'packing',
    INSPECTOR_NOTE:'inspector_note',
    JOBSITE_NOTE:'jobsite_note',
    INSPECTION_DATE:'inspection_date',

    ////////////////
    // COMPONENTS
    FK_INSPECTION_ID:'inspection_id',
    FK_EQUIPMENT_ID:'equipment_id',
    EQUNIT_AUTO:'equnit_auto',
    COMPARTID_AUTO:'compartid_auto',
    COMPARTID:'compartid',
    COMPART:'compart',
    SIDE:'side',
    POSITION:'position',
    READING:'reading',
    WORN_PERCENTAGE:'worn_percentage',
    TOOL:'tool',
    METHOD:'method',
    COMPARTTYPE_AUTO:'comparttype_auto',
    COMMENTS:'comments',
    IMAGE:'image',
    INSPECTION_IMAGE:'inspection_image',
    FLANGE_TYPE:'flange_type',
    LAST_READING:'last_reading',
    LAST_WORN_PERCENTAGE:'last_worn_percentage',
    LAST_TOOL_ID:'last_tool_id',
    LAST_TOOL_SYMBOL:'last_tool_symbol',

    ///////////////////////
    // CAT_WORN_LIMITS
    CAT_TOOL:'cat_tool',
    CAT_SLOPE:'sloper',
    CAT_ADJ_TO_BASE:'adj_to_base',
    CAT_HI_INFLECTION_POINT:'hi_inflection_point',
    CAT_HI_SLOPE1:'hi_slope1',
    CAT_HI_INTERCEPT1:'hi_intercept1',
    CAT_HI_SLOPE2:'hi_slope2',
    CAT_HI_INTERCEPT2:'hi_intercept2',
    CAT_MI_INFLECTION_POINT:'mi_inflection_point',
    CAT_MI_SLOPE1:'mi_slope1',
    CAT_MI_INTERCEPT1:'mi_intercept1',
    CAT_MI_SLOPE2:'mi_slope2',
    CAT_MI_INTERCEPT2:'mi_intercept2',

    ////////////////////
    // ITM_WORN_LIMITS
    ITM_TOOL:'itm_tool',
    ITM_NEW:'start_depth_new',
    ITM_WEAR_DEPTH_10_PERCENT:'wear_depth_10_percent', 
    ITM_WEAR_DEPTH_20_PERCENT:'wear_depth_20_percent', 
    ITM_WEAR_DEPTH_30_PERCENT:'wear_depth_30_percent', 
    ITM_WEAR_DEPTH_40_PERCENT:'wear_depth_40_percent', 
    ITM_WEAR_DEPTH_50_PERCENT:'wear_depth_50_percent', 
    ITM_WEAR_DEPTH_60_PERCENT:'wear_depth_60_percent', 
    ITM_WEAR_DEPTH_70_PERCENT:'wear_depth_70_percent', 
    ITM_WEAR_DEPTH_80_PERCENT:'wear_depth_80_percent', 
    ITM_WEAR_DEPTH_90_PERCENT:'wear_depth_90_percent', 
    ITM_WEAR_DEPTH_100_PERCENT:'wear_depth_100_percent',
    ITM_WEAR_DEPTH_110_PERCENT:'wear_depth_110_percent',
    ITM_WEAR_DEPTH_120_PERCENT:'wear_depth_120_percent',

    /////////////////////////
    // KOMATSU_WORN_LIMITS
    KOMATSU_TOOL:'kom_tool',
    IMPACT_SECONDORDER:'impact_secondorder',
    IMPACT_SLOPE:'impact_slope',
    IMPACT_INTERCEPT:'impact_intercept',
    NORMAL_SECONDORDER:'normal_secondorder',
    NORMAL_SLOPE:'normal_slope',
    NORMAL_INTERCEPT:'normal_intercept',

    /////////////////////////
    // HITACHI WORN LIMITS
    HITACHI_TOOL:'hit_tool',

    /////////////////////////
    // LIEBHERR_WORN_LIMITS
    LIEBHERR_TOOL:'lie_tool',
}

class SQLiteInit {
    
    constructor() {
        this._db = SQLite.openDatabase(
            Util.ConstantHelper.db_name,
            1,  // Version
        )
        this.createConfigTable()
        this.createEquipmentTable()
        this.createJobsiteTable()
        this.createComponentsTable()
        this.createTestPointImagesTable()
        this.createCATWornLimitsTable()
        this.createITMWornLimitsTable()
        this.createKomatsuWornLimitsTable()
        this.createHitachiWornLimitsTable()
        this.createLiebherrWornLimitsTable()
        // this.createImgTable('IMAGES');
    }

    createConfigTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.LOG_IN + ' (' 
                + FIELDS.USER_ID + ' text primary key not null, ' 
                + FIELDS.PASSWORD + ' text null, '
                + FIELDS.REMEMBER_ME + ' integer not null default 0);'
                );
            });
    }

    createEquipmentTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.EQUIPMENTS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.EQUIPMENTID_AUTO + ' integer null, '
                + FIELDS.CRSF_AUTO + ' integer null, '
                + FIELDS.SERIALNO + ' text null, '
                + FIELDS.UNITNO + ' text null, '
                + FIELDS.FAMILY + ' text null, '
                + FIELDS.MODEL + ' text null, '
                + FIELDS.CUSTOMER + ' text null, '
                + FIELDS.JOBSITE + ' text null, '
                + FIELDS.LOCATION + ' integer null, '
                + FIELDS.IMAGE + ' blob null, '
                + FIELDS.STATUS + ' text null, '
                + FIELDS.CURRENTSMU + ' text null, '
                + FIELDS.IS_CREATE_NEW + ' integer null, '
                + FIELDS.CUSTOMER_AUTO + ' integer null, '
                + FIELDS.MODEL_AUTO + ' integer null, '
                + FIELDS.UC_SERIAL_LEFT + ' text null, '
                + FIELDS.UC_SERIAL_RIGHT + ' text null, '
                + FIELDS.TRAVEL_FORWARD + ' integer null, '
                + FIELDS.TRAVEL_REVERSE + ' integer null);'
                );
            });
    }

    createJobsiteTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.JOBSITE + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.FK_INSPECTION_ID + ' integer null, '
                + FIELDS.CRSF_AUTO + ' integer null, '
                + FIELDS.JOBSITE + ' text null, '
                + FIELDS.UOM + ' integer null, '
                + FIELDS.TRACK_SAG_LEFT + ' real null, '
                + FIELDS.TRACK_SAG_RIGHT + ' real null, '
                + FIELDS.DRY_JOINTS_LEFT + ' integer null, '
                + FIELDS.DRY_JOINTS_RIGHT + ' integer null, '
                + FIELDS.EXT_CANNON_LEFT + ' real null, '
                + FIELDS.EXT_CANNON_RIGHT + ' real null, '
                + FIELDS.IMPACT + ' integer null, '
                + FIELDS.ABRASIVE + ' integer null, '
                + FIELDS.MOISTURE + ' integer null, '
                + FIELDS.PACKING + ' integer null, '
                + FIELDS.INSPECTOR_NOTE + ' text null, '
                + FIELDS.JOBSITE_NOTE + ' text null, '
                + FIELDS.INSPECTION_DATE + ' text null, '
                + FIELDS.TRACK_SAG_LEFT_COMMENT + ' text null, '
                + FIELDS.TRACK_SAG_RIGHT_COMMENT + ' text null, '
                + FIELDS.EXT_CANNON_LEFT_COMMENT + ' text null, '
                + FIELDS.EXT_CANNON_RIGHT_COMMENT + ' text null, '
                + FIELDS.TRACK_SAG_LEFT_IMAGE + ' text null, '
                + FIELDS.TRACK_SAG_RIGHT_IMAGE + ' text null, '
                + FIELDS.EXT_CANNON_LEFT_IMAGE + ' text null, '
                + FIELDS.EXT_CANNON_RIGHT_IMAGE + ' text null, '
                + FIELDS.SCALLOP_LEFT + ' integer null, '
                + FIELDS.SCALLOP_RIGHT + ' integer null);'
                );
            });
    }

    createComponentsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.COMPONENTS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.FK_INSPECTION_ID + ' integer not null, '
                + FIELDS.EQUIPMENTID_AUTO + ' integer null, '
                + FIELDS.EQUNIT_AUTO + ' integer null, '
                + FIELDS.COMPARTID_AUTO + ' integer null, '
                + FIELDS.COMPARTID + ' text null, '
                + FIELDS.COMPART + ' text null, '
                + FIELDS.SIDE + ' text null, '
                + FIELDS.POSITION + ' integer null, '
                + FIELDS.READING + ' text null, '
                + FIELDS.WORN_PERCENTAGE + ' text null, '
                + FIELDS.TOOL + ' text null, '
                + FIELDS.METHOD + ' text null, '
                + FIELDS.COMPARTTYPE_AUTO + ' integer null, '
                + FIELDS.COMMENTS + ' text null, '
                + FIELDS.IMAGE + ' blob null, '
                + FIELDS.INSPECTION_IMAGE + ' blob null, '
                + FIELDS.FLANGE_TYPE + ' text null, '
                + FIELDS.LAST_READING + ' real null, '
                + FIELDS.LAST_WORN_PERCENTAGE + ' integer null, '
                + FIELDS.LAST_TOOL_ID + ' integer null, '
                + FIELDS.LAST_TOOL_SYMBOL + ' text null, '
                + 'unique(' + FIELDS.FK_INSPECTION_ID + ', ' 
                            + FIELDS.EQUIPMENTID_AUTO + ', '
                            + FIELDS.EQUNIT_AUTO + ' ));'
                );
            });
    }

    createTestPointImagesTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.TEST_POINT_IMAGES + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.FK_INSPECTION_ID + ' integer not null, '
                + FIELDS.COMPARTTYPE_AUTO + ' integer null, '
                + FIELDS.TOOL + ' text null, '
                + FIELDS.IMAGE + ' blob null, '
                + 'unique(' + FIELDS.FK_INSPECTION_ID + ', ' 
                            + FIELDS.COMPARTTYPE_AUTO + ', '
                            + FIELDS.TOOL + ' ));'
                )
            })
    }

    createCATWornLimitsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.CAT_WORN_LIMITS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.COMPARTID_AUTO + ' integer not null, '
                + FIELDS.CAT_TOOL + ' text null, '
                + FIELDS.CAT_SLOPE + ' integer null, '
                + FIELDS.CAT_ADJ_TO_BASE + ' integer null, '
                + FIELDS.CAT_HI_INFLECTION_POINT + ' integer null, '
                + FIELDS.CAT_HI_SLOPE1 + ' integer null, '
                + FIELDS.CAT_HI_INTERCEPT1 + ' integer null, '
                + FIELDS.CAT_HI_SLOPE2 + ' integer null, '
                + FIELDS.CAT_HI_INTERCEPT2 + ' integer null, '
                + FIELDS.CAT_MI_INFLECTION_POINT + ' integer null, '
                + FIELDS.CAT_MI_SLOPE1 + ' integer null, '
                + FIELDS.CAT_MI_INTERCEPT1 + ' integer null, '
                + FIELDS.CAT_MI_SLOPE2 + ' integer null, '
                + FIELDS.CAT_MI_INTERCEPT2 + ' integer null, '
                + 'unique(' + FIELDS.COMPARTID_AUTO + ', ' + FIELDS.CAT_TOOL + '));'
                )
            })
    }

    createITMWornLimitsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.ITM_WORN_LIMITS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.COMPARTID_AUTO + ' integer not null, '
                + FIELDS.ITM_TOOL + ' text null, '
                + FIELDS.ITM_NEW + ' integer null, '
                + FIELDS.ITM_WEAR_DEPTH_10_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_20_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_30_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_40_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_50_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_60_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_70_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_80_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_90_PERCENT + " integer null," 
                + FIELDS.ITM_WEAR_DEPTH_100_PERCENT + " integer null,"
                + FIELDS.ITM_WEAR_DEPTH_110_PERCENT + " integer null,"
                + FIELDS.ITM_WEAR_DEPTH_120_PERCENT + " integer null,"
                + 'unique(' + FIELDS.COMPARTID_AUTO + ', ' + FIELDS.ITM_TOOL + '));'
                )
            })
    }

    createKomatsuWornLimitsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.KOMATSU_WORN_LIMITS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.COMPARTID_AUTO + ' integer not null, '
                + FIELDS.KOMATSU_TOOL + " text not null,"
                + FIELDS.IMPACT_SECONDORDER + " integer null,"
                + FIELDS.IMPACT_SLOPE + " integer null,"
                + FIELDS.IMPACT_INTERCEPT + " integer null,"
                + FIELDS.NORMAL_SECONDORDER + " integer null,"
                + FIELDS.NORMAL_SLOPE + " integer null,"
                + FIELDS.NORMAL_INTERCEPT + " integer null,"
                + 'unique(' + FIELDS.COMPARTID_AUTO + ', ' + FIELDS.KOMATSU_TOOL + '));'
                )
            })
    }

    createHitachiWornLimitsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.HITACHI_WORN_LIMITS + ' (' 
                + FIELDS.ID + ' integer primary key autoincrement, ' 
                + FIELDS.COMPARTID_AUTO + ' integer not null, '
                + FIELDS.HITACHI_TOOL + " text not null,"
                + FIELDS.IMPACT_SLOPE + " integer null,"
                + FIELDS.IMPACT_INTERCEPT + " integer null,"
                + FIELDS.NORMAL_SLOPE + " integer null,"
                + FIELDS.NORMAL_INTERCEPT + " integer null,"
                + 'unique(' + FIELDS.COMPARTID_AUTO + ', ' + FIELDS.HITACHI_TOOL + '));'
                )
            })
    }

    createLiebherrWornLimitsTable() {
        this._db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLES.LIEBHERR_WORN_LIMITS + ' (' 
                    + FIELDS.ID + ' integer primary key autoincrement, '
                    + FIELDS.COMPARTID_AUTO + ' integer not null, '
                    + FIELDS.LIEBHERR_TOOL + " text not null,"
                    + FIELDS.IMPACT_SLOPE + " integer null,"
                    + FIELDS.IMPACT_INTERCEPT + " integer null,"
                    + FIELDS.NORMAL_SLOPE + " integer null,"
                    + FIELDS.NORMAL_INTERCEPT + " integer null,"
                + 'unique(' + FIELDS.COMPARTID_AUTO + ', ' + FIELDS.LIEBHERR_TOOL + '));'
                )
            })
    }

    // createImgTable(tableName) {
    //     this._db.transaction(tx => {
    //         tx.executeSql(
    //             'create table if not exists ' + tableName 
    //             + ' (id integer primary key not null, ' 
    //             + 'filePath);' 
    //             );
    //         });
    // }
}


export const SQLiteDefinition = {
    TABLES,
    FIELDS,
    SQLiteInit,
};

export default SQLiteDefinition