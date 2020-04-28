import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  SectionList, FlatList, ActivityIndicator, Button, Image, TouchableOpacity, Alert
} from "react-native";
import { AuthContext } from "../context";
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CountDown from 'react-native-countdown-component';
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
  const [countdowntime, setcountdowntime] = useState(null)
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
        Alert.alert('Alert Title', res.message, [{ text: 'OK', onPress: () => { navigation.pop() } },])
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
        Alert.alert('Alert Title', res.message, [{ text: 'OK', onPress: () => { navigation.pop() } },])
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
        Alert.alert('Alert Title', res.message, [{ text: 'OK', onPress: () => { navigation.pop() } },])
      }).done()
  }
  useEffect(() => {
    get_countdown(route.params.item)
  }, []);
  async function get_countdown(part) {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')

    id = JSON.parse(id)
    uuid = JSON.parse(uuid)

    let details = {
      'user_id': id,
      'uuid': uuid,
      'part': part
    };
    await fetch('https://ncufit.tk/lineup/GetTimer/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (countdowntime != responseData) {
          var tmp = parseInt(responseData.message, 10)
          setcountdowntime(tmp);
          console.log(tmp)
        }
      }).done()

  }
  if (route.params.precedence == 1) {
    return (
      <View>
        {countdowntime ? (<CountDown
          until={countdowntime}
          size={30}
          onFinish={() => alert('Finished')}
          digitStyle={{ backgroundColor: '#FFF' }}
          digitTxtStyle={{ color: '#1CC625' }}
          timeToShow={['M', 'S']}
          timeLabels={{ m: 'MM', s: 'SS' }}
        />) : (
            <ActivityIndicator />
          )}

        <Button
          onPress={() => {
            start_workout(route.params.item),
              route.params.setLoading(true)
          }}
          title="開始使用!"
          color="skyblue"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => {
            leave_the_queue(route.params.item),
              route.params.setLoading(true)
          }}
          title="結束排隊!"
          color="skyblue"
          accessibilityLabel="Learn more about this purple button"
        />

      </View>
    )
  }
  else {
    return (
      <View>
        <Button
          onPress={() => {
            join_the_queue(route.params.item),
              route.params.setLoading(true)
          }}
          title="仍要排隊!"
          color="skyblue"
          accessibilityLabel="Learn more about this purple button"
        />

      </View>
    )
  }

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
        // console.log(JSON.stringify(responseData))
        if (Qstatus != responseData) {
          setQstatus(responseData);
          setLoading(false)
        }
      }).done()

  }
  const test = (title) => {
    if (title.precedence == 1) {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statsBox, styles.statsBoxContainer}>

            <View style={{ flex: 5, backgroundColor: 'powderblue' }}>
              <Text style={{ fontSize: 30 }}>{title.amount}人</Text>
            </View>

            <TouchableOpacity style={{ flex: 4, backgroundColor: 'skyblue' }} onPress={() => { navigation.push('LineUpDetails', { item: title.item, amount: title.amount, precedence: title.precedence, setLoading: setLoading }) }}  >
              <Text style={styles.font}>輪到你了!</Text>
            </TouchableOpacity>

          </View>
        </View>
      )
    }
    else {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statsBox, styles.statsBoxContainer}>

            <View style={{ flex: 5, backgroundColor: 'powderblue' }}>
              <Text style={{ fontSize: 30 }}>{title.amount}人</Text>
            </View>

            <TouchableOpacity style={{ flex: 4, backgroundColor: 'skyblue' }} onPress={() => { navigation.push('LineUpDetails', { item: title.item, amount: title.amount, precedence: title.precedence, setLoading: setLoading }) }}  >
              <Text style={styles.font}>{title.user_qstatus}</Text>
            </TouchableOpacity>

          </View>
        </View>
      )
    }

  }
  const Item = ({ title }) => (
    test(title)
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <SectionList
          sections={Qstatus}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item title={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>

  );

}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    flex: 1,
    justifyContent: "space-between",
  },
  font: {
    flex: 1,
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
    padding: 10,
    marginVertical: 8
  },
  statsBox: {
    alignItems: "center",
    flex: 1
  },
  statsBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderBottomColor: "#DFD8C8",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24
  },
});