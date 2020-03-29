import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import qs from 'qs';
import { Alert, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "./context";
const URI = 'https://portal3g.ncu.edu.tw/oauth2/authorization?type=web_server&client_id=%2320200205015015-lZEQOJ3v&redirect_uri=https://ncufit.tk/oauth/callback&response_type=code&scope=identifier+chinese-name+english-name+gender+birthday+personal-id+student-id+academy-records+email+mobile-phone+notification+calendar+bulletin+modal-dialog';
const REDIRECT_URI = 'https://ncufit.tk/oauth/callback/';

export const Browser = ({ navigation, route }) => {
  const [state, setState] = React.useState(true)
  onNavigationStateChange = ({ loading, url }) => {
    console.log(route)
    if (!loading) {
      if (url.indexOf(REDIRECT_URI) !== -1) {
        const code = qs.parse(url.split('?')[1]);
        fetch(URI)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(JSON.stringify(responseJson)),
              AsyncStorage.setItem(
                '@testproject:user_id',
                JSON.stringify(responseJson.identifier)),
              AsyncStorage.setItem(
                '@testproject:user_info',
                JSON.stringify(responseJson))
          })
          .catch((error) => {
            console.error(error);
          })
        setState(false);
        return false;

      }
    }
    return true;
  }
  if (state) {
    return (<WebView
      source={{ uri: URI }}
      onShouldStartLoadWithRequest={this.onNavigationStateChange}
      onNavigationStateChange={this.onNavigationStateChange}
    />
    )
  }
  Alert.alert(
    'Alert Title',
    "login successfully",
    [
      {
        text: 'OK', onPress: () => {
          route.params.callback(navigation)
          navigation.pop()
        }
      },
    ]
  )
  return (
    <View>
    </View>
  )
}