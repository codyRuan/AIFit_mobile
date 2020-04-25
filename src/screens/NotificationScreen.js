import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Button, ActivityIndicator } from "react-native";
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidNotificationPermission from 'react-native-android-notification-permission';
import { ListItem } from 'react-native-elements'

const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },

]

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification)
  },
  popInitialNotification: true,
  requestPermissions: true
});

export async function checkAndroidNotificationPermission() {
  const permissions = await RNAndroidNotificationPermission.checkNoticficationPermission();
  console.log("notification permission: " + permissions);
}

export async function getRemoteMessaging() {
  messaging().onMessage(async remoteMessage => {
    //Alert.alert(JSON.parse(JSON.stringify(remoteMessage.notification.title)), JSON.parse(JSON.stringify(remoteMessage.notification.body)));
    console.log(remoteMessage.data)
    handleButtonPress(remoteMessage.data.body, remoteMessage.data.title);
  });
}

function handleButtonPress(BigText, Title) {
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
  })
}

export async function getDeviceToken() {
  await messaging()
    .getToken()
    .then(token => {
      saveTokenToDatabase(token);
    });
}

async function saveTokenToDatabase(token) {
  console.log("device token:" + token);
  var id = await AsyncStorage.getItem('@UserStorage:user_id')
  id = JSON.parse(id)
  let details = {
    'user_id': id,
    'token': token,
  }

  console.log(JSON.stringify(details))
  await fetch('https://ncufit.tk/notification/getToken/', {
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
    })
}



// JSON.stringify(remoteMessage.notification.body)   JSON.parse(JSON.stringify(remoteMessage.notification.body))
export const NotificationScreen = ({ navigation }) => {
  const [BigText, setBigText] = useState(null);
  const [SubText, setSubText] = useState(null);
  const [Title, setTitle] = useState(null);
  const [MessageList, setMessageList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  async function loadDBmessage() {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid
    };

    await fetch('https://ncufit.tk/notification/getMessage/', {
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
        setMessageList(responseData)
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDBmessage();
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
    <View>
      {isLoading ? <ActivityIndicator /> : (
        <View>
          {
            MessageList.map((l, i) => (
              <ListItem
                key={i}
                //leftAvatar={{ source: { uri: l.avatar_url } }}
                title={l.datetime}
                subtitle={l.body}
                leftIcon={{ name: 'sms' }}
                bottomDivider
              />
            ))
          }
        </View>
      )}
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

