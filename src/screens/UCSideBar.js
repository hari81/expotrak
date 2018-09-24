import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { connect } from 'react-redux';
import { Container, Content, Text, List, ListItem, Icon } from "native-base"

import CommonStyles from '../styles/Common'
import * as authActions from '../redux/actions/auth';

const routes = [
  "Home",
  "Logout"
]

class SideBar extends React.Component {

  _navigateScreen = (data) => {
    switch(data) {
      case 'Home':
        this.props.navigation.navigate('UCMain')
        break
      case 'Logout':
        // Update Redux
        this.props.logout()
        break
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <Text style={styles.username}>{this.props.username}</Text>
          <List
            dataArray={routes}
            renderRow={data => {
                return (
                    <View>
                      <ListItem
                          button
                          onPress={() => this._navigateScreen(data)}>
                          <Icon style={styles.icon} name={
                            data === 'Home'
                              ? 'md-home' : 'md-log-out'
                          } />
                          <Text style={styles.text}>{data}</Text>
                      </ListItem>
                    </View>
                )
            }}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingTop: 20,
    backgroundColor: 'rgba(238, 108, 108, 0.8)'
  },
    username: {
      color: '#ffffff', fontSize: 18, fontWeight: 'bold', paddingTop: 10, alignSelf: 'center'
    },
    icon: {
      fontSize: 26, 
      marginRight: 15, 
      color: CommonStyles.COLOR_WHITE,
      fontWeight: 'bold'
    },
    text: {
      color: CommonStyles.COLOR_WHITE,
      fontWeight: 'bold'
    }
})

const mapStateToProps = (state, ownProps) => {
  return {
      isLoggedIn: state.auth.isLoggedIn,
      username: state.auth.username,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      logout: () => { dispatch(authActions.logout()); },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);