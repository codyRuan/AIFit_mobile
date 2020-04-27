/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const getremotemessage = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!');
        handleButtonPress();
    });
}

function handleButtonPress() {
    PushNotification.localNotification({
      autoCancel: true,
      title: "t",
      message: "Message",
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]',
    })
  }

AppRegistry.registerComponent(appName, () => App);
