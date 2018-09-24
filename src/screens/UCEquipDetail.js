import React, { Component } from 'react'
import { Image, TextInput, Platform, View, Dimensions, StyleSheet, Text } from "react-native";
import { Container, Button, Content, Drawer, Footer, Card } from "native-base";
import { connect } from 'react-redux'
import { selectCurrentInspection, updateEquipmentImg } from "../redux/actions/InspectionList";

// My classes
import { closePhotoModal } from '../redux/actions/TakePhoto'
import UCEquipDetailsManager from '../business/UCEquipDetailsManager'
import CommonStyles from '../styles/Common'
import Styles from '../styles/Styles'
import { AppHeader, ProcessBar, UCPreferenceModal } from '../components/common'
import Util from '../config/Util'
import { MyFooter } from '../components/UCEquipDetails'
import PhotoManager from '../business/PhotoManager'

class UCEquipDetail extends Component {

    ////////////////////
    // Component state
    constructor(props) {
        super(props)
        this.state = {
            isPreferenceModalVisible: false,
            current_route: this.props.navigation.state.routeName,
            smu: this.props.currentInspection.currentsmu,
            forward_hours: Util.Functions.validateString(this.props.currentInspection.travel_forward) ? this.props.currentInspection.travel_forward.toString() : '',
            reverse_hours: Util.Functions.validateString(this.props.currentInspection.travel_reverse) ? this.props.currentInspection.travel_reverse.toString() : '',
        }
    }

    componentWillMount () {

        // Re open component
        this.subs = [
            this.props.navigation.addListener('didFocus', async () => {

                // Open photo
                if (Util.Functions.validateString(this.props.navigation.state.params.photoPath))
                {
                    console.log(this.props.navigation.state.params.photoPath)
                    await PhotoManager.resizePhoto(this.props.navigation.state.params.photoPath)
                    .then((base64response) => {
                        
                        this.props.updateEquipmentImg(base64response)

                        // Reset Redux TakePhoto
                        this.props.closePhotoModal()
                    })
                    .catch((error) => {
                    })
                }
            }),
        ]
    }
    
    componentWillUnmount() {
        this.subs.forEach((sub) => {
            sub.remove();
        });
    }

    _onPressProcess = (current_route, destination_route, params = {}) => {

        if (current_route === 'UCMain' && destination_route === 'UCMain') {
            // Open modal
            this.setState({ isModalVisible: true })
            return
        }
        
        if (current_route === destination_route) return

        // Save DB
        UCEquipDetailsManager.saveEquipmentDetail(
            this.props.currentInspection.id,
            this.state.smu,
            this.state.forward_hours,
            this.state.reverse_hours,
            this.props.currentInspection.image
        ).then(
            (response) => {
                // Navigate
                this.props.navigation.navigate(destination_route, params)
            }
        )
    }

    _onPressBack = () => {
        UCEquipDetailsManager.saveEquipmentDetail(
            this.props.currentInspection.id,
            this.state.smu,
            this.state.forward_hours,
            this.state.reverse_hours,
            this.props.currentInspection.image
        ).then(
            (response) => {
                this._onPressProcess(this.state.current_route, 'UCMain')
            }
        )
    }

    _onPressNext = () => {
        UCEquipDetailsManager.saveEquipmentDetail(
            this.props.currentInspection.id,
            this.state.smu,
            this.state.forward_hours,
            this.state.reverse_hours,
            this.props.currentInspection.image
        ).then(
            (response) => {
                this._onPressProcess(this.state.current_route, 'UCEquipCondition')
            }
        )
    }

    _closePreferenceModal = () => {
        this.setState({ isPreferenceModalVisible:false })
    }

    _openPreferenceModal = () => {
        this.setState({ isPreferenceModalVisible:true })
    }

    _onTakePhoto = () => {

        // Save DB first
        UCEquipDetailsManager.saveEquipmentDetail(
            this.props.currentInspection.id,
            this.state.smu,
            this.state.forward_hours,
            this.state.reverse_hours,
            this.props.currentInspection.image
        ).then(
            (response) => {

                // Open camera
                console.log('Opening camera...');
                let params = { 
                    previousRoute: this.props.navigation.state.routeName,
                }
                this.props.navigation.navigate('Camera', params);
            }
        )
    }

    ////////////////////
    // Render UI
    render() {
        return (
            <Container style={Styles.screen}>
                <AppHeader 
                    title={'Equipment Details'} _openPreferenceModal={this._openPreferenceModal} />
                <Content style={{margin: 10}}>
                    
                    <ProcessBar route={this.state.current_route} onPress={this._onPressProcess}/>
                    <Card style={{marginTop:20, paddingBottom:30, padding: 10}}>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text>Customer Name</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.customer}/>
                            </View>
                            <View style={styles.column}>
                                <Text>Equipment No.</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.serialno}/>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text>Family</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.family}/>
                            </View>
                            <View style={styles.column}>
                                <Text>Model</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.model}/>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text>Jobsite</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.jobsite}/>
                            </View>
                            <View style={styles.column}>
                                <Text>Unit No.</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    editable={false}
                                    value={this.props.currentInspection.unitno}/>
                            </View>
                        </View>
                        <View style={styles.rowFull}>
                            <Text>SMU</Text>
                            <TextInput
                                style={styles.staticInput}
                                placeholder='SMU'
                                keyboardType = 'numeric'
                                value={this.state.smu}
                                onChangeText = { (text) => this.setState({ smu:text })} />
                        </View>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text>Forward Hours</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    value={this.state.forward_hours}
                                    placeholder='Forward Hours'
                                    keyboardType = 'numeric'
                                    onChangeText = { (text) => this.setState({ forward_hours:text })} />
                            </View>
                            <View style={styles.column}>
                                <Text>Reverse Hours</Text>
                                <TextInput
                                    style={styles.staticInput}
                                    value={this.state.reverse_hours}
                                    placeholder='Reverse Hours'
                                    keyboardType = 'numeric'
                                    onChangeText = { (text) => this.setState({ reverse_hours:text })} />
                            </View>
                        </View>
                        <Image
                            style={styles.image}
                            source={{uri: `data:image/png;base64,${this.props.currentInspection.image}`}}
                        />
                        <Button 
                            style={styles.takePhoto}
                            onPress={() => {this._onTakePhoto()} }>
                            <Text style={styles.takePhotoText}>UPDATE IMAGE</Text>
                        </Button>
                    </Card>
                </Content>
                <MyFooter
                    _onPressBack={this._onPressBack}
                    _onPressNext={this._onPressNext}
                />
                <UCPreferenceModal
                    navigation={this.props.navigation}
                    isPreferenceModalVisible={this.state.isPreferenceModalVisible}
                    _closePreferenceModal={this._closePreferenceModal} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    rowFull: {
        marginTop: 10,
        marginLeft:10,
    },
    row: {
        flexDirection: 'row',
        marginTop: 10,
    },
        column: {
            marginLeft:10,
            flex:1/2,
        },
            staticInput: {
                backgroundColor: CommonStyles.COLOR_GREY,
                width: '90%',
                height: 42,
                paddingLeft: 10,
                borderRadius: 5,
                color: CommonStyles.COLOR_BLACK,
                fontSize: CommonStyles.FONT_SIZE_BIGGER_REGULAR,
            },
    image: {
        marginTop: 20,
        width: 400,
        height: 200,
        alignSelf: 'center',
    },
    takePhoto: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: 300,
        height: 42,
        backgroundColor: CommonStyles.COLOR_RED
    },
        takePhotoText: {
            fontSize: CommonStyles.FONT_SIZE_BIGGER_REGULAR,
            color: CommonStyles.COLOR_WHITE
        }
})

const mapStateToProps = (state, ownProps) => {
    return {
        currentInspection: state.InspectionList.currentInspection,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectCurrentInspection: (equipment) => { dispatch(selectCurrentInspection(equipment)); },
        closePhotoModal: () => { dispatch(closePhotoModal()); },
        updateEquipmentImg: (image) => { dispatch(updateEquipmentImg(image)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UCEquipDetail);