import React, { Component } from 'react';
 
import { Platform, StyleSheet, View, Text, TouchableOpacity, ProgressBarAndroid, ProgressViewIOS } from 'react-native';
 
export default class ProgressBar extends Component
{
  constructor()
  {
    super();
 
    this.state = { 
      
      Progress_Value: 0.00
    }
  }
 
  Start_Progress = () =>
  {
 
    this.value = setInterval( () => {
      
      if(this.state.Progress_Value <= 1)
      
      {
        
        this.setState({Progress_Value: this.state.Progress_Value + .01})
      
      }
    
    }, 100 );
 
  }
 
  Stop_Progress = () =>{
 
   clearInterval(this.value);
 
  }
 
  Clear_Progress =()=>{
 
    this.setState({Progress_Value : 0.0})
  }
 
  render()
  {
    return(
      <View style = { styles.MainContainer }>
 
        <Text style = {{fontSize: 20, color: '#000'}}> Progress Value: { parseFloat((this.state.Progress_Value * 100).toFixed(3))} %</Text>
 
        {
            ( Platform.OS === 'android' )
            ?
              ( <ProgressBarAndroid styleAttr = "Horizontal" progress = { this.state.Progress_Value } indeterminate = { false } /> )
            :
              ( <ProgressViewIOS progress = { this.state.Progress_Value } /> )
        }
 
        
        <TouchableOpacity activeOpacity = { 0.7 } style = { styles.button } onPress = { this.Start_Progress }>
 
          <Text style = { styles.TextStyle }> Start Progress </Text>
 
        </TouchableOpacity>
 
 
        <TouchableOpacity activeOpacity = { 0.7 } style = { styles.button } onPress = { this.Stop_Progress }>
 
          <Text style = { styles.TextStyle }> Stop Progress </Text>
 
        </TouchableOpacity>
 
 
        <TouchableOpacity activeOpacity = { 0.7 } style = { styles.button } onPress = { this.Clear_Progress }>
 
          <Text style = { styles.TextStyle }> Reset Progress </Text>
 
        </TouchableOpacity>
      
      </View>
    );
  }
}
 
const styles = StyleSheet.create(
{
  MainContainer:
  {
    flex: 1,
    justifyContent: 'center',
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0,
    margin: 20
  },
 
  button: {
    
  width: '100%',
  backgroundColor: '#00BCD4',
  borderRadius:5,
  padding: 10,
  marginTop: 10,
 
},
 
TextStyle:{
    color:'#fff',
    textAlign:'center',
}
});