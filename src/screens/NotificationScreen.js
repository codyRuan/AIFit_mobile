import React, { useState, useEffect } from 'react';
import {
  View, Text, Alert, StyleSheet, Button,
  ActivityIndicator, ScrollView
} from "react-native";
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidNotificationPermission from 'react-native-android-notification-permission';
import { ListItem, Overlay } from 'react-native-elements';

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
    console.log(remoteMessage.data)
    handleButtonPress(remoteMessage.data.body, remoteMessage.data.title);
  });
}

// export function pushOverlay() {
//   var isVisible=true;
//   return(
//   <Overlay
//     isVisible={true}
//     //onBackdropPress={() => { isVisible = false }}
//   >
//     <Text>Hello from Overlay!</Text>
//   </Overlay>
//   )
// }

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


export const NotificationScreen = ({ navigation }) => {
  const [BigText, setBigText] = useState(null);
  const [SubText, setSubText] = useState(null);
  const [Title, setTitle] = useState(null);
  const [MessageList, setMessageList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadDBMessage();
  }, []);

  async function loadDBMessage() {
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

  function deleteMessageAlert(dt) {
    Alert.alert(
      "warning",
      "Are you sure to delete the message on " + dt + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "DELETE", onPress: () => deleteMessage(dt) }
      ],
      { cancelable: false }
    );
  }

  async function deleteMessage(dt) {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid,
      'datetime': dt,
    };
    await fetch('https://ncufit.tk/notification/deleteMessage/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    })
      .catch((error) => {
        Alert.alert("Delete failed")
      })
      .then((response) => response.json())
      .then((responseData) => {
        Alert.alert("Delete successfully!", responseData)
      })

      .finally(() => loadDBMessage());
  }

  return (
    <ScrollView>
      {isLoading ? <ActivityIndicator /> : (
        <View>
          {
            MessageList.reverse().map((l, i) => (
              <ListItem
                key={i}
                //leftAvatar={{ source: { uri: l.avatar_url } }}
                title={l.datetime}
                subtitle={l.body}
                leftIcon={{ name: 'sms' }}
                bottomDivider
                onLongPress={() => { deleteMessageAlert(l.datetime) }}
                onPress={() => { loadDBMessage() }}
              />
            ))
          }
        </View>
      )}
    </ScrollView>
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

