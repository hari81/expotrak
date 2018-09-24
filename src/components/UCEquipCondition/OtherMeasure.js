import React, { Component } from 'react'
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { CardItem, Body, Icon, Button, Footer } from "native-base";
import CommonStyles from '../../styles/Common'
import { updateLeftTrackSag, updateRightTrackSag, updateLeftDryJoints, updateRightDryJoints, updateLeftCannon, updateRightCannon, updateLeftScallop, updateRightScallop } from '../../redux/actions/Jobsite';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import Util from "../../config/Util";

class OtherMeasureClass extends Component {

    render() {
        return (
            <CardItem>
                <Body>
                    <View style={styles.otherRow}>
                        <View style={styles.columnTitle}></View>
                        <View style={styles.column}>
                            <Text style={styles.title}>Left</Text>
                        </View>
                        <View style={styles.column}>
                            <Text>Right</Text>
                        </View>
                    </View>
                    <View style={styles.otherRow}>
                        <View style={styles.columnTitle}>
                            <Text style={styles.title}>Track Sag</Text>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                style={styles.input}
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.track_sag_left !== null ? this.props.jobsiteData.track_sag_left.toString() : ''
                                    }
                                onChangeText = { (value) => 
                                    this.props.updateLeftTrackSag(
                                        {input: value,
                                        photoComment: this.props.jobsiteData.track_sag_left_comment,
                                        photoPath: this.props.jobsiteData.track_sag_left_image,})
                                } />
                            <TouchableOpacity                            
                                onPress={() => { 
                                    this.props._openPhotoModal('left_track_sag')
                                }}>
                                {
                                    Util.Functions.validateString(this.props.jobsiteData.track_sag_left_image)
                                        ? (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_BLACK}}
                                            />)
                                }

                            </TouchableOpacity>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.track_sag_right !== null ? this.props.jobsiteData.track_sag_right.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateRightTrackSag(
                                        {input: value,
                                        photoComment: this.props.jobsiteData.track_sag_right_comment,
                                        photoPath: this.props.jobsiteData.track_sag_right_image,})
                                } />
                            <TouchableOpacity                            
                                onPress={() => { 
                                    this.props._openPhotoModal('right_track_sag')
                                }}>
                                {
                                    Util.Functions.validateString(this.props.jobsiteData.track_sag_right_image)
                                        ? (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_BLACK}}
                                            />)
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.otherRow}>
                        <View style={styles.columnTitle}>
                            <Text style={styles.title}>Dry Joints</Text>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.dry_joints_left !== null ? this.props.jobsiteData.dry_joints_left.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateLeftDryJoints(
                                        {input: value,})
                                } />
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.dry_joints_right !== null ? this.props.jobsiteData.dry_joints_right.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateRightDryJoints(
                                        {input: value,})
                                } />
                        </View>
                    </View>
                    <View style={styles.otherRow}>
                        <View style={styles.columnTitle}>
                            <Text style={styles.title}>Ext.Cannon</Text>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.ext_cannon_left !== null ? this.props.jobsiteData.ext_cannon_left.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateLeftCannon(
                                        {input: value,
                                        photoComment: this.props.jobsiteData.ext_cannon_left_comment,
                                        photoPath: this.props.jobsiteData.ext_cannon_left_image,})
                                } />
                            <TouchableOpacity                            
                                onPress={() => { 
                                    this.props._openPhotoModal('left_cannon')
                                }}>
                                {
                                    Util.Functions.validateString(this.props.jobsiteData.ext_cannon_left_image)
                                        ? (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_BLACK}}
                                            />)
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.ext_cannon_right !== null ? this.props.jobsiteData.ext_cannon_right.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateRightCannon(
                                        {input: value,
                                        photoComment: this.props.jobsiteData.ext_cannon_right_comment,
                                        photoPath: this.props.jobsiteData.ext_cannon_right_image,})
                                } />
                            <TouchableOpacity                            
                                onPress={() => { 
                                    this.props._openPhotoModal('right_cannon')
                                }}>
                                {
                                    Util.Functions.validateString(this.props.jobsiteData.ext_cannon_right_image)
                                        ? (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : (<FontAwesome 
                                                name='camera'
                                                style={{fontSize: 35, marginLeft:5, color: CommonStyles.COLOR_BLACK}}
                                            />)
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.otherRow}>
                        <View style={styles.columnTitle}>
                            <Text style={styles.title}>Scallop Measurement</Text>
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.scallop_left !== null ? this.props.jobsiteData.scallop_left.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateLeftScallop(
                                        {input: value,})
                                } />
                        </View>
                        <View style={styles.column}>
                            <TextInput
                                keyboardType = 'numeric'
                                value={
                                    this.props.jobsiteData.scallop_right !== null ? this.props.jobsiteData.scallop_right.toString() : ''
                                    }
                                style={styles.input}
                                onChangeText = { (value) => 
                                    this.props.updateRightScallop(
                                        {input: value,})
                                } />
                        </View>
                    </View>
                </Body>
            </CardItem>
        )
    }
}

const styles = StyleSheet.create({
    otherRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 15,
    },
        columnTitle: {
            flex: 1/5,
            flexDirection: 'row',
        },
        column: {
            flex: 2/5,
            flexDirection: 'row',
        },
            title: {
                fontSize: CommonStyles.FONT_SIZE_REGULAR,
            },
            chkText: {
                marginLeft: 15,
            },
            input: {
                backgroundColor: CommonStyles.COLOR_GREY,
                width: '70%',
                height: 42,
                paddingLeft: 5,
                borderRadius: 5,
                color: CommonStyles.COLOR_BLACK,
            },
});


const mapStateToProps = (state, ownProps) => {
    return {
        jobsiteData: state.Jobsite,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateLeftTrackSag: (value) => { dispatch(updateLeftTrackSag(value)); },
        updateRightTrackSag: (value) => { dispatch(updateRightTrackSag(value)); },
        updateLeftDryJoints: (value) => { dispatch(updateLeftDryJoints(value)); },
        updateRightDryJoints: (value) => { dispatch(updateRightDryJoints(value)); },
        updateLeftCannon: (value) => { dispatch(updateLeftCannon(value)); },
        updateRightCannon: (value) => { dispatch(updateRightCannon(value)); },
        updateLeftScallop: (value) => { dispatch(updateLeftScallop(value)); },
        updateRightScallop: (value) => { dispatch(updateRightScallop(value)); },
    }
}

const OtherMeasure = connect(mapStateToProps, mapDispatchToProps)(OtherMeasureClass)
export { OtherMeasure }
