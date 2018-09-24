import React, {Component} from 'react'
import { ScrollView, TextInput, Image, View, StyleSheet, Text } from 'react-native'
import Modal from "react-native-modal"
import { Body, Icon, Button, Footer, CardItem, Radio, ListItem, CheckBox } from "native-base";
import { fetchComponentList } from '../../redux/actions/ComponentList';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import CommonStyles from '../../styles/Common'
import Styles from '../../styles/Styles'
import UCInspectionManager from '../../business/UCInspectionManager'
import images from '../../resource'
import MockData from '../../__mock_data__/data'

class YesNoModal extends Component {

    //////////////
    // STATE
    constructor(props) {        
        super(props)   
        this.state = {
        }
    }
    
    render() {
        return (
            <Modal
                transparent={true}
                animationType={"fade"}
                isVisible={this.props.isYesNoModalVisible}
                onRequestClose={ () => { console.log('')} }>
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        backgroundColor: CommonStyles.COLOR_WHITE,
                        height: modalHeight,
                        width: modalWidth,
                        borderRadius:10,
                        paddingTop: 24
                    }}>
                        <Text style={styles.detailText}>{this.props.detailText}</Text>
                        <View style={styles.bottomButtons}>
                            <View style={styles.footerLeft}>
                                <Button
                                    style={styles.btnYes}
                                    onPress={() => {this.props._onConfirmYes()} }>
                                    <Text style={{
                                        color: CommonStyles.COLOR_WHITE,
                                        fontSize: CommonStyles.FONT_SIZE_BIGGER_REGULAR,
                                    }}>YES</Text>
                                </Button>
                            </View>
                            <View style={styles.footerRight}>
                                <Button
                                    style={styles.btnNo}
                                    onPress={() => {this.props._onConfirmNo()} }>
                                    <Text style={{
                                        color: CommonStyles.COLOR_WHITE,
                                        fontSize: CommonStyles.FONT_SIZE_BIGGER_REGULAR,
                                    }}>NO</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const modalWidth = 360
const modalHeight = 150
const styles = StyleSheet.create({
    detailText: {
        fontSize: CommonStyles.FONT_SIZE_BIGGER_REGULAR,
        alignSelf: 'center',
    },
    bottomButtons: {
        flex: 1,
        flexDirection: 'row',
    },
        footerLeft: {
            flex: 1/2,
            justifyContent: 'center',
        },
            btnYes: {
                width: 100,
                backgroundColor: CommonStyles.COLOR_BLACK,
                justifyContent: 'center',
                marginBottom: 5,
                alignSelf: 'center'
            },
        footerRight: {
            flex: 1/2,
            justifyContent: 'center',
        },
            btnNo: {
                width: 100,
                backgroundColor: CommonStyles.COLOR_RED,
                justifyContent: 'center',
                marginBottom: 5,
                alignSelf: 'center'
            },
})

export { YesNoModal }
