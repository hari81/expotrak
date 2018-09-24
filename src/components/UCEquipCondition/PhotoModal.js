import React, {Component} from 'react'
import { TouchableOpacity, TextInput, Image, View, StyleSheet, Text } from 'react-native'
import Modal from "react-native-modal"
import { Body, Icon, Button, Footer, CardItem, Radio, ListItem, CheckBox } from "native-base";
import { updateComment } from '../../redux/actions/TakePhoto';
import { savePhoto, removePhoto } from '../../redux/actions/Jobsite';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import CommonStyles from '../../styles/Common'
import Util from '../../config/Util'
import UCEquipConditionManager from "../../business/UCEquipConditionManager";

class PhotoModalClass extends Component {

    _renderThumbnail = () => {
        if (Util.Functions.validateString(this.props.photoPath)) {
            return (
                <Image
                    source={{uri: this.props.photoPath}}
                    style={styles.thumbnail}
                />
            )
        }

        return (
            <TouchableOpacity
                style={styles.image}
                onPress={() => { 
                    this.props._openCamera()
                }}>
                <FontAwesome 
                    name='camera'
                    style={{fontSize: 160, marginLeft:5, color: CommonStyles.COLOR_BLACK}}
                />
            </TouchableOpacity>
        )
    }

    _saveAndClose = () => {

        // Save DB & Redux
        this.props.savePhoto(
            {type: this.props.photoType,
            comment: this.props.photoComment,
            path: this.props.photoPath,})

        // setTimeout(function(){        
        //     }, 5000);

        // Close
        this.props._closePhotoModal()
    }

    _removeAndClose = () => {

        // Remove Redux Jobsite
        this.props.removePhoto(
            this.props.photoType)

        // Close modal
        this.props._closePhotoModal()
    }
    
    render() {
        return (
            <Modal
                transparent={true}
                animationType={"fade"}
                isVisible={this.props.showPhotoModal}
                onRequestClose={ () => { console.log('')} }>
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => { 
                                this.props._closePhotoModal()
                            }}>
                            <Icon style={{color: CommonStyles.COLOR_WHITE, fontSize: 38}} name='ios-close-circle' />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>TAKE PHOTO</Text>
                        </View>
                        <TextInput
                            value={this.props.photoComment}
                            style={styles.comment}
                            placeholder={'Comment'}
                            multiline={true}
                            onChangeText = { (value) => 
                                this.props.updateComment(value)
                            } />
                        <View style={styles.preview}>
                            {this._renderThumbnail()}
                            <View style={styles.btnList}>
                                <Button
                                    style={styles.discardBtn}
                                    onPress={() => this._removeAndClose() }>
                                    <Icon style={{fontSize: 30}} name='ios-trash' />
                                </Button>
                                <Button
                                    style={styles.saveBtn}
                                    onPress={() => this._saveAndClose() 
                                    }>
                                    <FontAwesome 
                                        name='save'
                                        style={{fontSize: 25, color: CommonStyles.COLOR_WHITE}}
                                    />
                                </Button>
                                <Button
                                    style={styles.closeBtn}
                                    onPress={() => {
                                        this.props._closePhotoModal()
                                    } }>
                                    <Text style={styles.closeText}>CLOSE</Text>
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
const modalHeight = 350
const styles = StyleSheet.create({
    modalContent: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: CommonStyles.COLOR_WHITE,
        height: modalHeight,
        width: modalWidth,
        borderRadius:10,
        paddingTop: 24
    },
        closeIcon: {
            alignSelf: 'flex-end',
            marginTop: -2,
            position: 'absolute',
            zIndex: 99,
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
        comment: {
            marginTop: 30,
            backgroundColor: CommonStyles.COLOR_GREY,
            width: '100%',
            height: 90,
            paddingLeft: 5,
            borderRadius: 5,
            color: CommonStyles.COLOR_BLACK,
        },
        preview: {
            marginTop: 10,
            flexDirection: 'row',
        },
            thumbnail: {
                width: 240,
                alignItems: 'center',
                resizeMode: Image.resizeMode.contain,
            },
            image: {
                width: 240,
                alignItems: 'center',
            },
            btnList: {
                flexDirection: 'column',
                // justifyContent: 'space-around',
            },
                discardBtn: {
                    width: 80,
                    justifyContent: 'center',
                    backgroundColor: CommonStyles.COLOR_BLACK,
                },
                saveBtn: {
                    marginTop: 10,
                    width: 80,
                    justifyContent: 'center',
                    backgroundColor: CommonStyles.COLOR_RED,                    
                },
                closeBtn: {
                    marginTop: 10,
                    width: 80,
                    justifyContent: 'center',
                    backgroundColor: CommonStyles.COLOR_DARK_GREY,                    
                },
                    closeText: {
                        color: CommonStyles.COLOR_WHITE
                    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        currentInspection: state.InspectionList.currentInspection,
        photoType: state.TakePhoto.type,
        photoPath: state.TakePhoto.path,
        photoComment: state.TakePhoto.comment,
        jobsiteData: state.Jobsite,
    }
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        updateComment: (text) => { dispatch(updateComment(text)); },
        openPhotoModal: (photoType) => { dispatch(openPhotoModal(photoType)); },
        closePhotoModal: () => { dispatch(closePhotoModal()); },
        takePhoto: (filePath) => { dispatch(takePhoto(filePath)); },
        savePhoto: (value) => { dispatch(savePhoto(value)); },
        removePhoto: (inspectionId, type) => { dispatch(removePhoto(inspectionId, type)); },
    }
}

const PhotoModal = connect(mapStateToProps, mapDispatchToProps)(PhotoModalClass)
export { PhotoModal }
