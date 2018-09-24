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
                        style={styles.btnSave}
                        onPress={() => props._onPressBackup()}>
                        {/* <Text style={styles.btnSaveText}>SAVE{"\n"}TO FILE</Text> */}
                        <FontAwesome 
                            name='save'
                            style={{fontSize: 25}}
                        />
                    </Button>
                    <Button
                        style={styles.btnRemove}
                        onPress={() => props._onPressRemove()}>
                        {/* <Text style={styles.btnRemoveText}>REMOVE{"\n"}FROM LIST</Text> */}
                        <Icon style={{fontSize: 30}} name='ios-trash' />
                    </Button>
                </View>
                <View style={styles.footerRight}>
                    <Button iconRight
                        style={styles.btnSync}
                        onPress={() => props._onPressSync()}>
                        <Text style={styles.btnSyncText}>SYNC</Text>
                        <Icon style={{fontSize: 30}} name='md-cloud-upload' />
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
                btnSave: {
                    marginRight: 20,
                    width: 80,
                    backgroundColor: CommonStyles.COLOR_WHITE,
                    justifyContent: 'center',
                    alignSelf: 'center',
                },
                    btnSaveText: {
                        color: CommonStyles.COLOR_BLACK,
                        alignSelf: 'center',
                    },
                btnRemove: {       
                    width: 80,
                    backgroundColor: CommonStyles.COLOR_BLACK,
                    justifyContent: 'center',
                    alignSelf: 'center',
                },
                    btnRemoveText: {
                        color: CommonStyles.COLOR_WHITE,
                        alignSelf: 'center',
                    },
            footerRight: {
                flex: 1/2,
                justifyContent: 'center',
            },
                btnSync: {
                    marginRight: 5,
                    width: 120,
                    backgroundColor: CommonStyles.COLOR_RED,
                    // justifyContent: 'center',
                    alignSelf: 'flex-end'
                },
                    btnSyncText: {
                        color: CommonStyles.COLOR_WHITE,
                        alignSelf: 'center',
                        marginLeft: 30
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
