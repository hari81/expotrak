import React, { Component } from 'react'
import { StyleSheet, Text } from "react-native";
import { View, CheckBox, FooterTab, Icon, Button, Container, Header, Content, Left, Footer } from "native-base";
import CommonStyles from '../../styles/Common'
const ProcessBar = (props) => {
    return (
        <View style={styles.processBar}>
            <View
                style={styles.processOne}>
                <Button
                    onPress={() => props.onPress(props.route, 'UCMain')}
                    style={
                        props.route == 'UCMain'
                            ? styles.circleRed
                            : styles.circleGray
                    }>
                    <Text style={styles.number}>1</Text>
                </Button>
                <Text style={styles.text}>Add{'\n'}equip</Text>
            </View>
            <Icon style={styles.line} name='md-remove' />
            <View style={styles.processTwo}>
                <Button
                    onPress={() => props.onPress(props.route, 'UCEquipDetail')}
                    style={
                        props.route == 'UCEquipDetail'
                            ? styles.circleRed
                            : styles.circleGray
                    }>
                    <Text style={styles.number}>2</Text>
                </Button>
                <Text style={styles.text}>Equip{'\n'}details</Text>
            </View>
            <Icon style={styles.line} name='md-remove' />
            <View style={styles.processThree}>
                <Button
                    onPress={() => props.onPress(props.route, 'UCEquipCondition')}
                    style={
                        props.route == 'UCEquipCondition'
                            ? styles.circleRed
                            : styles.circleGray
                    }>
                    <Text style={styles.number}>3</Text>
                </Button>
                <Text style={styles.text}>Equip{'\n'}conditions</Text>
            </View>
            <Icon style={styles.line} name='md-remove' />
            <View style={styles.processFour}>
                <Button
                    onPress={() => props.onPress(props.route, 'UCInspect')}
                    style={
                        props.route == 'UCInspect'
                            ? styles.circleRed
                            : styles.circleGray
                    }>
                    <Text style={styles.number}>4</Text>
                </Button>
                <Text style={styles.text}>Inspect</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    processBar: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
        processOne: {
            flexDirection: 'row',
            height: 40,
        },
            circleRed: {
                borderRadius:100,
                width: 40,
                height: 40,
                backgroundColor: CommonStyles.COLOR_RED,
                justifyContent: 'center'
            },
            circleGray: {
                borderRadius:100,
                width: 40,
                height: 40,
                backgroundColor: CommonStyles.COLOR_DARK_GREY,
                justifyContent: 'center'
            },
                number: {
                    color: 'white',
                    alignSelf: 'center',
                    fontSize: 15
                },
            text: {
                marginLeft: 2,
                alignSelf: 'center'
            },
        line: {
            fontSize: 30,
            color: CommonStyles.COLOR_DARK_GREY,
            // alignSelf: 'center',
            // marginRight: 5,
        },
        processTwo: {
            flexDirection: 'row',
            height: 40,
        },
        processThree: {
            flexDirection: 'row',
            height: 40,
        },
        processFour: {
            flexDirection: 'row',
            height: 40,
        },
});

export { ProcessBar };
