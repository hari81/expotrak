import { FileSystem, ImageManipulator } from 'expo';
import Util from "../config/Util";
import _db from "../database/SQLiteManager";

export default class PhotoManager {
    
    constructor() {
    }

    static async savePhoto(inspectionId, photo) {

        // Save actual file
        let filePath = FileSystem.documentDirectory 
            + Util.ConstantHelper.photo_save_folder 
            + '/' + inspectionId 
            + '/' + Util.Functions.getCurrentTimeStamp() + '.jpg'

        await FileSystem.moveAsync({
            from: photo.uri,
            to: filePath,
        });

        // // Write DB
        // await _db.insertImageRecord(filePath);

        return filePath;
    }

    static async resizePhoto(photoPath) {

        // Resize
        const manipResult = await ImageManipulator.manipulate(
            photoPath,
            [{ resize: { width:800 }}],
            { base64: true }
        );

        // Overwrite old photo
        await FileSystem.moveAsync({
            from: manipResult.uri,
            to: photoPath,
        });

        // Return base64 data
        return manipResult.base64;
    }

}