import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet} from "react-native";
import {Image } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { Button, ListItem, Input } from 'react-native-elements'

export const SocietyScreen = ({ navigation }) => {
  const [color1, setColor1] = React.useState('#888888');
  const [color2, setColor2] = React.useState('#888888');
  const [v, setV] = React.useState(<View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',paddingBottom: 30,paddingTop: 20}}> 
                                      <Text style={{color:'red', fontSize:30}}> 還沒開始訓練呦!! </Text> 
                                    </View>);
  const [connectBC, setConnectBC] = React.useState(false);
  const [connectDL, setConnectDL] = React.useState(false);
  var v2 = <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',paddingBottom: 30,paddingTop: 20}}> 
            <Text style={{color:'red', fontSize:30}}> 還沒開始訓練呦!! </Text> 
          </View>
  var v1 = <View style={{paddingLeft: 40,paddingRight: 40}}>
  <View style={{flexDirection: 'row',justifyContent: 'center',
  alignItems: 'center',paddingBottom: 30,paddingTop: 20}}>
    <Text style={{color:'black', fontSize:30}}> 二頭肌訓練 </Text>
  </View>
  <ListItem 
  title={<View style={{flexDirection: 'row',justifyContent: 'center',
  alignItems: 'center',}}>
    <Text style={{color:'yellow', fontSize:30}}> 身體晃動幅度過大 </Text>
    </View>}
  containerStyle={{ backgroundColor: color1 }}/>
  <ListItem 
  title={<View style={{flexDirection: 'row',justifyContent: 'center',
  alignItems: 'center',}}>
    <Text style={{color:'yellow', fontSize:30}}> 上手臂離身體太遠 </Text>
    </View>}
  containerStyle={{ backgroundColor: color2 }}/>
</View>;

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
        "message": "poseCheck",
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
        var msg = JSON.parse(e.data).message
        var BJ = false;
        var HJ = false;
        // if (msg == "start_workout"){
        //   if (cdt[0] == '上胸')
        //     setV(v1)
        // }
        if (cdt.length == 1){
          if (cdt[0] == 'BC')
            setConnectBC(true)
          else if (cdt[0] == 'DL')
            setConnectDL(true)
          setColor1('#888888')
          setColor2('#888888')
        }
        else{
          for(var i = 0; i < cdt.length; i++){
            if(cdt[i]=='back'){
             setColor1('#FF0000')
             BJ = true;
            }
            if(cdt[i]=='hand'){
              setColor2('#FF0000')
              HJ = true;
            }
          }
          if (!BJ){
            setColor1('#888888')
          }
          if (!HJ){
            setColor2('#888888')
          }
          HJ = false;
          BJ = false;
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
    connectBC ? v1:v2
    // <Image 
    //   source={ require('../img/cs.jpg') }
    //   style={{ width: 450, height: 600 }}
    // />
  )
}


