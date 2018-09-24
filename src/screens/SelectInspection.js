import React, { Component } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text } from "react-native";
import { Icon, Button, Container, Header, Content, Left } from "native-base";

// My classes
import { AppHeader } from '../components/common'
import APIManager from "../business/APIManager"
import CommonStyles from '../styles/Common'
import Styles from '../styles/Styles'
import { UCInspection } from '../config/route';

export default class SelectInspection extends Component {

    ////////////////////
    // Component state
    constructor(props) {

        super(props)

        this.state = {
            loading: false,
            enableWSRE: -1,  // 0: false, 1: true
            //enableWSRE: 1,  // MOCK DATA
        }

        // Call API
        APIManager.GetWSREEnableSetting().then((response) => {

            console.log('GetWSREEnableSettingResult')
            console.log(response)
            let enableWSRE = 0
            if (response != false)
            {
                // Success
                enableWSRE = response.GetWSREEnableSettingResult
            }
            this.setState({ enableWSRE: enableWSRE })
        });
    }

    componentWillMount() {
    }

    _navigateToUC = () => {
        console.log('Navigate to UCMain');
        this.props.navigation.navigate('UCMain', {});
    }

    ////////////////////
    // Render UI
    render() {
        if (this.state.enableWSRE == 1)
            return (
                <Container style={Styles.screen}>
                    <AppHeader title={'Undercarriage Inspection'} />
                    <Content style={{marginTop: 40}}>
                        <Text style={{marginLeft: 10}}>What would you like to do?</Text>
                        <Button
                            style={styles.button}
                            onPress={() => this._navigateToUC()}>
                            <Text style={styles.btnText}>Undercarriage Inspection</Text>
                            <Icon style={{fontSize: 30}} name='md-arrow-forward' />
                        </Button>
                        <Button
                            style={styles.button}
                            onPress={() => console.log('')}>
                            <Text style={styles.btnText}>Workshop Repair Estimation</Text>
                            <Icon style={{fontSize: 30}} name='md-arrow-forward' />
                        </Button>
                    </Content>
                </Container>
        )
        else if (this.state.enableWSRE == 0)
            return <UCInspection />
        else
            return <ActivityIndicator
                        style={Styles.screenCenter}
                        animating={true}
                        size="large"/>
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: CommonStyles.COLOR_BLACK,
        width: Dimensions.get('window').width - 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    btnText: {
        color: CommonStyles.COLOR_WHITE,
        marginLeft: 10,
        fontSize: CommonStyles.FONT_SIZE_REGULAR,
    },
});
