import React, {Component} from 'react'
import { TouchableOpacity, Image, View, FlatList, StyleSheet, Text } from 'react-native'
import { Card, Body, Icon, Button, Footer, CardItem } from "native-base";
import CommonStyles from '../../styles/Common'
import { selectComponent, fetchComponentList } from '../../redux/actions/ComponentList';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import UCInspectionManager from '../../business/UCInspectionManager'

import Util from "../../config/Util";

class ComponentListClass extends Component {
    

    _renderItem = (item) => {
        return (<TouchableOpacity
            key={item.id}
            style={{marginTop:-10}}
            onPress={() => {
                this.props._onPressComponent()
                this.props.selectComponent(item) // update redux
                }}>
            <Card style={styles.card}>
                <CardItem>
                    <Body style={styles.body}>
                        <View style={styles.left}>
                            <Image
                                style={styles.image}
                                source={{uri: `data:image/png;base64,${item.image}`}}
                            />
                        </View>
                        <View style={styles.middle}>
                            <Text style={styles.compart}>{item.compart}{' '}{item.position}</Text>
                            <Text style={styles.compartid}>{item.compartid}</Text>
                            <Text style={styles.last_tool_symbol}>{item.last_tool_symbol}</Text>
                        </View>
                        <View style={styles.right}>
                            <View style={styles.rightContent}>
                                <Text style={[styles.percentage,
                                    {color: UCInspectionManager.displayWornPercentageColor(
                                            item.worn_percentage,
                                            this.props.dealershipLimits
                                        )}
                                ]}>
                                    {UCInspectionManager.displayWornPercentage(
                                        item.worn_percentage
                                    )}
                                </Text>
                                <View style={styles.rightBottomContent}>
                                    {Util.Functions.validateString(item.comments)
                                        ? (<FontAwesome 
                                            name='comment'
                                            style={{marginTop:7, marginRight:2, fontSize: 30, alignSelf: 'center', color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : null
                                    }
                                    {Util.Functions.validateString(item.inspection_image)
                                        ? (<FontAwesome 
                                            name='camera'
                                            style={{marginTop:7, fontSize: 30, alignSelf: 'center', color: CommonStyles.COLOR_GREEN}}
                                            />)
                                        : null
                                    }
                                </View>
                            </View>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        </TouchableOpacity>)
    }

    render() {
        return (
            <View>
                {this.props.componentList == null
                    ? null
                    : <FlatList
                        data={this.props.componentList
                            .filter( (item, index, array) => (
                                // LEFT side
                                item.side === this.props.side
                            ))}
                        renderItem={(object) => this._renderItem(object.item)}
                        keyExtractor={item => item.id.toString()}
                    />
                }
            </View>)
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: CommonStyles.COLOR_WHITE,
        height: 80,
    },
        body: {
            flex: 1,
            flexDirection: 'row',
        },
            left: {
                justifyContent: 'center',
                width: 50,
            },
                image: {
                    alignSelf: 'center',
                    height: 40,
                    width: 60,
                    resizeMode: Image.resizeMode.contain,
                },
            middle: {
                marginLeft: 15,
            },
                compart: {
                    fontWeight: 'bold',
                },
            right: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
                rightContent: {
                    flexDirection: 'column',
                },
                    percentage: {
                        fontSize: CommonStyles.FONT_SIZE_REGULAR,
                    },
                    rightBottomContent: {
                        flexDirection: 'row',
                    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        componentList: state.ComponentList.componentList,
        dealershipLimits: state.ComponentList.dealershipLimits,
    }
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        fetchComponentList: () => { dispatch(fetchComponentList()); },
        selectComponent: (item) => { dispatch(selectComponent(item)); },
    }
}

const ComponentList = connect(mapStateToProps, mapDispatchToProps)(ComponentListClass)
export { ComponentList }
