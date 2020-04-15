import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  SectionList, FlatList, ActivityIndicator, Button, Image, TouchableOpacity, Alert
} from "react-native";
import { AuthContext } from "../context";
import AsyncStorage from '@react-native-community/async-storage';



export const LineUpScreen = ({ navigation }) => {
  const [Queue, setQueue] = useState(null)
  
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
      }).done()
  }
  return (
    <View style={styles.container}>
      <View style={styles.num}>
        <Text style={styles.font}>1</Text>
      </View>
      <TouchableOpacity style={[styles.button, styles.num]} onPress={() => join_the_queue("chest")} >
        <Text style={styles.font}>排chest!</Text>
      </TouchableOpacity>
    </View>

  );

}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: "space-between",
  },
  num: {
    width: 180,
    height: 100,
    backgroundColor: "#7E57C2"
  },
  add: {
    width: 180,
    height: 100,
    backgroundColor: "#9575CD"
  },
  font: {
    flex: 1,
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tmp:{
    backgroundColor: "#FFDEAD",
    color: "white",
    paddingLeft: 30,
    padding:12,
    marginVertical: 0.25,
    flexDirection: 'row',
  }
});