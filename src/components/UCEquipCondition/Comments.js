import React from 'react'
import { TextInput, View, Dimensions, StyleSheet, Text } from 'react-native'
import { CardItem, Body, Icon, Button, Footer } from "native-base";
import CommonStyles from '../../styles/Common'
import { updateInspectComment, updateJobsiteComment } from '../../redux/actions/Jobsite';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

const CommentsClass = (props) => {
    return (
        <CardItem>
            <Body>
                <Text>Inspection Comments</Text>
                <TextInput
                    multiline={true}
                    value={props.jobsiteData.inspector_note}
                    placeholder={'Inspection Comments'}
                    style={styles.input}
                    onChangeText = { (value) => 
                        props.updateInspectComment(value)
                    } />
                <Text style={{marginTop: 10}} >Jobsite Comments</Text>
                <TextInput
                    multiline={true}
                    value={props.jobsiteData.jobsite_note}
                    placeholder={'Jobsite Comments'}
                    style={styles.input}
                    onChangeText = { (value) => 
                        props.updateJobsiteComment(value)
                    } />
            </Body>
        </CardItem>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: CommonStyles.COLOR_GREY,
        width: '100%',
        height: 120,
        paddingLeft: 5,
        borderRadius: 5,
        color: CommonStyles.COLOR_BLACK,
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        jobsiteData: state.Jobsite,
    }
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        updateInspectComment: (text) => { dispatch(updateInspectComment(text)); },
        updateJobsiteComment: (text) => { dispatch(updateJobsiteComment(text)); },
    }
}

const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsClass)
export { Comments }
