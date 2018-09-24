import configureStore from 'redux-mock-store'

import * as authActions from '../redux/actions/auth'
import * as inspectionActions from '../redux/actions/InspectionList'

const middlewares = []
const mockStore = configureStore( middlewares )

const initialState = {}
const store = mockStore( initialState )

beforeEach( () => {
  store.clearActions();
} );

afterEach( () => {
  expect( store.getActions() ).toMatchSnapshot();
} )

////////////////
// LOGIN TEST

// Test by value
test('Dispatches the correct action and payload', () => {    
    store.dispatch(authActions.login('tomv', '123456'))    
    const expectedAction = [{
        "type": "LOGIN",
        "username": "tomv",
        "password": "123456",
    }]; 
    expect(store.getActions()).toEqual(expectedAction)
})

// Test by snapshot
test('Dispatches the correct action and payload', () => {    
    store.dispatch(authActions.login('tomv', '123456'))    
    expect(store.getActions()).toMatchSnapshot()

})

/////////////////////////////////
// SELECT/ DESELECT INSPECTION
test('Dispatches the correct action and payload', () => {    
    store.dispatch(inspectionActions.selectDeselectFromList(1))
    const expectedAction = [{
        type: 'SELECT_DESELECT_FROM_LIST',
        inspectionId: 1
    }]; 
    expect(store.getActions()).toEqual(expectedAction)
})
