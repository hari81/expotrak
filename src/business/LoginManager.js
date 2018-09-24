import { Util } from "../config/Util";
import SQLiteManager from "../database/SQLiteManager";

export default class LoginManager {
        
    constructor() {

    }

    static async getLoggedIn() {
        let result = null
        await SQLiteManager.selectLoggedIn()    
        .then((response) => {
            if (response != null && response._array.length > 0)
            {
                result = response._array[0]
            }          
        });

        return result
    }

    static saveLoggedIn(username, password, checked) {
        SQLiteManager.deleteConfigTable();
        SQLiteManager.insertLoginRecord(
            username,
            password,
            checked
        );
    }

}