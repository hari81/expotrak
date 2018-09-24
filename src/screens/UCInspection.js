import React, { Component } from 'react'
import { TextInput, Button, Platform, View, Dimensions, StyleSheet, Text } from "react-native"
import { Card, Drawer, Container, Header, Content, Left, Footer, Spinner } from "native-base"
import { connect } from 'react-redux'
import { fetchComponentList, getDealershipLimits } from '../redux/actions/ComponentList'
import Swiper from 'react-native-swiper'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'

// My classes
import UCInspectionManager from "../business/UCInspectionManager";
import { closePhotoModal, openPhotoModal } from '../redux/actions/TakePhoto'
import CommonStyles from '../styles/Common'
import Styles from '../styles/Styles'
import { AppHeader, ProcessBar, UCPreferenceModal } from '../components/common'
import Util from '../config/Util'
import { PhotoModal, MyFooter, InspectionModal, ComponentList } from '../components/UCInspection'
import UCSideBar from '../screens/UCSideBar'

class UCInspection extends Component {

    ////////////////////
    // Component state
    constructor(props) {
        
        super(props)
        this.state = {
            current_route: this.props.navigation.state.routeName,
            isModalVisible: false,
            isPhotoModalVisible: false,
            isPreferenceModalVisible: false,
        }
    }

    componentWillMount () {
        
        // Load dealership limits
        UCInspectionManager.DownloadDealershipLimits()
        .then ((result) => {
            this.props.getDealershipLimits(result)
        })
    }

    componentDidMount () {

        // Re open component
        this.subs = [
            this.props.navigation.addListener('didFocus', () => {

                // Open photo modal
                if (Util.Functions.validateString(this.props.navigation.state.params.photoPath))
                {
                    // Reopen modal
                    this._reOpenModal()

                } else {
                    
                    // Load component detail
                    this.props.fetchComponentList(this.props.currentInspection.id)
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

        this.props.navigation.navigate(destination_route, params)
    }

    ///////////////////////
    // Screen controllers
    _onPressBack = () => {
        this._onPressProcess(this.state.current_route, 'UCEquipCondition')
    }

    _onPressNext = () => {
        this._onPressProcess(this.state.current_route, 'UCMain')
    }

    ////////////////////////////////
    // Component modal controllers
    _onRequestSave = () => {
        // Save DB
        UCInspectionManager.saveComponentDetail(
            this.props.currentInspection.id,
            this.props.selectedComponent.equnit_auto,
            this.props.selectedComponent)
        .then(
            (response) => {

                // Load component detail
                this.props.fetchComponentList(this.props.currentInspection.id)

                // Close modal
                this._onRequestClose()
            }
        )        
    }

    _onRequestClose = () => {
        // Load component detail
        this.props.fetchComponentList(this.props.currentInspection.id)
        this.setState({ isModalVisible: false })
    }

    _onPressComponent = () => {
        this.setState({ isModalVisible: true })
    }

    ////////////////////////////
    // Photo modal controllers
    _openPhotoModal = (inspectionImage) => {

        // Open modal
        this.setState({ 
            isPhotoModalVisible: true,
        })

        // Update Redux
        let photoInfo = {
            type: '',
            path: inspectionImage,
            title: '',
            comment: '',
        }
        this.props.openPhotoModal(photoInfo)
    }

    _closePhotoModal = () => {

        // Save DB
        UCInspectionManager.saveComponentDetail(
            this.props.currentInspection.id,
            this.props.selectedComponent.equnit_auto,
            this.props.selectedComponent)
        .then(
            (response) => {

                // Close modal
                this.setState({ 
                    isPhotoModalVisible: false,
                })

                // Reset Redux TakePhoto
                this.props.closePhotoModal()
            }
        )
    }

    _openCamera = () => {
        
        // Close modal
        this.setState({ 
            isPhotoModalVisible: false,
        })

        setTimeout(()=>{

            // Close component modal
            this.setState({
                isModalVisible: false
            })

            setTimeout(()=>{
                // Open camera
                console.log('Opening camera...');
                let params = { 
                    previousRoute: this.props.navigation.state.routeName,
                }
                this.props.navigation.navigate('Camera', params);
            }, 600)
        }, 600);
    }

    _reOpenModal = () => {

        console.log('re open modal')

        // Re-open component modal
        this._onPressComponent()

        // Re-open photo modal
        this.setState({ 
            isPhotoModalVisible: true,
        })
    }

    _closePreferenceModal = () => {
        this.setState({ isPreferenceModalVisible:false })
    }

    _openPreferenceModal = () => {
        this.setState({ isPreferenceModalVisible:true })
    }

    ////////////////////
    // Render UI
    render() {
        return (
            <Container style={Styles.screen}>
                <AppHeader title={'Inspection'} openDrawer={this.openDrawer} _openPreferenceModal={this._openPreferenceModal} />
                <View style={{marginTop: 10}}>
                    <ProcessBar route={this.state.current_route} onPress={this._onPressProcess}/>
                </View>
                <Swiper
                    dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 0, height: 0, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                    activeDot={<View style={{backgroundColor: '#fff', width: 0, height: 0, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                    paginationStyle={{
                        bottom: 70
                    }}
                    loop={false}
                    >
                    <Content style={{margin: 10}}>
                        <Card style={styles.header}>
                            <Text style={{color: CommonStyles.COLOR_WHITE, fontSize: CommonStyles.FONT_SIZE_MEDIUM}}>
                                LEFT SIDE
                            </Text>
                        </Card>
                        <View style={{marginTop:-2}}>
                            {this.props.isFetching
                                ? <Spinner color={CommonStyles.COLOR_BLUE}/>
                                : <ComponentList
                                    side={'Left'}
                                    _onPressComponent={this._onPressComponent}
                                />}
                        </View>
                    </Content>                    
                    <Content style={{margin: 10}}>
                    <Card style={styles.header}>
                            <Text style={{color: CommonStyles.COLOR_WHITE, fontSize: CommonStyles.FONT_SIZE_MEDIUM}}>
                                RIGHT SIDE
                            </Text>
                        </Card>
                        <View style={{marginTop:-2}}>
                            {this.props.isFetching
                                ? <Spinner color={CommonStyles.COLOR_BLUE}/>
                                : <ComponentList
                                    side={'Right'}
                                    _onPressComponent={this._onPressComponent}
                                />}
                        </View>
                    </Content>
                </Swiper>
                <MyFooter
                    _onPressBack={this._onPressBack}
                    _onPressNext={this._onPressNext}/>
                {/**************************************** Component Modal */}
                {this.state.isModalVisible
                ? <InspectionModal
                    _openPhotoModal={this._openPhotoModal}
                    isModalVisible={this.state.isModalVisible}
                    _onRequestClose={this._onRequestClose}
                    _onRequestSave={this._onRequestSave}

                    showPhotoModal={this.state.isPhotoModalVisible}
                    _closePhotoModal={this._closePhotoModal}
                    _openCamera={this._openCamera}
                    navigation = {this.props.navigation} />
                : null}

                <UCPreferenceModal
                    navigation={this.props.navigation}
                    isPreferenceModalVisible={this.state.isPreferenceModalVisible}
                    _closePreferenceModal={this._closePreferenceModal} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonStyles.COLOR_BLACK
    }
});


const mapStateToProps = (state, ownProps) => {
    return {
        currentInspection: state.InspectionList.currentInspection,
        isFetching: state.ComponentList.isFetching,
        selectedComponent: state.ComponentList.selectedComponent,
        dealershipLimits: state.ComponentList.dealershipLimits,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchComponentList: (inspectionId) => { dispatch(fetchComponentList(inspectionId)); },
        closePhotoModal: () => { dispatch(closePhotoModal()); },
        openPhotoModal: (value) => { dispatch(openPhotoModal(value)); },
        getDealershipLimits: (value) => { dispatch(getDealershipLimits(value)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UCInspection);
