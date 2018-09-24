import configureStore from 'redux-mock-store'
import authReducer from '../redux/reducers/auth'
import inspectionReducer from '../redux/reducers/InspectionList'

const middlewares = []
const mockStore = configureStore( middlewares )

const initialState = {}
const store = mockStore( initialState )

beforeEach( () => {
  store.clearActions();
} );

////////////////
// LOGIN TEST

// Test by value
describe('INITIAL_STATE', () => {
    test('is correct', () => {
        const action = { type: 'dummy_action' };
        const initialState = {
            isLoggedIn: false,
            username: '',
            password: ''
        };

        expect(authReducer(undefined, action)).toEqual(initialState);
    });
});

describe('LOGIN', () => {
    test('returns the correct state', () => {
        const action = { type: 'LOGIN', username: 'tomv', password: '123456' };
        const expectedState = {
            isLoggedIn: true,
            username: 'tomv',
            password: '123456'
        };  
        expect(authReducer(undefined, action)).toEqual(expectedState);
    });
  });

// Test by snapshot
describe('INITIAL_STATE', () => {
    test('is correct', () => {
        const action = { type: 'dummy_action' };
        expect(authReducer(undefined, action)).toMatchSnapshot();
    });
});

describe('LOGIN', () => {
    test('returns the correct state', () => {
        const action = { type: 'LOGIN', username: 'tomv', password: '123456' };
        expect(authReducer(undefined, action)).toMatchSnapshot();
    });
  });


//////////////////////////////////////
// SELECT/ DESELECT INSPECTION

// Test by value
describe('SELECT/ DESELECT', () => {
    test('returns the correct state', () => {
        const action = { type: 'SELECT_DESELECT_FROM_LIST', inspectionId: '1' }
        const expectedState = {

            // Get unsynced inspections
            dataFetched: false,
            isFetching: false,
            unsyncedList: [],
        
            // Select/ deselect items
            selectedList: ["1"],
        
            // Current inspection
            currentInspection: {}
        }
        expect(inspectionReducer(undefined, action)).toEqual(expectedState);
    });
  });
