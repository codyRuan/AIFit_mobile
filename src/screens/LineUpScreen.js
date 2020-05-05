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
        Alert.alert('Alert Title', res.message, [{ text: 'OK', onPress: () => { navigation.pop() } },])
      }).done()
  }
  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View >
          <View style={{ paddingLeft: 20, paddingTop: 10, width: 150 }}>
            <Text style={{ fontSize: 50 }}>{route.params.data.item}</Text>
          </View>
          
        </View>
      

        </ScrollView>

    </SafeAreaView>
    
  )

}

export const LineUpScreen = ({ navigation }) => {
  const [Qstatus, setQstatus] = useState(null)
  const [isLoading, setLoading] = useState(true);
  useInterval(() => {
    get_Qstatus()
  }, 1000);
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
          Alert.alert('Alert Title', res.message, [{ text: 'OK' },])
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
          Alert.alert('Alert Title', res.message, [{ text: 'OK' },])
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
      console.log(details)
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
  const lineup_title = (title) => {
    return (
      <View>
        <Text style={styles.header}>{title}</Text>
      </View>

    )
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
                    {lineup_title(first.title)}
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
    position: "absolute",
    left: 20,
    top: 10,
    width: 100,
    height: 100,

    flexDirection: 'row'
  },
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