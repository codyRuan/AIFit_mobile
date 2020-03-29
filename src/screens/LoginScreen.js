import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AuthContext } from "../context";
import AsyncStorage from '@react-native-community/async-storage';

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

callbackFunction = async (navigation) => {
  const value = await AsyncStorage.getItem('@testproject:user_id')
  /*if (value != null)
    navigation.navigate("Tabs")*/
}

export const LoginScreen = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
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
            { callback: this.callbackFunction, },
          ), signIn()} >
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