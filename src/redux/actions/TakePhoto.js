export const openPhotoModal = (value) => {
    return {
        type: 'OPEN_PHOTO_MODAL',
        value: value
    }
}

export const closePhotoModal = () => {
    return {
        type: 'CLOSE_PHOTO_MODAL',
    }
}

export const takePhoto = (filePath) => {
    return {
        type: 'TAKE_PHOTO',
        path: filePath
    }
}

export const updateComment = (text) => {
    return {
        type: 'UPDATE_PHOTO_COMMENT',
        value: text
    }
}