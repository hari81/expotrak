import { combineReducers } from 'redux'
import auth from './auth'
import InspectionList from './InspectionList'
import ComponentList from './ComponentList'
import TakePhoto from './TakePhoto'
import Jobsite from './Jobsite'
 
const rootReducer = combineReducers({
    auth,
    InspectionList,
    ComponentList,
    TakePhoto,
    Jobsite,
})
 
export default rootReducer