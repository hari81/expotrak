import { FileSystem, SQLite } from 'expo'

const defaultState = {
    isFetching: false,
    componentList: [],
    selectedComponent: null,
    selectedTestPoint: {},
    dealershipLimits: {},
    localToolImg: '',
}
 
export default function reducer(state = defaultState, action) {

    ////////////////
    // FETCH DATA
    if (action.type === 'SELECT_COMPONENT_LIST') {

        return {
            ...state,
            isFetching: true,
            componentList: []
        }

    } else if (action.type === 'FETCHING_COMPONENT_SUCCESS') {

        return {
            ...state,
            isFetching: false,
            componentList: action.data
        }

    } else if (action.type === 'SELECT_COMPONENT') {
        return {
            ...state,
            selectedComponent: action.data
        }

    } else if (action.type === 'SELECT_COMPONENT_TOOL') {
        return {
            ...state,
            selectedComponent: {
                ...state.selectedComponent,
                tool: action.data,
            }
        }

    } else if (action.type === 'SELECT_TEST_POINT') {
        return {
            ...state,
            selectedTestPoint: action.data,
            localToolImg: '',
        }

    } else if (action.type === 'SELECT_LOCAL_TOOL_IMAGE') {
        return {
            ...state,
            selectedTestPoint: {},
            localToolImg: action.data,
        }

    } else if (action.type === 'UPDATE_INSPECTION_COMMENT') {
        return {
            ...state,
            selectedComponent: {
                ...state.selectedComponent,
                comments: action.data,
            }
        }

    } else if (action.type === 'UPDATE_INSPECTION_READING') {
        return {
            ...state,
            selectedComponent: {
                ...state.selectedComponent,
                reading: action.reading,
                worn_percentage: action.worn,
            }
        }

    } else if (action.type === 'SELECT_DEALERSHIP_LIMITS') {
        return {
            ...state,
            dealershipLimits: action.data
        }

    } else if (action.type === 'SAVE_COMPONENT_PHOTO') {
        return {
            ...state,
            selectedComponent: {
                ...state.selectedComponent,
                inspection_image: action.data,
            }
        }

    } else if (action.type === 'REMOVE_COMPONENT_PHOTO') {
        FileSystem.deleteAsync(state.selectedComponent.inspection_image).then((response)=>{}).catch((error)=>{})
        return {
            ...state,
            selectedComponent: {
                ...state.selectedComponent,
                inspection_image: null,
            }
        }

    } else {
        return state
    }
}