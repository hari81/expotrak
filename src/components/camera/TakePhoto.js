import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from "native-base";
import CommonStyles from '../../styles/Common'

const TakePhoto = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}>
            <Icon style={{fontSize: 50, color: CommonStyles.COLOR_RED}} name='ios-radio-button-on' />
        </TouchableOpacity>
    )
}

export { TakePhoto };