import React from 'react'
import { TextInput, View, Text } from 'react-native'
import { InputGroup, Input } from 'native-base';

const EditText = (props) => {
    return (
        <TextInput
            placeholder = {props.placeholder}
            onChangeText = { (text) => props.onChangeText(text)} />
    )
}

//export default Input;
export { EditText };
