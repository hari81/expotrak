import React, { Component } from 'react'
import { StyleSheet, Text } from "react-native";
import { Left, Button, Icon, Body, Header, Right } from "native-base";
import CommonStyles from '../../styles/Common'
import { DrawerActions } from 'react-navigation';

class AppHeader extends Component {
    render() {
        return (
            <Header style={styles.header}>
                <Left style={{flex:1/9}}>
                    <Button
                        transparent
                        onPress={()=>this.props._openPreferenceModal()}>
                    <Icon style={{fontSize: 26, fontWeight: 'bold', color:CommonStyles.COLOR_WHITE}} name="menu" />
                    </Button>
                </Left>
                <Body style={{flex: 7/9}}>
                    <Text style={styles.headerText}>{this.props.title}</Text>
                </Body>
                <Right style={{flex: 1/9}} />
            </Header>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: CommonStyles.COLOR_RED,
        height:60,
        alignItems: 'center'
    },
        headerText: {
            color: CommonStyles.COLOR_WHITE,
            fontSize: CommonStyles.FONT_SIZE_MEDIUM,
            fontWeight: 'bold',
            alignSelf: 'center',
        }
});

export { AppHeader };
