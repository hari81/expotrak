import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const Flip = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}>
            <Text
                style={{ fontSize: 18, color: 'white' }}>
                {' '}Flip{' '}
            </Text>
        </TouchableOpacity>
    )
}


export { Flip };
