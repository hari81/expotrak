import React, { Component } from 'react'
import { ActivityIndicator, Image, Dimensions, View, TextInput, StyleSheet } from "react-native"
import { Icon, ListItem, CheckBox, Header, Button, Text, Container, Content, Card } from "native-base"
import { login } from '../redux/actions/auth';
import { connect } from 'react-redux';
import { hook } from 'cavy';
import { AsyncStorage } from "react-native"

// My classes
import APIManager from "../business/APIManager"
import { SQLiteDefinition } from "../database/SQLiteDefinition";
import SQLiteManager from "../database/SQLiteManager";
import LoginManager from '../business/LoginManager'
import CommonStyles from '../styles/Common'
import Util from '../config/Util'

class Login extends Component {

    /////////////////////
    // State control
    constructor(props) {
        super(props)
      
        this.state = {
            loading: false,
            username: "",
            password: "",
            login: 0,   // 0: Not login, 1: Success, 2: Failed
            checked: false,
        }
    }

    componentWillMount = () => {
        // DB 
        console.log('Initialize database');
        new SQLiteDefinition.SQLiteInit();
        SQLiteManager.exportDbFile();
    }

    ////////////////////
    // Internal logics
    _onPressLogin = () => {
        
        console.log('Logging in');
        
        // Loader
        this.setState({ loading: true });

        //////////////
        // MOCK DATA
        // this.props.onLogin(this.state.username, this.state.password)
        // LoginManager.saveLoggedIn(
        //     this.state.username,
        //     this.state.password,
        //     this.state.checked == false ? 0 : 1
        // )
        // this.setState({ loading: false });

        //////////////
        // REAL DATA
        // Call API
        APIManager.AuthenticateUser(
            this.state.username,
            this.state.password
        ).then((response) => {

            // Failure
            if (response == false)
            {
                this.setState({ login: 2 });
            } else {
                // Success
                this.props.onLogin(this.state.username, this.state.password)  // save to redux

                // Save DB
                LoginManager.saveLoggedIn(
                    this.state.username,
                    this.state.password,
                    this.state.checked == false ? 0 : 1
                )

                // Get user preference
                APIManager.GetUserPreference(this.state.username)
                .then(async (response) => {
                    
                    // Save DB
                    let uom = response.UndercarriagUOM
                    if (uom.toLowerCase().trim() === 'mm')
                        uom = 1
                    else
                        uom = 0
                    try {
                        await AsyncStorage.setItem('serverUOM', uom.toString());
                    } catch (error) {
                        // Error saving data
                        console.log(error)
                    }
                })
            }

            // Loader
            this.setState({ loading: false });
        })
    }

    ////////////////
    // Render UI
    render() {
        return (
            <Container style={{backgroundColor: CommonStyles.COLOR_WHITE}}>
                <Header style={styles.header}>
                    <Text style={styles.loginText}>Login</Text>
                </Header>
                <Content>
                    <View style={styles.container}>
                        <Image 
                                style={styles.loginImg}
                                source={require('../resource/tt_logo.png')}/>
                        { this.state.login == 2
                            ? <Text style={styles.loginFailed}>Login failed</Text>
                            : null }
                        <View style={{flex:1}}>
                            <Icon style={[{fontSize: 30}, styles.inlineUsrIcon]} name='ios-person' />
                            <TextInput
                                ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('Login.username') : ''}
                                style={styles.inputUsr}
                                placeholder = {'User name'}
                                onChangeText = { (text) => this.setState({username:text})} />
                        </View>
                        <View style={{flex:1}}>
                            <Icon style={[{fontSize: 30}, styles.inlinePassIcon]} name='ios-unlock' />
                            <TextInput
                                ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('Login.password') : ''}
                                secureTextEntry={true}
                                style={styles.inputPass}
                                placeholder = {'Password'}
                                onChangeText = { (text) => this.setState({password:text})} />
                        </View>
                        <ListItem>
                            <CheckBox
                                checked={this.state.checked}
                                onPress={() => this.setState({ checked: !this.state.checked })} />
                            <Text style={{marginLeft: 3}}>Remember me</Text>
                        </ListItem>
                        <Button
                            ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('Login.btnLogin') : ''}
                            style={styles.btnLogin}
                            disabled={this.state.loading 
                                ? true
                                : false}
                            onPress={() => this._onPressLogin()}>
                            {this.state.loading 
                                ? (<ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color={CommonStyles.COLOR_WHITE}/>)
                                : (<Text>Login</Text>)}
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

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

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
    header: {
        backgroundColor: CommonStyles.COLOR_BLACK,
        height:80,
        alignItems: 'center'
    },
        loginText: {
            color: CommonStyles.COLOR_WHITE,
            fontSize: CommonStyles.FONT_SIZE_LARGE,
            fontWeight: 'bold',
            alignSelf: 'center'
        },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height / 7,
    },
        loginImg: {
            height: 60,
            resizeMode: Image.resizeMode.contain,
        },
        loginFailed: {
            alignSelf: 'center',
            color: 'red'
        },
        inlineUsrIcon: {
            position: 'absolute',
            zIndex: 99,
            width: 22,
            height: 22,
            left: 35,
            top: 7,
        },
        inputUsr: {
            backgroundColor: CommonStyles.COLOR_GREY,
            width: DEVICE_WIDTH - 80,
            height: 42,
            marginHorizontal: 20,
            paddingLeft: 45,
            borderRadius: 20,
            color: CommonStyles.COLOR_BLACK,
        },
        inlinePassIcon: {
            position: 'absolute',
            zIndex: 99,
            width: 22,
            height: 28,
            left: 35,
            top: 7,
        },
        inputPass: {
            marginTop: 5,
            backgroundColor: CommonStyles.COLOR_GREY,
            width: DEVICE_WIDTH - 80,
            height: 42,
            marginHorizontal: 20,
            paddingLeft: 45,
            borderRadius: 20,
            color: CommonStyles.COLOR_BLACK,
        },
        btnLogin: {
            backgroundColor: CommonStyles.COLOR_RED,
            marginTop: 15,
            width: 150,
            justifyContent: 'center',
            alignSelf: 'center',
        },
});

const TestableLogin = hook(Login)
export default connect(mapStateToProps, mapDispatchToProps)(
    Util.ConstantHelper.isTest ? TestableLogin : Login
)