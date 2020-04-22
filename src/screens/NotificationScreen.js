import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Button } from "react-native";
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';


PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification)
  },
  popInitialNotification: true,
  requestPermissions: true
});

// JSON.stringify(remoteMessage.notification.body)   JSON.parse(JSON.stringify(remoteMessage.notification.body))
export const NotificationScreen = ({ navigation }) => {
  const [BigText, setBigText] = useState(null);
  const [SubText, setSubText] = useState(null);
  const [Title, setTitle] = useState(null);
  const [Message, setMessage] = useState(null);
  let d = new Date()
  
  const SendScheduleLocalMessage = () => {
    PushNotification.localNotificationSchedule({
      
      message: "My Notification Message", // (required)
      date: d,
    });
    console.log(d)
  }

  const handleButtonPress = () => {
    PushNotification.localNotification({
      autoCancel: true,
      bigText: BigText,
      subText: "SubText",
      title: Title,
      message: "Message",
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]',
      fireDate :d,
    })
  }

  async function getRemoteMessaging() {
    messaging().onMessage(async remoteMessage => {
      //Alert.alert(JSON.parse(JSON.stringify(remoteMessage.notification.title)), JSON.parse(JSON.stringify(remoteMessage.notification.body)));
      handleButtonPress(remoteMessage.notification.title, remoteMessage.notification.body);
    });
  }
  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }
  useEffect(() => {
    registerAppWithFCM();
    getRemoteMessaging();
    // PushNotification.configure({
    //   // (optional) Called when Token is generated (iOS and Android)
    //   onRegister: function (token) {
    //     console.log('TOKEN:', token)
    //   },
    //   // (required) Called when a remote or local notification is opened or received
    //   onNotification: function (notification) {
    //     console.log('REMOTE NOTIFICATION ==>', notification)
    //     // process the notification here
    //   },
    //   // Android only: GCM or FCM Sender ID
    //   senderID: '256218572662',
    //   popInitialNotification: true,
    //   requestPermissions: true
    // })
  }, []);

  return (
    <View style={styles.container}>
      <Text>Press a button to trigger the notification</Text>
      <View style={{ marginTop: 20, paddingDown: 30 }}>
        <Button title={'Local Push Notification'} onPress={handleButtonPress} />
        <Button title={'Send Local Schedule message'} onPress={SendScheduleLocalMessage} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 20
  }
})

