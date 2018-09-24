import React, {Component} from 'react';
import { Provider, connect } from 'react-redux';
import store from './redux';
import Expo from "expo";
import TestableApp from '../cavy/testable-app';

import { MainNavigator } from './config/route';
import { Util } from './config/Util';
import LoginManager from './business/LoginManager'
import { login } from './redux/actions/auth';

class RootContainer extends Component {

  constructor(props) {
    super(props)

    // Check if user logged in and remembered
    LoginManager.getLoggedIn()
    .then((response) => {
      
      console.log(response)
      
      if (response !== null && response.remember_me == 1) 
        this.props.onLogin(response.userid, response.password)  // save to redux
    })

    // Expo bug
    this.state = {
      isReady: false
    }
  }

  componentWillMount() {    
    // Expo bug
    this.loadFonts();
  }
  
  async loadFonts() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }

  render() {

    // Expo bug
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    console.log(Util.Functions.getCurrentTimeStamp());

    const Layout = MainNavigator(this.props.isLoggedIn);
    if (Util.ConstantHelper.isTest)
      return (<TestableApp>
            <Layout />
          </TestableApp>)
    else
      return <Layout />
  }
}

//////////////
// Redux
const mapStateToProps = (state, ownProps) => {
  return {
      isLoggedIn: state.auth.isLoggedIn
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      onLogin: (username, password) => { dispatch(login(username, password)); },
  }
}
const ConnectedRootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainer);

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <ConnectedRootContainer />
        </Provider>
    );
  }
}

export default App;
