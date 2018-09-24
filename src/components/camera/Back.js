import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from "native-base";

import CommonStyles from '../../styles/Common'

const Back = (props) => {
    return (
        <TouchableOpacity
            style={{justifyContent: 'center', marginLeft: 20}}
            onPress={props.onPress}>
            <Icon style={{color: CommonStyles.COLOR_BLUE, fontSize: 60}} name='ios-close' />
        </TouchableOpacity>
    )
}


export { Back };
