import 'react-native-get-random-values';
import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import qs from 'qs';
import { Alert, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "./context";
const URI = 'https://portal3g.ncu.edu.tw/oauth2/authorization?type=web_server&client_id=%2320200205015015-lZEQOJ3v&redirect_uri=https://ncufit.tk/oauth/callback&response_type=code&scope=identifier+chinese-name+english-name+gender+birthday+personal-id+student-id+academy-records+email+mobile-phone+notification+calendar+bulletin+modal-dialog';
const REDIRECT_URI = 'https://ncufit.tk/oauth/callback/';

let user_info
console.disableYellowBox = true;
_retrieveDataglobal = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('获取成功 in Profile', value);
      return value;
    } else {
      console.log('获取失败', value);
      return null;
    }
  } catch (error) {
    console.log('获取失败');
  }
}

export const Browser = ({ navigation, route }) => {
  const [state, setState] = React.useState(true)
  onNavigationStateChange = ({ loading, url }) => {
    console.log(route)
    if (!loading) {
      console.log(url.indexOf(REDIRECT_URI))
      if (url.indexOf(REDIRECT_URI) !== -1) {
        //const code = qs.parse(url.split('?')[1]);
        fetch(URI)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(JSON.stringify(responseJson)),
              AsyncStorage.setItem(
                '@UserStorage:user_id',
                JSON.stringify(responseJson.identifier)),
              AsyncStorage.setItem(
                '@UserStorage:user_info',
                JSON.stringify(responseJson)),
              AsyncStorage.setItem(
                '@UserStorage:uuid',
                JSON.stringify(responseJson.uuid))
          })
          .catch((error) => {
            console.error(error);
          })
        _retrieveDataglobal('@UserStorage:user_info')
          .then((response) => {
            user_info = JSON.parse(response)
            global.user_info = user_info
          })

        setState(false);
        return false;
      }
    }
    return true;
  }
  const { signIn } = React.useContext(AuthContext);
  if (state) {
    return (<WebView
      source={{ uri: URI }}
      onShouldStartLoadWithRequest={this.onNavigationStateChange}
      onNavigationStateChange={this.onNavigationStateChange}
      thirdPartyCookiesEnabled={false}
    />
    )
  }
  if (!state) {
    route.params.callback(navigation)

  }

  return (
    <View>
    </View>
  )
}