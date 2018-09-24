import { FileSystem, SQLite } from 'expo'

const defaultState = {
    "abrasive": 0,
    "crsf_auto": 0,
    "dry_joints_left": null,
    "dry_joints_right": null,
    "ext_cannon_left": null,
    "ext_cannon_left_comment": "",
    "ext_cannon_left_image": "",
    "ext_cannon_right": null,
    "ext_cannon_right_comment": "",
    "ext_cannon_right_image": "",
    "id": 0,
    "impact": 0,
    "inspection_date": "",
    "inspection_id": 0,
    "inspector_note": "",
    "jobsite": "",
    "jobsite_note": "",
    "moisture": 0,
    "packing": 0,
    "scallop_left": null,
    "scallop_right": null,
    "track_sag_left": null,
    "track_sag_left_comment": "",
    "track_sag_left_image": "",
    "track_sag_right": null,
    "track_sag_right_comment": "",
    "track_sag_right_image": "",
    "uom": 0,
}
 
export default function reducer(state = defaultState, action) {

    if (action.type === 'GET_JOBSITE_DETAIL') {

        return action.value

    } else if (action.type === 'RESET_JOBSITE_DETAIL') {

        return defaultState
        
    } else if (action.type === 'UPDATE_IMPACT') {
        
        return {
            ...state,
            impact: action.value,
        }
    } else if (action.type === 'UPDATE_ABRASIVE') {
        
        return {
            ...state,
            abrasive: action.value,
        }
    } else if (action.type === 'UPDATE_MOISTURE') {
        
        return {
            ...state,
            moisture: action.value,
        }
    } else if (action.type === 'UPDATE_PACKING') {
        
        return {
            ...state,
            packing: action.value,
        }
    } else if (action.type === 'UPDATE_MEASURE') {

        return {
            ...state,
            uom: action.value,
        }
    } else if (action.type === 'UPDATE_LEFT_TRACK_SAG') {
        
        return {
            ...state,
            "track_sag_left": action.value.input,
            "track_sag_left_comment": action.value.photoComment,
            "track_sag_left_image": action.value.photoPath,
        }
    } else if (action.type === 'UPDATE_RIGHT_TRACK_SAG') {
        
        return {
            ...state,
            "track_sag_right": action.value.input,
            "track_sag_right_comment": action.value.photoComment,
            "track_sag_right_image": action.value.photoPath
        }
    } else if (action.type === 'UPDATE_LEFT_DRY_JOINTS') {
        
        return {
            ...state,
            "dry_joints_left": action.value.input,
        }
    } else if (action.type === 'UPDATE_RIGHT_DRY_JOINTS') {
        
        return {
            ...state,
            "dry_joints_right": action.value.input,
        }
    } else if (action.type === 'UPDATE_LEFT_CANNON') {
        
        return {
            ...state,
            "ext_cannon_left": action.value.input,
            "ext_cannon_left_comment": action.value.photoComment,
            "ext_cannon_left_image": action.value.photoPath,
        }
    } else if (action.type === 'UPDATE_RIGHT_CANNON') {
        
        return {
            ...state,
            "ext_cannon_right": action.value.input,
            "ext_cannon_right_comment": action.value.photoComment,
            "ext_cannon_right_image": action.value.photoPath,
        }
    } else if (action.type === 'UPDATE_LEFT_SCALLOP') {
        
        return {
            ...state,
            "scallop_left": action.value.input,
        }
    } else if (action.type === 'UPDATE_RIGHT_SCALLOP') {
        
        return {
            ...state,
            "scallop_right": action.value.input,
        }
    } else if (action.type === 'UPDATE_INSPECTION_COMMENT') {
        
        return {
            ...state,
            "inspector_note": action.value,
        }
    } else if (action.type === 'UPDATE_JOBSITE_COMMENT') {
        
        return {
            ...state,
            "jobsite_note": action.value,
        }
    } else if (action.type === 'SAVE_PHOTO') {

        let newState = {}
        switch (action.value.type) {
            case 'left_track_sag':
                newState = {
                    ...state,
                    "track_sag_left_comment": action.value.comment,
                    "track_sag_left_image": action.value.path,}
                break
            case 'right_track_sag':
                newState = {
                    ...state,
                    "track_sag_right_comment": action.value.comment,
                    "track_sag_right_image": action.value.path,
                }
                break
            case 'left_cannon':
                newState = {
                    ...state,
                    "ext_cannon_left_comment": action.value.comment,
                    "ext_cannon_left_image": action.value.path,
                }
                break
            case 'right_cannon':
                newState = {
                    ...state,
                    "ext_cannon_right_comment": action.value.comment,
                    "ext_cannon_right_image": action.value.path,
                }
                break
            default:
                newState = {
                    ...state
                }
                break
        }

        // Update redux
        return newState
    } else if (action.type === 'REMOVE_PHOTO') {
        let newState = {}

        // Remove from Redux
        switch (action.photoType) {
            case 'left_track_sag':
                FileSystem.deleteAsync(state.track_sag_left_image).then((response)=>{}).catch((error)=>{})
                newState = {
                    ...state,
                    "track_sag_left_comment": null,
                    "track_sag_left_image": null,
                }
                break
            case 'right_track_sag':
                FileSystem.deleteAsync(state.track_sag_right_image).then((response)=>{}).catch((error)=>{})
                newState = {
                        ...state,
                        "track_sag_right_comment": null,
                        "track_sag_right_image": null,
                    }
                break
            case 'left_cannon':
                FileSystem.deleteAsync(state.ext_cannon_left_image).then((response)=>{}).catch((error)=>{})
                newState = {
                        ...state,
                        "ext_cannon_left_comment": null,
                        "ext_cannon_left_image": null,
                    }
                break
            case 'right_cannon':
                FileSystem.deleteAsync(state.ext_cannon_right_image).then((response)=>{}).catch((error)=>{})
                newState = {
                        ...state,
                        "ext_cannon_right_comment": null,
                        "ext_cannon_right_image": null,
                    }
                break
            default:
                newState = {
                    ...state
                }
                break
        }
        return newState
    } else {
        return state
    }
}