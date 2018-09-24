import UCInspectionManager from '../../business/UCInspectionManager'

export const getComponentList = () => {
    return {
        type: 'SELECT_COMPONENT_LIST',
    }
}

export const getComponentListSuccess = (data) => {
    return {
      type: 'FETCHING_COMPONENT_SUCCESS',
      data: data,
    }
}

export const fetchComponentList = (inspectionId) => {
    return (dispatch) => {
      dispatch(getComponentList())
      UCInspectionManager.getComponentList(inspectionId)
        .then((response) => {
            dispatch(getComponentListSuccess(response))
        })
        .catch((err) => console.log('err:', err))
    }
}

export const selectComponent = (item) => {
    return {
        type: 'SELECT_COMPONENT',
        data: item,
      }  
}

export const selectTool = (tool) => {
    return {
        type: 'SELECT_COMPONENT_TOOL',
        data: tool
    }
}

export const updateComment = (comment) => {
    return {
        type: 'UPDATE_INSPECTION_COMMENT',
        data: comment
    }
}

export const updateReading = (reading, worn) => {
    return {
        type: 'UPDATE_INSPECTION_READING',
        reading: reading,
        worn: worn
    }
}

export const getTestPoint = (value) => {
    return {
        type: 'SELECT_TEST_POINT',
        data: value
    }
}

export const getLocalToolImg = (value) => {
    return {
        type: 'SELECT_LOCAL_TOOL_IMAGE',
        data: value
    }
}

export const getDealershipLimits = (value) => {
    return {
        type: 'SELECT_DEALERSHIP_LIMITS',
        data: value
    }
}

export const savePhoto = (photoPath) => {
    return {
        type: 'SAVE_COMPONENT_PHOTO',
        data: photoPath
    }
}

export const removePhoto = () => {
    return {
        type: 'REMOVE_COMPONENT_PHOTO',
    }
}
