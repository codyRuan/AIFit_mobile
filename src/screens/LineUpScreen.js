import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  SectionList, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, ScrollView
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import CountDown from 'react-native-countdown-component';
import { Button, ListItem, Input } from 'react-native-elements'
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const LineUpDetails = ({ navigation, route }) => {
  const [Times, setTimes] = React.useState(0);
  const [Group, setGroup] = React.useState(0);
  const [ALLtrain, setALLtrain] = React.useState(null);
  const [isLoading, setLoading] = useState(true);
  async function leave_the_queue(part) {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid,
      'part': part,
      'group': Group,
      'times': Times
    };
    console.log(details)
    await fetch('https://ncufit.tk/lineup/leave/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res.message)
        Alert.alert(' ', res.message, [{ text: 'OK', onPress: () => { navigation.pop() } },])
      }).done()
  }

  useInterval(() => {
    get_ts(route.params.data.item)
  }, 1000);

  async function get_ts(part) {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid,
      'part': part
    };
    await fetch('https://ncufit.tk/counting/getcurrentset/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(JSON.stringify(responseData))
        setTimes(responseData.times)
        setGroup(responseData.group)
        setALLtrain(responseData.all)
        setLoading(false)
      }).done()
  }
  return (

    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (<ScrollView showsVerticalScrollIndicator={true}>
        

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ paddingTop: 35 }}>
            <Text style={{ fontSize: 50 }}>{route.params.data.item}</Text>
          </View>

          <View style={{ width: 200, paddingLeft: 70, paddingTop: 48 }}>
            <Button
              onPress={() => {
                leave_the_queue(route.params.data.item)

              }}

              title="結束訓練"
              color="skyblue"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </View>


        <View style={{ paddingTop: 30 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30 }}>第{Group}組重量20LBS的次數</Text>
            <View style={{ paddingTop: 15 }}>
              <Text style={{ fontSize: 35 }}>{Times}</Text>
            </View>
          </View>
        </View>

        <View >
          <ListItem
            title={
              <View>
                <View style={{ flexDirection: 'row', paddingLeft: 35, paddingRight: 25 }}>
                  <Text style={{ paddingBottom: 15, fontSize: 18, flex: 1 }}>組別</Text>
                  <Text style={{ paddingBottom: 15, fontSize: 18, flex: 1 }}>次數</Text>
                  <Text style={{ paddingBottom: 15, fontSize: 18, flex: 1 }}>重量(LBS)</Text>
                </View>
                <View>
                  {
                    ALLtrain.map((d, j) => (
                      <ListItem
                        key={j}
                        title={
                          <View style={styles.subtitleView}>
                            <Text style={{ flex: 1, fontSize: 18, width: 110, }}>{d.group}</Text>
                            <Text style={{ flex: 1, fontSize: 18, width: 110, }}>{d.times}</Text>
                            <Text style={{ flex: 1, fontSize: 18, width: 110, }}>20</Text>
                          </View>
                        }
                        topDivider
                      />
                    ))
                  }
                </View>

              </View>
            }
          />
        </View>
      </ScrollView>)}
      
    </SafeAreaView>
  )
}

// export const LineUpDetails = ({ navigation, route }) => {
//   return (

    
//   )
// }




export const LineUpScreen = ({ navigation }) => {
  const [Qstatus, setQstatus] = useState(null)
  const [isLoading, setLoading] = useState(true);
  const [TimerIsOn, setTimerIsOn] = useState(false);
  useInterval(() => {
    get_Qstatus()
  }, 1000);
  useEffect(() => {
    timmmer()
  }, []);
  async function timmmer() {
    var ws = new WebSocket('wss://ncufit.tk/wss/ex/mech1/');
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')

    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    ws.onopen = () => {
      // connection opened
      let msg = {
        "message": "clock",
        "part": "none",
        "sid": id
      };
      ws.send(JSON.stringify(msg)); // send a message
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      console.log(typeof(JSON.parse(e.data).sid));
      if (JSON.parse(e.data).sid == id && JSON.parse(e.data).message == 'timer')
        setTimerIsOn(JSON.parse(e.data).part)
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
  
  async function get_Qstatus() {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')

    id = JSON.parse(id)
    uuid = JSON.parse(uuid)

    let details = {
      'user_id': id,
      'uuid': uuid
    };
    await fetch('https://ncufit.tk/lineup/getQstatus/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(JSON.stringify(responseData))
        setQstatus(responseData);
        setLoading(false)

      }).done()
  }
  const LineUpAction = (data) => {
    async function join_the_queue(part) {
      var id = await AsyncStorage.getItem('@UserStorage:user_id')
      var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
      id = JSON.parse(id)
      uuid = JSON.parse(uuid)
      let details = {
        'user_id': id,
        'uuid': uuid,
        'part': part
      };
      console.log(details)
      await fetch('https://ncufit.tk/lineup/join/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res.message)
          Alert.alert(' ', res.message, [{ text: 'OK' },])
        }).done()
    }
    async function leave_the_queue(part) {
      var id = await AsyncStorage.getItem('@UserStorage:user_id')
      var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
      id = JSON.parse(id)
      uuid = JSON.parse(uuid)
      let details = {
        'user_id': id,
        'uuid': uuid,
        'part': part
      };
      console.log(details)
      await fetch('https://ncufit.tk/lineup/leave/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res.message)
          Alert.alert(' ', res.message, [{ text: 'OK' },])
        }).done()
    }
    async function start_workout(part) {
      var id = await AsyncStorage.getItem('@UserStorage:user_id')
      var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
      id = JSON.parse(id)
      uuid = JSON.parse(uuid)
      let details = {
        'user_id': id,
        'uuid': uuid,
        'part': part
      };
      await fetch('https://ncufit.tk/lineup/StartWorkout/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res.message)
        }).done()
    }

    var item = JSON.parse(JSON.stringify(data.item))
    var amount = JSON.parse(JSON.stringify(data.amount))
    var precedence = JSON.parse(JSON.stringify(data.precedence))

    if (data.precedence == 1) {
      Alert.alert(
        item,
        "到你了!",
        [
          { text: "開始訓練", onPress: () => { navigation.push('LineUpDetails', { data }), start_workout(item) } },
          {
            text: "離開列隊",
            onPress: () => leave_the_queue(item),
            style: "cancel"
          }
        ],
      );
    }

    else if (data.precedence != -1 && data.precedence != 0) {
      Alert.alert(
        item,
        (precedence - 1).toString(),
        [
          { text: "離開列隊", onPress: () => leave_the_queue(item) },
          {
            text: "取消",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
      );
    }
    else {

      Alert.alert(
        item,
        amount.toString(),
        [
          { text: "仍要排隊", onPress: () => join_the_queue(item) },
          {
            text: "取消",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
      );
    }
  }
  const lineup_title = (first, t) => {

    var cd = parseInt(JSON.parse(JSON.stringify(first.data[0].countdown)), 10)
    var pd = parseInt(JSON.parse(JSON.stringify(first.data[0].precedence)), 10)
    var item = JSON.parse(JSON.stringify(first.data[0].item))
    if (pd == 1) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.header}>{first.title}</Text>
          <View style={{ paddingLeft: 180 }}>
            <Text>{t}秒</Text>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.header}>{first.title}</Text>
        </View>
      )
    }
  }
  return (
    <ScrollView>
      {isLoading ? <ActivityIndicator /> : (
        <View>{
          Qstatus.map((first, i) => (
            <View>
              <ListItem
                key={i}
                title={
                  <View>
                    {lineup_title(first,TimerIsOn)}
                    {
                      first.data.map((second, j) => (
                        <ListItem
                          key={j}
                          title={
                            <View style={styles.subtitleView}>
                              <Text style={[styles.font, { color: '#000080' }]}>{second.amount}人</Text>

                              <TouchableOpacity style={[styles.title]} onPress={() => { LineUpAction(second) }}  >
                                <Text style={[styles.font, { color: '#000080' }]}>{second.user_qstatus}</Text>
                              </TouchableOpacity>
                            </View>
                          }
                          bottomDivider />
                      ))}
                  </View>
                }
              />
            </View>
          ))
        }
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    paddingLeft: 20,
    paddingTop: 10,
    width: 150
  }

  ,
  times: {
    position: "absolute",
    top: 70,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  group: {
    position: "absolute",
    top: 170,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  font: {
    flex: 1,
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 5
  },
  title: {
    flex: 1,
    fontSize: 18,
    width: 110,
  },

});