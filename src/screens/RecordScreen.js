import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  SectionList, FlatList, ActivityIndicator, Button,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={[styles.content, { color: '#0000CC'}]}>{title.time}</Text>
    <Text style={[styles.content, { color: '#5500FF'}]}>{title.item}</Text>
    <Text style={[styles.content, { color: '#9900FF'}]}>{title.group}</Text>
    <Text style={[styles.content, { color: '#FF00FF'}]}>{title.times}</Text>
  </View>
);

export const RecordScreen = ({ navigation }) => {
  const [WorkoutItem, setWorkoutItem] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    get_data();
  });

  async function get_data() {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)

    let details = {
      'user_id': id,
      'uuid': uuid
    };
    console.log(details)
    await fetch('https://ncufit.tk/record/history_api/', {
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
        setWorkoutItem(responseData);
      })
      .finally(() => setLoading(false));
  }



  return (

    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <SectionList
          sections={WorkoutItem}
          keyExtractor={(item, index, group) => index}
          renderItem={({ item }) => <Item title={item} />}
          renderSectionHeader={({ section: { date } }) => (
            <View>
              <Text style={styles.header}>{date}</Text>
              <View style={styles.item}>
                <Text style={[styles.title, { color: '#0000CC'}]}>時間</Text>
                <Text style={[styles.title, { color: '#5500FF'}]}>項目</Text>
                <Text style={[styles.title, { color: '#9900FF'}]}>組數</Text>
                <Text style={[styles.title, { color: '#FF00FF'}]}>次數</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A0522D",
  },
  item: {
    backgroundColor: "#FFDEAD",
    color: "white",
    paddingLeft: 30,
    padding:12,
    marginVertical: 0.25,
    flexDirection: 'row',
  },
  header: {
    fontSize: 32,
    backgroundColor: "#CD853F"
  },
  content: {
    fontSize: 22,
    alignSelf: 'center',
    flex: 1,   
  },
  title:{
    flex: 1,
    fontSize: 24,
    width: 110,
  },
});