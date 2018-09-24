import React, { Component } from 'react'
import { TextInput, Button, Platform, View, Dimensions, StyleSheet, Text } from "react-native";
import { Drawer, Container, Header, Content, Left, Footer, Card, CardItem, Body, CheckBox } from "native-base";
import { connect } from 'react-redux'
import { getJobsiteDetails, updateMeasure } from '../redux/actions/Jobsite'
import { getPhotoInfo, openPhotoModal, closePhotoModal, takePhoto } from '../redux/actions/TakePhoto'
import { AsyncStorage } from "react-native"

// My classes
import UCEquipConditionManager from "../business/UCEquipConditionManager";
import SQLiteDefinition from '../database/SQLiteDefinition'
import CommonStyles from '../styles/Common'
import Styles from '../styles/Styles'
import { AppHeader, ProcessBar, UCPreferenceModal } from '../components/common'
import Util from '../config/Util'
import { PhotoModal, MyFooter, JobsiteMeasure, OtherMeasure, Comments } from '../components/UCEquipCondition'

class UCEquipCondition extends Component {

    ////////////////////
    // Component state
    constructor(props) {
        
        super(props)
        this.state = {
            isPreferenceModalVisible: false,
            current_route: this.props.navigation.state.routeName,
            smu: null,
            forward_hours: null,
            reverse_hours: null,
            showPhotoModal: false,
        }
    }

    componentWillMount () {

        // Re open component
        this.subs = [
            this.props.navigation.addListener('didFocus', () => {

                // Load jobsite detail
                UCEquipConditionManager.getJobsiteDetail(this.props.currentInspection.id)
                .then (
                    async (response) => {
                        if (response !== null)
                            // Jobsite was inserted
                            this.props.getJobsiteDetails(response)
                        else {
                            // Jobsite hasn't been inserted
                            // Get uom from server
                            try {
                                let serverUOM = await AsyncStorage.getItem('serverUOM');
                                if (serverUOM !== null) {
                                    this.props.updateMeasure(Number(serverUOM))
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                )

                // Open photo modal
                if (Util.Functions.validateString(this.props.navigation.state.params.photoPath))
                {
                    // Reopen modal
                    console.log('Reopen modal')
                    this._reOpenModal()

                    // Clear state
                    this.props.navigation.state.params.photoPath = ''
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
        UCEquipConditionManager.saveJobsiteDetail(
            this.props.currentInspection.id,
            this.props.currentInspection.crsf_auto,
            this.props.currentInspection.jobsite,
            this.props.jobsiteData)

        this.props.navigation.navigate(destination_route, params)
    }

    _onPressBack = () => {

        // Save DB
        UCEquipConditionManager.saveJobsiteDetail(
            this.props.currentInspection.id,
            this.props.currentInspection.crsf_auto,
            this.props.currentInspection.jobsite,
            this.props.jobsiteData)

        // Navigation
        this._onPressProcess(this.state.current_route, 'UCEquipDetail')
    }

    _onPressNext = () => {

        // Save DB
        UCEquipConditionManager.saveJobsiteDetail(
            this.props.currentInspection.id,
            this.props.currentInspection.crsf_auto,
            this.props.currentInspection.jobsite,
            this.props.jobsiteData)

        // Navigation
        this._onPressProcess(this.state.current_route, 'UCInspect')
    }

    _reOpenModal = () => {
        this.setState({ 
            showPhotoModal: true,
        })
    }

    _openPhotoModal = (photoType) => {

        // Save DB
        UCEquipConditionManager.saveJobsiteDetail(
            this.props.currentInspection.id,
            this.props.currentInspection.crsf_auto,
            this.props.currentInspection.jobsite,
            this.props.jobsiteData)
        
        // Open modal
        this.setState({ 
            showPhotoModal: true,
        })

        // Update Redux
        let photoInfo = {
            type: photoType,
            path: '',
            title: '',
            comment: '',
        }
        switch (photoType) {
            case 'left_track_sag':
                photoInfo = {
                    ...photoInfo,
                    comment: this.props.jobsiteData.track_sag_left_comment,
                    path: this.props.jobsiteData.track_sag_left_image,
                }
                break
            case 'right_track_sag':
                photoInfo = {
                    ...photoInfo,
                    comment: this.props.jobsiteData.track_sag_right_comment,
                    path: this.props.jobsiteData.track_sag_right_image,
                }
                break
            case 'left_cannon':
                photoInfo = {
                    ...photoInfo,
                    comment: this.props.jobsiteData.ext_cannon_left_comment,
                    path: this.props.jobsiteData.ext_cannon_left_image,
                }
                break
            case 'right_cannon':
                photoInfo = {
                    ...photoInfo,
                    comment: this.props.jobsiteData.ext_cannon_right_comment,
                    path: this.props.jobsiteData.ext_cannon_right_image,
                }
                break
            default:
                break
        }
        this.props.openPhotoModal(photoInfo)
    }

    _closePhotoModal = () => {

        // Save DB
        UCEquipConditionManager.saveJobsiteDetail(
            this.props.currentInspection.id,
            this.props.currentInspection.crsf_auto,
            this.props.currentInspection.jobsite,
            this.props.jobsiteData)
        .then(
            (response) => {

                // Close modal
                this.setState({ 
                    showPhotoModal: false,
                })

                // Reset Redux TakePhoto
                this.props.closePhotoModal()
            }
        )
    }

    _openCamera = () => {
        
        this.setState({ 
            showPhotoModal: false,
        })

        setTimeout(()=>{
            // Open camera
            console.log('Opening camera...');
            let params = { 
                previousRoute: this.props.navigation.state.routeName,
            }
            this.props.navigation.navigate('Camera', params);
        }, 600)
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
                <AppHeader 
                    title={'Equipment Conditions'}
                    openDrawer={this.openDrawer}
                    _openPreferenceModal={this._openPreferenceModal} />
                <Content style={{margin: 10}}>
                    
                    <ProcessBar route={this.state.current_route} onPress={this._onPressProcess}/>
                    <Card style={styles.header}>
                        <Text style={{color: CommonStyles.COLOR_WHITE, fontSize: CommonStyles.FONT_SIZE_MEDIUM}}>
                            {this.props.currentInspection[SQLiteDefinition.FIELDS.JOBSITE]}
                        </Text>
                    </Card>
                    <Card style={{marginTop:-2, padding: 10}}>
                        <JobsiteMeasure />
                    </Card>
                    <Card style={{marginTop:10, padding: 10}}>
                        <OtherMeasure _openPhotoModal={this._openPhotoModal} />
                    </Card>
                    <Card style={{marginTop:10, padding: 10}}>
                        <Comments />
                    </Card>

                </Content>
                <MyFooter
                    _onPressBack={this._onPressBack}
                    _onPressNext={this._onPressNext}
                />

                {/**************************************** Photo Modal */}
                <PhotoModal
                    showPhotoModal={this.state.showPhotoModal}
                    _closePhotoModal={this._closePhotoModal}
                    _openCamera={this._openCamera}
                    navigation = {this.props.navigation}
                    />

                {/**************************************** Preference Modal */}
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
})

const mapStateToProps = (state, ownProps) => {
    return {
        currentInspection: state.InspectionList.currentInspection,
        photoType: state.TakePhoto.type,
        photoPath: state.TakePhoto.path,
        jobsiteData: state.Jobsite,
    }
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        openPhotoModal: (photoType) => { dispatch(openPhotoModal(photoType)); },
        closePhotoModal: () => { dispatch(closePhotoModal()); },
        takePhoto: (filePath) => { dispatch(takePhoto(filePath)); },
        getJobsiteDetails: (value) => { dispatch(getJobsiteDetails(value)); },
        updateMeasure: (value) => { dispatch(updateMeasure(value)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UCEquipCondition);
