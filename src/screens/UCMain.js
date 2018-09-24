import React, { Component } from 'react'
import { Modal, Platform, View, Dimensions, StyleSheet, Text } from "react-native";
import { Button, Icon, Container, Drawer, Content, Left, Footer, Spinner, Card } from "native-base";
import { connect } from 'react-redux'
import { pressRemove, fetchUnsyncedList, selectCurrentInspection } from '../redux/actions/InspectionList'
import { resetJobsiteDetails } from '../redux/actions/Jobsite'
import { backupToFirebase, writeFirebaseSyncData, writeFirebaseSyncResult, uploadFileToFirebase } from '../database/Firebase'
import { hook } from 'cavy'
import Toast, {DURATION} from 'react-native-easy-toast'

// My classes
import CommonStyles from "../styles/Common"
import * as UCSync from '../business/UCSync'
import Util from '../config/Util'
import Styles from '../styles/Styles'
import { AppHeader, ProcessBar, YesNoModal, UCPreferenceModal } from '../components/common'
import { ProgressBar, MyFooter, ContentTbl } from '../components/UCMain'
import MyModal from '../components/UCMain/MyModal'

class UCMain extends Component {

    ////////////////////
    // Component state
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            isYesNoModalVisible: false,
            isPreferenceModalVisible: false,
            isProgressBarVisible: false,
            syncProgressValue: 0.00,
            syncProgressText: '',
        }
    }

    componentDidMount () {
        this.refs.toast.show(Util.ConstantHelper.productFlavors, DURATION.LENGTH_SHORT)
    }

    componentWillMount () {
        this.subs = [
            // this.props.navigation.addListener('willBlur', () => console.log('willBlur')),
            // this.props.navigation.addListener('didBlur', () => console.log('didBlur')),
            this.props.navigation.addListener('didFocus', () => {
                this.props.fetchUnsyncedList()
                this.props.resetJobsiteDetails()
            }),
        ]
    }
    
    componentWillUnmount() {
        this.subs.forEach((sub) => {
            sub.remove();
        });
    }

    /////////////////
    // BACKUP
    _onPressBackup = async () => {

        this.setState({
            isProgressBarVisible: true,
            syncProgressText: 'Start uploading database file to Firebase...',
            syncProgressValue: 0.25,
        })

        await backupToFirebase()
        .then((response) => {
            this.setState({
                syncProgressText: 'Done!',
                syncProgressValue: 1,
            })
        })
        .catch((error) => {
            this.setState({
                syncProgressText: 'Failed to upload! Please check your connection!',
                syncProgressValue: 1,
            })
        })

        // Hide
        setTimeout(function () {
            this.setState({ 
                isProgressBarVisible: false,
                syncProgressValue: 0.00,
            })
        }.bind(this), 2000)    // 2s
    }

    //////////////////
    // SYNC
    _onPressSync = async () => {

        if (this.props.selectedList.length == 0)
            return

        this.setState({
            isProgressBarVisible: true,
            syncProgressText: 'Start syncing...'
        })
        let progressLength = 1/this.props.selectedList.length
        let removeInspectionIds = '('
        for (let i = 0; i < this.props.selectedList.length; i++) {
    
            let syncArrayInspectionList = []
            let syncObject = {}
            let syncEquipmentInfo = {}
            let currentTime = Util.Functions.getCurrentDateTime()
            let inspectionId = this.props.selectedList[i]
    
            // Get logged in user
            this.setState({
                syncProgressText: 'Gathering user data...'
            })
            await UCSync.getSyncLoginInfo(syncEquipmentInfo)
    
            // Get equipment info
            this.setState({
                syncProgressText: 'Gathering equipment data...'
            })
            await UCSync.getSyncEquipmentInfo(inspectionId, syncEquipmentInfo)
    
            // Get jobsite info
            this.setState({
                syncProgressText: 'Gathering jobsite data...'
            })
            await UCSync.getSyncJobsiteInfo(inspectionId, syncEquipmentInfo)
            this.setState({
                syncProgressValue: this.state.syncProgressValue + progressLength/4,
                syncProgressText: syncEquipmentInfo.SerialNo + ': '
            })
    
            // Get component info
            this.setState({
                syncProgressText: syncEquipmentInfo.SerialNo + ': Gathering components data...',
            })
            await UCSync.getSyncComponentInfo(inspectionId, syncEquipmentInfo)
            this.setState({
                syncProgressValue: this.state.syncProgressValue + progressLength/4,
            })
    
            // Sync data
            syncArrayInspectionList.push(syncEquipmentInfo)
            syncObject = {
                _equipmentsInspection: syncArrayInspectionList,
                _newEquipments: [],
                _totalEquipments: 1,
                _created_time: currentTime
            }
            console.log(syncObject)

            // Backup to Firebase
            writeFirebaseSyncData(syncObject)

            // Call API to save inspection into DB
            this.setState({
                syncProgressText: 'Syncing ' + syncEquipmentInfo.SerialNo + '...',
            })
            await UCSync.postInspectionXMLHTTPRequest(syncObject)
            .then(
                async (response) => {
                    
                    // Write cloud
                    let responseObj = JSON.parse(response)
                    responseObj[0].created_time = currentTime
                    writeFirebaseSyncResult(responseObj)

                    // Update status
                    let syncResult = await UCSync.getSyncResult(inspectionId, responseObj)
                    if (syncResult <=0 ) {
                        
                        // Failed
                        this.setState({
                            syncProgressText: 'Sync ' + syncEquipmentInfo.SerialNo + ' failed!',
                        })
                        setTimeout(function () {
                        }.bind(this), 2000)    // 2s
                    } else {

                        // Synced succeed
                        if (removeInspectionIds === '(')
                            removeInspectionIds = removeInspectionIds + inspectionId
                        else
                            removeInspectionIds = removeInspectionIds + ',' + inspectionId
                    }

                    console.log('Sync result: ' + syncResult)
            })
            .catch(
                (error) => {

                    // Write cloud
                    writeFirebaseSyncResult(error)
                }
            )
            this.setState({syncProgressValue: this.state.syncProgressValue
                + progressLength/2})
        }

        setTimeout(async function () {

            // Hide progress bar
            this.setState({ 
                isProgressBarVisible: false,
                syncProgressValue: 0.00,
            })

            // Remove synced inspection
            removeInspectionIds = removeInspectionIds + ')'
            await UCSync.removeSyncedInspections(removeInspectionIds).then((response)=>{}).catch((error)=>{})

            // Refresh inspection list
            this.props.fetchUnsyncedList()  // Refresh equipment list

        }.bind(this), 1000)    // 1s
    }

    _onPressProcess = (current_route, destination_route) => {

        if (current_route === 'UCMain' && destination_route === 'UCMain') {
            // Open modal
            this.setState({ isModalVisible: true })
            return
        } else {
            return
        }
    }

    _onRequestClose = () => {
        this.setState({ isModalVisible: false });
    }

    _onPressEquip = (equipment) => {
        console.log('Navigate to Equipment Detail screen...');
        console.log('UCMain.' + equipment.serialno)
        this.props.navigation.navigate('UCEquipDetail')
        this.props.selectCurrentInspection(equipment)
    }

    ///////////////////////////////
    // REMOVE
    _onPressRemove = () => {
        if (this.props.selectedList.length > 0)
            this.setState({ isYesNoModalVisible:true })
    }

    _onConfirmYes = () => {
        // Update redux
        this.props.pressRemove()
        this.props.fetchUnsyncedList()
        this.setState({ isYesNoModalVisible:false })
    }
    
    _onConfirmNo = () => {
        console.log('On Press Remove NO')
        this.setState({ isYesNoModalVisible:false })
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
                    title={'Undercarriage Inspection'} 
                    _openPreferenceModal={this._openPreferenceModal} />
                <Content style={{margin: 10}}>
                    <ProcessBar route='UCMain' onPress={this._onPressProcess}/>
                    <Button
                        ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('UCMain.btnLoadEquipment') : ''}
                        style={styles.btnAddEquipment}
                        onPress={() => this.setState({ isModalVisible: true })}>
                        <Icon style={{fontSize: 25, color:CommonStyles.COLOR_WHITE}} name='md-add' />
                        <Text style={{color:CommonStyles.COLOR_WHITE}}>LOAD EQUIPMENT</Text>
                    </Button>
                    <Text style={{marginBottom: 10, marginTop: 20, marginLeft: 10}}>Existing Undercarriage Inspections</Text>
                    {!this.props.isFetching
                        ? <Card style={{padding: 10}}>
                            <ContentTbl
                                _onPressEquip={this._onPressEquip} />
                            </Card>
                        : <Spinner />}
                </Content>
                <MyFooter
                    _onPressRemove={this._onPressRemove}
                    _onPressSync={this._onPressSync}
                    _onPressBackup={this._onPressBackup} />
                    {this.state.isModalVisible
                    ? <MyModal
                        isModalVisible={this.state.isModalVisible}
                        _onRequestClose={this._onRequestClose}
                        />
                    : null}
                <YesNoModal
                    isYesNoModalVisible={this.state.isYesNoModalVisible}
                    headerText={''} 
                    detailText={'You can\'t undo this action.\nDo you want to continue?'}
                    _onConfirmYes={this._onConfirmYes}
                    _onConfirmNo={this._onConfirmNo} />
                <UCPreferenceModal
                    navigation={this.props.navigation}
                    isPreferenceModalVisible={this.state.isPreferenceModalVisible}
                    _closePreferenceModal={this._closePreferenceModal} />
                <ProgressBar
                    isProgressBarVisible={this.state.isProgressBarVisible}
                    progressValue={this.state.syncProgressValue}
                    progressText={this.state.syncProgressText} />
                <Toast ref="toast"/>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    btnAddEquipment: {
        marginTop: 15,
        height: 40,
        width: '80%',
        backgroundColor: CommonStyles.COLOR_RED,
        justifyContent: 'center',
        alignSelf: 'center',
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        selectedList: state.InspectionList.selectedList,
        unsyncedList: state.InspectionList.unsyncedList,
        isFetching: state.InspectionList.isFetching
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        pressRemove: () => { dispatch(pressRemove()); },
        fetchUnsyncedList: () => { dispatch(fetchUnsyncedList()); },
        selectCurrentInspection: (equipment) => { dispatch(selectCurrentInspection(equipment)); },
        resetJobsiteDetails: () => { dispatch(resetJobsiteDetails()); },
    }
}

const TestableUCMain = hook(UCMain)
export default connect(mapStateToProps, mapDispatchToProps)(
    Util.ConstantHelper.isTest ? TestableUCMain : UCMain
);