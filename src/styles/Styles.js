import { Dimensions, StyleSheet } from 'react-native';
import CommonStyles  from './Common'

const Styles = StyleSheet.create({
    screen: {
        backgroundColor: CommonStyles.COLOR_GREY,
    },
    screenCenter: {
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    greyRoundInput: {
        backgroundColor: CommonStyles.COLOR_GREY,
        width: Dimensions.get('window').width - 80,
        height: 42,
        marginHorizontal: 20,
        paddingLeft: 5,
        borderRadius: 10,
        color: CommonStyles.COLOR_BLACK,
    },
    greyLine: {
        height: 2,
        backgroundColor: CommonStyles.COLOR_DARK_GREY,
        width: '100%'
    },
})

export default Styles