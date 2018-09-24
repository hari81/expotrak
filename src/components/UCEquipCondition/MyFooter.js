import React from 'react'
import { View, Dimensions, StyleSheet, Text } from 'react-native'
import { Icon, Button, Footer } from "native-base";
import CommonStyles from '../../styles/Common'
import { pressRemove, fetchUnsyncedList } from '../../redux/actions/InspectionList';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

const MyFooterClass = (props) => {
    return (
        <Footer style={styles.footer}>
            <View style={styles.footerGroup}>
                <View style={styles.footerLeft}>
                    <Button
                        style={styles.btnBack}
                        onPress={() => props._onPressBack()}>
                        <FontAwesome 
                            name='angle-left'
                            style={{fontSize: 30, color: CommonStyles.COLOR_BLACK}}
                        />
                        <Text style={{marginLeft: 25}}>Back</Text>
                    </Button>
                </View>
                <View style={styles.footerRight}>
                    <Button
                        style={styles.btnNext}
                        onPress={() => props._onPressNext()}>
                        <Text style={{marginRight: 25}}>Next</Text>
                        <FontAwesome 
                            name='angle-right'
                            style={{fontSize: 30, color: CommonStyles.COLOR_BLACK}}
                        />
                    </Button>
                </View>
            </View>
        </Footer>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: CommonStyles.COLOR_DARK_GREY,
    },
        footerGroup: {
            flex: 1,
            flexDirection: 'row',
        },
            footerLeft: {
                flex: 1/2,
                flexDirection: 'row',
                marginLeft: 5,
            },
                btnBack: {
                    marginRight: 20,
                    width: 120,
                    backgroundColor: CommonStyles.COLOR_WHITE,
                    justifyContent: 'flex-start',
                    paddingLeft: 15,
                    alignSelf: 'center',
                },
            footerRight: {
                flex: 1/2,
                justifyContent: 'center',
                marginRight: 5,
            },
                btnNext: {
                    width: 120,
                    backgroundColor: CommonStyles.COLOR_WHITE,
                    justifyContent: 'flex-end',
                    paddingRight: 15,
                    alignSelf: 'flex-end',
                },
});
 
const mapDispatchToProps = (dispatch) => {
    return {
        pressRemove: () => { dispatch(pressRemove()); },
        fetchUnsyncedList: () => { dispatch(fetchUnsyncedList()); },
    }
}

const MyFooter = connect(null, mapDispatchToProps)(MyFooterClass)
export { MyFooter }
