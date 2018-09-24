import UCMainManager from '../../business/UCMainManager'

export const getUnsyncedList = () => {
    return {
        type: 'SELECT_UNSYNCED_LIST',
    }
}

export const getUnsyncedListSuccess = (data) => {
    return {
      type: 'FETCHING_DATA_SUCCESS',
      data: data,
    }
}

export const fetchUnsyncedList = () => {
    return (dispatch) => {
      dispatch(getUnsyncedList())
      UCMainManager.getUnsyncedEquipments()
        .then((response) => {
            dispatch(getUnsyncedListSuccess(response))
        })
        .catch((err) => console.log('err:', err))
    }
}

export const selectDeselectFromList = (inspectionId) => {
    return {
        type: 'SELECT_DESELECT_FROM_LIST',
        inspectionId: inspectionId
    }
}

export const pressRemove = () => {
    return {
        type: 'PRESS_REMOVE',
    }
}

export const selectCurrentInspection = (equipment) => {
    return {
        type: 'SELECT_CURRENT_INSPECTION',
        equipment: equipment
    }
}

export const updateEquipmentImg = (image) => {
    return {
        type: 'UPDATE_EQUIPMENT_IMAGE',
        data: image
    }
}