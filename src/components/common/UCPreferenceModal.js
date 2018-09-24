import React, {Component} from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import Modal from "react-native-modal"
import { List, Icon, ListItem } from "native-base";
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'
import * as authActions from '../../redux/actions/auth';

import CommonStyles from '../../styles/Common'
import Styles from '../../styles/Styles'

const routes = [
    "Home",
    "Logout"
]


class UCPreferenceModalClass extends Component {
    
    _navigateScreen = (data) => {
        switch(data) {
          case 'Home':
            this.props.navigation.navigate('UCMain')
            break
          case 'Logout':
            // Update Redux
            this.props.logout()
            break
        }
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={"fade"}
                isVisible={this.props.isPreferenceModalVisible}
                onRequestClose={ () => { console.log('')} }>
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => { 
                                this.props._closePreferenceModal()
                            }}>
                            <Icon style={{color: CommonStyles.COLOR_WHITE, fontSize: 38}} name='ios-close-circle' />
                        </TouchableOpacity>
                        <Text style={styles.username}>{this.props.username}</Text>
                        <List
                            dataArray={routes}
                            renderRow={data => {
                                return (
                                    <View>
                                        <ListItem
                                            button
                                            onPress={() => this._navigateScreen(data)}>
                                            <Icon style={styles.icon} name={
                                                data === 'Home'
                                                ? 'md-home' : 'md-log-out'
                                            } />
                                            <Text style={styles.text}>{data}</Text>
                                        </ListItem>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
}

const modalWidth = 260
const modalHeight = 150
const styles = StyleSheet.create({
    modal: {
        flex:1,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        alignSelf: 'flex-end',
        marginTop: -2,
        position: 'absolute',
        zIndex: 99,
    },
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(238, 108, 108, 0.8)',
        height: modalHeight,
        width: modalWidth,
        borderRadius:10,
    },
      username: {
        color: '#ffffff', fontSize: 18, fontWeight: 'bold', paddingTop: 10, alignSelf: 'center'
      },
      icon: {
        fontSize: 26, 
        marginRight: 15, 
        color: CommonStyles.COLOR_WHITE,
        fontWeight: 'bold'
      },
      text: {
        color: CommonStyles.COLOR_WHITE,
        fontWeight: 'bold'
      }
  })
  
const mapStateToProps = (state, ownProps) => {
return {
    isLoggedIn: state.auth.isLoggedIn,
    username: state.auth.username,
};
}

const mapDispatchToProps = (dispatch) => {
return {
    logout: () => { dispatch(authActions.logout()); },
}
}

const UCPreferenceModal = connect(mapStateToProps, mapDispatchToProps)(UCPreferenceModalClass);

export { UCPreferenceModal }
