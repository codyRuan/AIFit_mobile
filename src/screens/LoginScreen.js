import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { AuthContext } from "../context";
import AsyncStorage from '@react-native-community/async-storage';

_retrieveDataLogin = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('获取成功 in login');
      return value;
    } else {
      console.log('获取失败 in login');
      return null;
    }
  } catch (error) {
    console.log('获取失败 in login');
  }
}

export const success = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  Alert.alert(
    'Welcome',
    "login successfully",
    [
      {
        text: 'OK', onPress: () => {
          signIn()
          navigation.pop()
        }
      },
    ]
  )
  return (
    <View></View>
  )
}

callbackFunction = async (navigation) => {
  this._retrieveDataLogin('@UserStorage:user_id')
    .then((response) => {
      if (response != null) {
        navigation.push('success')
        console.log(response)
      }
      else{
        navigation.pop()
      }
    })
}

export const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.background} source={require('../img/background.jpg')} />
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 40 }]}>NCUFit</Text>
        <Text style={styles.desc}>Automatically Record Your Workout / AI Expert Advise</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}></Text>
      </View>

      <View style={styles.bottmContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#53423D' }]}
          onPress={() => navigation.push(
            'Browser',
            { callback: this.callbackFunction, }
          )} >
          <Text style={styles.buttonText}>Login via NCU portal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const Splash = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image style={styles.background} source={require('../img/background.jpg')} />
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 40 }]}>NCUFit</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottmContainer: {
    height: 60,
    flexDirection: 'row',
  },
  background: {
    height: 800,
    width: 600,
    position: 'absolute',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  desc: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center'
  }
});