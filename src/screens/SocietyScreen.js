import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet} from "react-native";
import {Image } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { Button, ListItem, Input } from 'react-native-elements'

export const SocietyScreen = ({ navigation }) => {
  const [color1, setColor1] = React.useState('#888888');
  const [color2, setColor2] = React.useState('#888888');
  useEffect(() => {
    getPose()
  }, []);
  async function getPose() {
    var ws = new WebSocket('wss://ncufit.tk/wss/ex/mech1/');
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')

    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    ws.onopen = () => {
      // connection opened
      let msg = {
        "message": "pose",
        "part": "none",
        "sid": id
      };
      ws.send(JSON.stringify(msg)); // send a message
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      var cdt = []
      if (JSON.parse(e.data).sid == id && JSON.parse(e.data).message == 'judgePose')
        cdt = JSON.parse(e.data).part
        
        if (cdt.length == 1){
          setColor1('#888888')
          setColor2('#888888')
        }
        else{
          for(var i = 0; i < cdt.length; i++){
            if(cdt[i]=='back')
             setColor1('#FF0000')
            if(cdt[i]=='hand')
              setColor2('#FF0000')
          }
        }
    };

    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }

  return (
    <View>
      <ListItem 
      title={<View style={{flexDirection: 'row',justifyContent: 'center',
      alignItems: 'center',}}>
        <Text style={{color:'yellow', fontSize:30}}> 上手臂離身體太遠 </Text>
        </View>}
      containerStyle={{ backgroundColor: color1 }}/>
      <ListItem 
      title={<View style={{flexDirection: 'row',justifyContent: 'center',
      alignItems: 'center',}}>
        <Text style={{color:'yellow', fontSize:30}}> 身體晃動幅度過大 </Text>
        </View>}
      containerStyle={{ backgroundColor: color2 }}/>
    </View>
    // <Image 
    //   source={ require('../img/cs.jpg') }
    //   style={{ width: 450, height: 600 }}
    // />
  )
}
