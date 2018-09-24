const defaultState = {
    type: '',
    path: '',
    title: '',
    comment: '',
}
 
export default function reducer(state = defaultState, action) {

    if (action.type === 'OPEN_PHOTO_MODAL') {
        
        return action.value

    } else if (action.type === 'CLOSE_PHOTO_MODAL') {
        
        return {
            type: '',
            path: '',
            title: '',
            comment: '',
        }

    } else if (action.type === 'TAKE_PHOTO') {

        return {
            ...state,
            path: action.path,
        }

    } else if (action.type === 'UPDATE_PHOTO_COMMENT') {

        return {
            ...state,
            comment: action.value,
        }

    } else {
        return state
    }
}