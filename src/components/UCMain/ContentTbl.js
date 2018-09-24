import React, { Component } from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { CheckBox } from "native-base";
import { selectDeselectFromList } from '../../redux/actions/InspectionList'
import { connect } from 'react-redux';
import { hook } from 'cavy';

import Util from "../../config/Util";

class ContentTblClass extends Component {

    _onPressCheckbox = (inspectionId) => {
        this.props.selectDeselectFromList(inspectionId)
    }

    /////////////////
    // RENDER UI
    render() {
        return (
            <View style={styles.table}>
                <View style={styles.tblHeaderRow}>
                    <Text style={styles.tblHeaderCol1}></Text>
                    <Text style={styles.tblHeaderCol2}>Customer</Text>
                    <Text style={styles.tblHeaderCol3}>Jobsite</Text>
                    <Text style={styles.tblHeaderCol4}>Type</Text>
                    <Text style={styles.tblHeaderCol5}>Status</Text>
                </View>
                { this.props.unsyncedList === null
                    ? null
                    :
                    this.props.unsyncedList.map( (item, index, array) => (
                    <TouchableOpacity
                        ref={Util.ConstantHelper.isTest ? this.props.generateTestHook('UCMain.' + item.serialno) : ''}
                        key={item.serialno}
                        style={{marginTop:10}}
                        onPress={() => this.props._onPressEquip(item)}>
                        <View style={styles.tblRow}>
                            <TouchableOpacity
                                style={styles.tblCol1}
                                onPress={() => this._onPressCheckbox(item.id)}>
                                <CheckBox
                                    checked={this.props.selectedList.includes(item.id)}
                                    onPress={() => this._onPressCheckbox(item.id)}
                                />
                            </TouchableOpacity>
                            <Text style={styles.tblCol2}>{item.customer}</Text>
                            <Text style={styles.tblCol3}>{item.jobsite}</Text>
                            <Text style={styles.tblCol4}>{item.serialno}</Text>
                            <Text style={styles.tblCol5}>{item.status}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    table: {
    },
        tblHeaderRow: {
            flex: 1,
            flexDirection: 'row',
        },
            tblHeaderCol1: {
                flex: 1/9,
                fontWeight: 'bold',
            },
            tblHeaderCol2: {
                flex: 2/9,
                fontWeight: 'bold',
            },
            tblHeaderCol3: {
                flex: 2/9,
                fontWeight: 'bold',
            },
            tblHeaderCol4: {
                flex: 2/9,
                fontWeight: 'bold',
            },
            tblHeaderCol5: {
                flex: 2/9,
                fontWeight: 'bold',
            },
        tblRow: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 3,
        },
            tblCol1: {
                flex: 1/9,
            },
            tblCol2: {
                flex: 2/9,
            },
            tblCol3: {
                flex: 2/9,
            },
            tblCol4: {
                flex: 2/9,
            },
            tblCol5: {
                flex: 2/9,
            },
})

const mapStateToProps = (state, ownProps) => {
    return {
        unsyncedList: state.InspectionList.unsyncedList,
        selectedList: state.InspectionList.selectedList,
    };
} 
 
const mapDispatchToProps = (dispatch) => {
    return {
        selectDeselectFromList: (inspectionId) => { dispatch(selectDeselectFromList(inspectionId)); },
    }
}

const ContentTbl = connect(mapStateToProps, mapDispatchToProps)(
    Util.ConstantHelper.isTest ? hook(ContentTblClass) : ContentTblClass
)

export { ContentTbl }
