import React,{ Component } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity, TextInput, View, Dimensions, StyleSheet, Text } from 'react-native'
import { Icon, Spinner, CheckBox, Picker, List, ListItem, Body, Right, Button } from "native-base";
import Modal from "react-native-modal"
import Autocomplete from 'react-native-autocomplete-input'
import { connect } from 'react-redux'
import { fetchUnsyncedList } from '../../redux/actions/InspectionList'
import { hook } from 'cavy';

// My classes
import APIManager from "../../business/APIManager"
import UCMainManager from "../../business/UCMainManager"
import CommonStyles from '../../styles/Common'
import Common from '../../styles/Common'
import Util from '../../config/Util'

class MyModalClass extends Component {

    //////////////
    // STATE
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            custQuery: '',
            jobsites: [],
            models: [],
            equipments: [],
            selected: {
                customer:'',
                customerId:0,
                jobsite: '',
                jobsiteId: 0,
                model: '',
                modelId: 0,
            },
            styleSuggestion: {},
            styleModelJobsite: {},
            loading: false,
        };
    }

    componentDidMount() {
        // Call API
        APIManager.GetCustomerList(this.props.userId).then((response) => {
            console.log('GetCustomerList')
            if (response != false)
            {
                // Success
                let data = response.GetCustomerListResult
                this.setState({ customers: data })
            } else {
                console.log(response)
            }
        })
    }

    //////////////////
    // AUTO COMPLETE
    _findCustomer(custQuery) {
        if (custQuery === '') {
          return [];
        }    
        const { customers } = this.state;
        const regex = new RegExp(`${custQuery.trim()}`, 'i');
        return customers.filter(
            customer => customer.CustomerName.search(regex) >= 0);
    }

    _showSuggestions = (isShow) => {
        console.log(isShow)
        if (isShow === false)
            this.setState({ 
                styleSuggestion:{
                    zIndex: 1,
                    height: 42},
                styleModelJobsite:{zIndex: 2}})
        else
            this.setState({ 
                styleSuggestion:{zIndex: 99},
                styleModelJobsite:{} })
    }

    /////////////////
    // UPDATE STATE
    _updateCustomerState = (CustomerId, CustomerName) => {
        this.setState(
            { custQuery: CustomerName,
              selected: {
                customer: CustomerName,
                customerId: CustomerId,
                jobsite: this.state.selected.jobsite,
                jobsiteId: this.state.selected.jobsiteId,
                model: this.state.selected.model,
                modelId: this.state.selected.modelId,
              }})
    }

    _updateJobsiteState = (itemValue) => {

        // Get JobsiteName from array basing on index
        let jobsiteObj = null
        this.state.jobsites.forEach((element, index) => {
            if(element.JobsiteId === itemValue) {
                jobsiteObj = element
            }
        })
        if (jobsiteObj == null) return 

        // Update state
        this.setState(
            {selected: {
                customer: this.state.selected.customer,
                customerId: this.state.selected.customerId,
                jobsite: jobsiteObj.JobsiteName,
                jobsiteId: jobsiteObj.JobsiteId,
                model: this.state.selected.model,
                modelId: this.state.selected.modelId,
            }})
    }

    _updateModelState = (itemValue) => {
        let obj = null
        this.state.models.forEach((element, index) => {
            if(element.ModelId === itemValue) {
                obj = element
            }
        })
        if (obj == null) return 

        this.setState(
            {selected: {
                customer: this.state.selected.customer,
                customerId: this.state.selected.customerId,
                jobsite: this.state.selected.jobsite,
                jobsiteId: this.state.selected.jobsiteId,
                model: obj.ModelName,
                modelId: obj.ModelId,
            }})
    }

    _updateEquipmentState = (equipment) => {
        this.state.equipments.forEach((element, index) => {
            if(element.EquipmentId === equipment.EquipmentId) {
                this.state.equipments[index].selected
                    ? this.state.equipments[index].selected = false
                    : this.state.equipments[index].selected = true
            }
        })
        this.setState({ equipments: this.state.equipments })
    }

    /////////////////
    // CALL APIs
    _loadJobsite = (CustomerId) => {
        // Call API
        APIManager.GetJobsiteList(CustomerId, this.props.userId).then((response) => {
            console.log('GetJobsiteList')
            if (response != false)
            {
                // Success
                let data = response.GetJobsitesByCustomerResult
                if (data.length <= 0) return
                
                this.setState({ jobsites: data })
                this._updateJobsiteState(data[0].JobsiteId)
                this._loadModel(data[0].JobsiteId)
            } else {
                console.log(response)
            }
        })
    }

    _loadModel = (jobsiteId) => {
        // Call API
        APIManager.GetModelList(jobsiteId).then((response) => {
            console.log('GetModelList')
            if (response != false)
            {
                // Success
                let data = response.GetModelsByJobsiteResult

                if (data.length <= 0) return
                
                data.unshift( {"ModelId":0,"ModelName":"All Models"} )
                this.setState({ models: data })
                this._updateModelState(data[0].ModelId)
                this._loadEquipment(data[0].ModelId)                
            } else {
                console.log(response)
            }
        })
    }

    _loadEquipment = (modelId) => {
        // Call API
        let jobsiteId = this.state.selected.jobsiteId
        APIManager.GetEquipmentList(jobsiteId, modelId).then((response) => {
            console.log('GetEquipmentList')
            if (response != false)
            {
                // Success
                let data = response.GetEquipmentByJobsiteAndModelResult
                data = this._insertSelectAttr(data)
                this.setState({ equipments: data })
            } else {
                console.log(response)
            }
        })
    }

    _insertSelectAttr = (equipArray) => {                
        let newEquipArray = []
        for (let count = 0; count < equipArray.length; count++) {
            let equip = equipArray[count]
            equip.selected = false
            newEquipArray.push(equip)
        }
        return newEquipArray
    }

    ////////////////////
    // ADD EQUIPMENT
    _addEquipments = () => {

        // Loading
        this.setState({ loading:true })
        
        // Fix data
        let insertEquipments = []
        for (let i = 0; i < this.state.equipments.length; i++) {
            let equipment = this.state.equipments[i]
            if (equipment.selected === false)
                continue
            equipment.EquipmentJobsiteAuto = this.state.selected.jobsiteId
            equipment.EquipmentModel = this.state.selected.model
            equipment.EquipmentCustomer = this.state.selected.customer
            equipment.EquipmentJobsite = this.state.selected.jobsite
            equipment.CustomerAuto = this.state.selected.customerId
            equipment.EquipmentModelAuto = this.state.selected.modelId
            
            insertEquipments.push(equipment)
        }

        // Insert to database
        let equipmentAutoList = UCMainManager.getEquipmentList(insertEquipments)
        UCMainManager.downloadAndSaveData(equipmentAutoList)
        .then( (response) => {

            console.log('Done with download and save data')

            // Loading
            this.setState({ loading:false })

            // Close Modal
            this.props._onRequestClose()

            // Refresh UCMain screen
            this.props.fetchUnsyncedList()
        } )
        .catch()
    }

    /////////////////
    // RENDER UI
    render() {

        const { custQuery } = this.state;
        const customers = this._findCustomer(custQuery);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <Modal
                transparent={true}
                animationType={"fade"}
                isVisible={this.props.isModalVisible}
                onRequestClose={ () => { this._onRequestClose()} }>
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.ModalInsideView}>
                        
                        <View style={styles.header}>
                            <Text style={styles.headerText}>EQUIPMENTS</Text>
                        </View>
                        
                        {/*********************** CUSTOMER LIST */}
                        <View style={styles.autocompleteWrapper}>
                            <Autocomplete
                                ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('UCMain.customer') : ''}
                                autoCapitalize="none"
                                autoCorrect={false}
                                containerStyle={this.state.styleSuggestion}
                                style={styles.autocompleteContainer}
                                data={customers.length === 1 && comp(custQuery, customers[0].CustomerName) ? [] : customers}   // !!
                                defaultValue={custQuery}
                                onChangeText={ (text) => {
                                    this.setState({ custQuery: text })
                                    this._showSuggestions(true)
                                }}
                                placeholder="Enter customer name"
                                renderItem={({CustomerId, CustomerName}) => (
                                    <TouchableOpacity
                                        onPress={ () => {
                                            this._updateCustomerState(CustomerId, CustomerName)
                                            this._loadJobsite(CustomerId)
                                            this._showSuggestions(false)
                                        }}>
                                        <Text style={styles.inputCustomer}>{CustomerName}</Text>
                                    </TouchableOpacity>
                                )}/>
                        </View>

                        {/*********************************************** JOBSITE */}
                        <View style={[styles.jobsiteContainer, this.state.styleModelJobsite]}>
                            {this.state.jobsites.length > 0 ? (
                                <Picker
                                    iosHeader="Jobsites"
                                    iosIcon={<Icon name="arrow-down" style={{ color: "blue", fontSize: 18 }} />}
                                    selectedValue={this.state.selected.jobsiteId}
                                    style={styles.jobsite}
                                    onValueChange={
                                        (itemValue, itemIndex) => {
                                            this._updateJobsiteState(itemValue)
                                            this._loadModel(itemValue)
                                        }}>
                                    { this.state.jobsites.map(item => (
                                        <Picker.Item key={item.JobsiteId} label={item.JobsiteName} value={item.JobsiteId} />
                                    ))}
                                </Picker>
                            ) : null}
                        </View>

                        {/*********************************************** MODEL */}
                        <View style={[styles.modelContainer, this.state.styleModelJobsite]}>
                            {this.state.models.length > 0 ? (
                                <Picker
                                    iosHeader="Models"
                                    iosIcon={<Icon name="arrow-down" style={{ color: "blue", fontSize: 18 }} />}
                                    selectedValue={this.state.selected.modelId}
                                    style={styles.model}
                                    onValueChange={
                                        (itemValue, itemIndex) => {
                                            this._updateModelState(itemValue)
                                            this._loadEquipment(itemValue)
                                        }}>
                                    { this.state.models.map(item => (
                                        <Picker.Item key={item.ModelId} label={item.ModelName} value={item.ModelId} />
                                    ))}
                                </Picker>
                            ) : null}
                        </View>

                        {/************************************************* EQUIPMENT LIST */}
                        <ScrollView style={styles.equipmentContainer}>
                            <List>
                                {this.state.equipments.length > 0 
                                    ? (this.state.equipments.map(item => (
                                        <ListItem
                                            key={item.EquipmentId}>
                                                <Body>
                                                    <TouchableOpacity
                                                        onPress={() => this._updateEquipmentState(item)}>
                                                        <Text style={styles.serialNo}>
                                                            {item.EquipmentSerialNo}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Body>
                                                <Right>
                                                    <CheckBox
                                                        style={styles.checkBox}
                                                        checked={item.selected}
                                                        onPress={() => {this._updateEquipmentState(item)}}
                                                    />
                                                </Right>
                                        </ListItem>
                                    )))
                                    : null
                                }
                            </List>
                        </ScrollView>

                        {/************************************************* ADD BUTTON */}
                        <View style={styles.addBtnContainer}>
                            {this.state.equipments.length > 0
                                ? (<Button iconRight
                                        style={styles.addBtn}
                                        disabled={this.state.loading || this.props.isFetching 
                                            ? true
                                            : false}
                                        onPress={() => {this._addEquipments()} }>
                                        {this.state.loading || this.props.isFetching
                                            ? (<Spinner color={CommonStyles.COLOR_WHITE} />)
                                            : (<Text style={styles.addText}>ADD EQUIPMENT</Text>)}
                                    </Button>)
                                : null
                            }
                        </View>

                        {/***************************************** BUTTONS */}
                        <View style={styles.bottomContainer}>
                            <Button 
                                style={styles.closeBtn}
                                onPress={() => {this.props._onRequestClose()} }>
                                <Text style={styles.closeText}>CLOSE</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userId: state.auth.username,
        isFetching: state.InspectionList.isFetching
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUnsyncedList: () => { dispatch(fetchUnsyncedList()); },
    }
}

const modalWidth = 360
const styles = StyleSheet.create({
    ModalInsideView:{
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: CommonStyles.COLOR_WHITE,
        height: '90%',
        width: modalWidth,
        borderRadius:10,
        paddingTop: 24
    },
        header: {
            height: 50,
            marginLeft: -20,
            marginRight: -20,
            marginTop: -24,
            borderTopLeftRadius:10,
            borderTopRightRadius:10,
            backgroundColor: CommonStyles.COLOR_RED,
            justifyContent: 'center',
            alignItems: 'center'
        },
            headerText: {
                color: CommonStyles.COLOR_WHITE,
                fontSize: CommonStyles.FONT_SIZE_MEDIUM,
                fontWeight: 'bold'
            },
        autocompleteWrapper: {
            width: '100%',
            margin: 20,
            marginTop: 60,
            position: 'absolute',
            zIndex: 1,
        },
            autocompleteContainer: {
                backgroundColor: CommonStyles.COLOR_GREY,
                height: 40,
                fontSize: 17,
                padding: 7,
            }, 
                inputCustomer: {
                    paddingLeft: 5,
                    width: 500,
                    height: 42,
                    backgroundColor: CommonStyles.COLOR_GREY,
                },
                TextStyle:{       
                    fontSize: 20, 
                    marginBottom: 20, 
                    color: CommonStyles.COLOR_WHITE,
                    padding: 20,
                    textAlign: 'center'       
                },
        jobsiteContainer: {
            backgroundColor: CommonStyles.COLOR_WHITE,
            marginTop: 55,
        },
            jobsite: {
                backgroundColor: CommonStyles.COLOR_GREY,
                width: '100%',
                height: 42,
            },
        modelContainer: {
            backgroundColor: CommonStyles.COLOR_WHITE,
            marginTop: 3,
        },
            model: {
                backgroundColor: CommonStyles.COLOR_GREY,
                width: '100%',
                height: 42,
            },
        equipmentContainer: {
            backgroundColor: CommonStyles.COLOR_WHITE,
            marginTop: 3,
        },
            serialNo: {
                // color: CommonStyles.COLOR_WHITE,
                fontSize: Common.FONT_SIZE_BIGGER_REGULAR
            },
            checkBox: {
            },
        addBtnContainer: {
            backgroundColor: CommonStyles.COLOR_WHITE,
            marginTop: 3,
            alignSelf:'center'
        },
            addBtn: {
                width: modalWidth - 40,
                backgroundColor: CommonStyles.COLOR_RED,
                justifyContent: 'center'
            },
            addText: {
                color: CommonStyles.COLOR_WHITE,
                // fontWeight: 'bold',
                fontSize: Common.FONT_SIZE_BIGGER_REGULAR,
            },
        bottomContainer: {
            backgroundColor: CommonStyles.COLOR_WHITE,
            marginTop: 3,
            marginBottom: 20,
            alignSelf:'center',
            justifyContent: 'center'
        },
            closeBtn: {
                width: modalWidth - 40,
                backgroundColor: CommonStyles.COLOR_DARK_GREY,
                justifyContent: 'center'
            },
            closeText: {
                color: CommonStyles.COLOR_WHITE,
                // fontWeight: 'bold',
                fontSize: Common.FONT_SIZE_BIGGER_REGULAR,
            }
});


const MyModal = hook(MyModalClass)
export default connect(mapStateToProps, mapDispatchToProps)(
    Util.ConstantHelper.isTest ? MyModal : MyModalClass
)
