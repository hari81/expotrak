import * as firebase from 'firebase';
import Util from '../config/Util'

// Initialize Firebase
const config = {
    apiKey: Util.ConstantHelper.FIREBASE_API_KEY,
    authDomain: Util.ConstantHelper.FIREBASE_AUTH_DOMAIN,
    databaseURL: Util.ConstantHelper.FIREBASE_DATABASE_URL,
    projectId: Util.ConstantHelper.FIREBASE_PROJECT_ID,
    storageBucket: Util.ConstantHelper.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Util.ConstantHelper.FIREBASE_MESSAGING_SENDER_ID
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export function writeFirebaseSyncData(syncData) {
    firebase.database().ref('UCInspectionList/').push(syncData)
    .then((data)=>{
        console.log('data ' , data)
    }).catch((error)=>{
        console.log('error ' , error)
    })
}

export function writeFirebaseSyncResult(syncResult) {
    firebase.database().ref('UCSyncResults/').push(syncResult)
    .then((data)=>{
        console.log('data ' , data)
    }).catch((error)=>{
        console.log('error ' , error)
    })
}

export async function uploadFileToFirebase(srcFilePath, destFolder) {

    console.log('Upload db file...' + srcFilePath)

    // Folder name
    // let folderName = Util.Functions.getCurrentTimeStamp()
    let fileName = Util.Functions.getFileNameFromPath(srcFilePath)

    // console.log('Upload db file...' + folderName + "/" + fileName)

    let storageRef = firebase.storage().ref(destFolder + "/" + fileName)

    const response = await fetch(srcFilePath)
    const blob = await response.blob()
    await storageRef.put(blob)
    .then((data)=>{
        console.log('data ' , data)
    }).catch((error)=>{
        console.log('error ' , error)
    })
}

export async function backupToFirebase() {

    let destFolder = Util.Functions.getCurrentTimeStamp()

    // Save DB file
    let filePath = Expo.FileSystem.documentDirectory + '/SQLite/' + Util.ConstantHelper.db_name
    await uploadFileToFirebase(filePath, destFolder)
        .then((response) => {}).catch((error) => {})

    // Save image files
    let imgFolderPath = Expo.FileSystem.documentDirectory 
            + Util.ConstantHelper.photo_save_folder 
    let folderArray = await Expo.FileSystem.readDirectoryAsync(imgFolderPath)
    folderArray.map(async (item, index, array) => {

        // Get files in folder
        let fileArray = await Expo.FileSystem.readDirectoryAsync(imgFolderPath + '/' + item)
        fileArray.map(async (fileName, index, array) => {
            let srcFilePath = imgFolderPath + '/' + item + '/' + fileName
            await uploadFileToFirebase(srcFilePath, destFolder + '/' + item)
        })
    })
}

export function writeFirebaseLog(message) {
    firebase.database().ref('logs/').push(message)
    .then((data)=>{
        console.log('data ' , data)
    }).catch((error)=>{
        console.log('error ' , error)
    })
}