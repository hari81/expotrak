export const getJobsiteDetails = (value) => {
    return {
        type: 'GET_JOBSITE_DETAIL',
        value: value
    }
}

export const resetJobsiteDetails = () => {
    return {
        type: 'RESET_JOBSITE_DETAIL',
    }
}

export const updateImpact = (value) => {
    return {
        type: 'UPDATE_IMPACT',
        value: value
    }
}

export const updateAbrasive = (value) => {
    return {
        type: 'UPDATE_ABRASIVE',
        value: value
    }
}

export const updateMoisture = (value) => {
    return {
        type: 'UPDATE_MOISTURE',
        value: value
    }
}

export const updatePacking = (value) => {
    return {
        type: 'UPDATE_PACKING',
        value: value
    }
}

export const updateMeasure = (value) => {
    return {
        type: 'UPDATE_MEASURE',
        value: value
    }
}

export const updateLeftTrackSag = (value) => {
    return {
        type: 'UPDATE_LEFT_TRACK_SAG',
        value: value
    }
}

export const updateRightTrackSag = (value) => {
    return {
        type: 'UPDATE_RIGHT_TRACK_SAG',
        value: value
    }
}

export const updateLeftDryJoints = (value) => {
    return {
        type: 'UPDATE_LEFT_DRY_JOINTS',
        value: value
    }
}

export const updateRightDryJoints = (value) => {
    return {
        type: 'UPDATE_RIGHT_DRY_JOINTS',
        value: value
    }
}

export const updateLeftCannon = (value) => {
    return {
        type: 'UPDATE_LEFT_CANNON',
        value: value
    }
}

export const updateRightCannon = (value) => {
    return {
        type: 'UPDATE_RIGHT_CANNON',
        value: value
    }
}

export const updateLeftScallop = (value) => {
    return {
        type: 'UPDATE_LEFT_SCALLOP',
        value: value
    }
}

export const updateRightScallop = (value) => {
    return {
        type: 'UPDATE_RIGHT_SCALLOP',
        value: value
    }
}

export const updateInspectComment = (value) => {
    return {
        type: 'UPDATE_INSPECTION_COMMENT',
        value: value
    }
}

export const updateJobsiteComment = (value) => {
    return {
        type: 'UPDATE_JOBSITE_COMMENT',
        value: value
    }
}

export const savePhoto = (value) => {
    return {
        type: 'SAVE_PHOTO',
        value: value
    }
}

export const removePhoto = (photoType) => {
    return {
        type: 'REMOVE_PHOTO',
        photoType: photoType
    }
}
