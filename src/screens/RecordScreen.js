import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Button, ButtonGroup } from 'react-native-elements'

export const RecordScreen = ({ navigation }) => {
  const [WorkoutItem, setWorkoutItem] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    get_data();
  }, []);

  async function get_data() {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid
    };
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
    <ScrollView>
      {isLoading ? <ActivityIndicator /> : (
        <View>
          {
            WorkoutItem.map((l, i) => (
              <View>
                <ListItem
                  key={i}
                  //leftAvatar={{ source: { uri: l.avatar_url } }}
                  title={
                    <Text style={styles.header}>{l.date}</Text>
                  }
                  chevron
                />
                <ListItem
                  title={
                    <View>
                      <View style={styles.titlestyle}>
                        <Text style={[styles.titletextstyle, { color: '#0000CC' }]}>耗時</Text>
                        <Text style={[styles.titletextstyle, { color: '#5500FF' }]}>項目</Text>
                        <Text style={[styles.titletextstyle, { color: '#9900FF' }]}>組數</Text>
                        <Text style={[styles.titletextstyle, { color: '#FF00FF' }]}>次數</Text>
                      </View>
                      {
                        l.data.map((d, j) => (
                          <ListItem
                            key={j}
                            title={
                              <View style={styles.subtitleView}>
                                <Text style={[styles.title, { color: '#0000CC' }]}>10min</Text>
                                <Text style={[styles.title, { color: '#5500FF' }]}>{d.item}</Text>
                                <Text style={[styles.title, { color: '#9900FF' }]}>{d.group}</Text>
                                <Text style={[styles.title, { color: '#FF00FF' }]}>{d.times}</Text>
                              </View>
                            }
                            topDivider
                          />
                        ))
                      }
                    </View>
                  }
                />
              </View>
            ))
          }
        </View>
      )}
    </ScrollView>
  )
}

styles = StyleSheet.create({
  dateView: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 5,
  },
  titlestyle: {
    flexDirection: 'row',
    paddingLeft: 35,
    paddingRight: 25,
  },
  titletextstyle: {
    paddingBottom: 15,
    fontSize: 18,
    flex: 1,
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey'
  },
  title: {
    flex: 1,
    fontSize: 18,
    width: 110,
  },
  header: {
    fontSize: 24,
    
  },
})