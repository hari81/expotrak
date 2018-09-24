import React, { Component } from 'react';
import CommonStyles from "../../styles/Common";
import { Platform, StyleSheet, View, Text, TouchableOpacity, ProgressBarAndroid, ProgressViewIOS } from 'react-native';
import Modal from "react-native-modal"

class ProgressBar extends Component
{
 
  render()
  {
    return(
        <Modal
            transparent={true}
            animationType={"fade"}
            isVisible={this.props.isProgressBarVisible}
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

                    <Text style = {{marginBottom:10, fontSize: 15, color: '#000'}}>{this.props.progressText}</Text>
                    {
                    ( Platform.OS === 'android' )
                        ?
                        ( <ProgressBarAndroid styleAttr = "Horizontal" progress = { this.props.progressValue } indeterminate = { false } /> )
                        :
                        ( <ProgressViewIOS progress = { this.props.progressValue } /> )
                    }

                </View>
            </View>
        </Modal>
    );
  }
}

const modalWidth = 360
const modalHeight = 100
const styles = StyleSheet.create(
{

});

export { ProgressBar }