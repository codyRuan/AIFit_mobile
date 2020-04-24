import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Button,
  TextInput,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons"
import { LoginScreen, Splash, success } from './src/screens/LoginScreen';
import { LineUpScreen, LineUpDetails } from './src/screens/LineUpScreen';
import { RecordScreen } from './src/screens/RecordScreen';
import { NotificationScreen } from './src/screens/NotificationScreen';
import { SocietyScreen } from './src/screens/SocietyScreen';
import { Profile } from './src/screens/Profile';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "./src/context"
import { Browser } from "./src/browser";
import {getDeviceToken,getRemoteMessaging,checkAndroidNotificationPermission} from "./src/screens/NotificationScreen";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'LineUp') {
          iconName = 'ios-person-add';
        }
        else if (route.name === 'Record') {
          iconName = 'ios-stats';
        }
        else if (route.name === 'Notification') {
          iconName = focused
            ? 'ios-notifications'
            : 'ios-notifications-outline';
        }
        else if (route.name === 'Society') {
          iconName = focused
            ? 'ios-people'
            : 'ios-people';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tabs.Screen name="LineUp" component={LineUpStackScreen} />
    <Tabs.Screen name="Record" component={RecordScreen} />
    <Tabs.Screen name="Notification" component={NotificationScreen} />
    <Tabs.Screen name="Society" component={SocietyScreen} />
  </Tabs.Navigator>
)
const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator >
    <HomeStack.Screen name="TabsScreen" component={TabsScreen}
      options={{
        title: null,
        headerLeft: () => (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderRadius: 50,
            }}
            onPress={() => navigation.navigate('Profile')} >
            <Icon name={'ios-person'} size={30} color="gray" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderRadius: 50,
            }}
            onPress={() => navigation.navigate('LineUpStatus')} >
            <Icon name={'ios-list'} size={30} color="gray" />
          </TouchableOpacity>
        ),
      }} />
  </HomeStack.Navigator>
);
const LineUpStack = createStackNavigator();
const LineUpStackScreen = () => (
  <LineUpStack.Navigator headerMode="none" >
    <LineUpStack.Screen name="LineUp" component={LineUpScreen} />
    <LineUpStack.Screen name="LineUpDetails" component={LineUpDetails} />
  </LineUpStack.Navigator>
);
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} options={{ title: "個人資訊" }} />
  </ProfileStack.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (

  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeStackScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
    <Drawer.Screen name="LineUpStatus" component={LineUpScreen} options={{ title: "LineUpStatus" }} />
  </Drawer.Navigator>
);

const LoginStack = createStackNavigator();
const LoginStackScreen = () => (
  <LoginStack.Navigator initialRouteName="Login" headerMode="none" >
    <LoginStack.Screen name="Login" component={LoginScreen} />
    <LoginStack.Screen name="Browser" component={Browser} />
    <LoginStack.Screen name="success" component={success} />
  </LoginStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ UserToken }) => (

  <RootStack.Navigator headerMode="none">
    {UserToken ? (
      <RootStack.Screen name="Tabs" component={DrawerScreen} />
    ) : (
        <RootStack.Screen name="Login" component={LoginStackScreen} />
      )}

  </RootStack.Navigator>
)

_retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('获取成功 in APP', value);
      return value;
    } else {
      console.log('获取失败', value);
      return null;
    }
  } catch (error) {
    console.log('获取失败');
  }
}

_removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('移除成功');
  } catch (error) {
    console.log('移除失败');
  }
}

checkLogin = async (setIsLoading, setUserToken) => {
  console.log("checkLogin called");

  var id = await AsyncStorage.getItem('@UserStorage:user_id')
  var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
  id = JSON.parse(id)
  uuid = JSON.parse(uuid)

  let details = {
    'user_id': id,
    'uuid': uuid
  };
  console.log(details)

  try {
    response = await new Promise((res, rej) => {
      fetch('https://ncufit.tk/checklogin/', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": 'application/json',
          "Connection": "close",
          "type": "getUserData",
        },
        body: JSON.stringify(details)
      }).then((response) =>
        response.json()
      ).then((res) => {
        console.log(res.code)
        if (res.code == '300') {
          console.log("checkLogin success");
          setUserToken(uuid)
          setIsLoading(false)
          console.log(uuid)
          return uuid
        } else {
          console.log("token has died");
          setUserToken(null)
          setIsLoading(false)

        }
      }).catch((err) => {
        console.log(err)
        setIsLoading(false)
      }).done();
    })
  } catch (e) {
    console.log(e)
  }
}

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [UserToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        _retrieveData('@UserStorage:user_id')
          .then((response) => {
            setUserToken(response)
          })
      },
      signOut: () => {
        setIsLoading(false);
        _removeData('@UserStorage:user_id')
          .then((response) => {
            setUserToken(null);
          })
        console.log(UserToken)
      }
    }
  })
  React.useEffect(() => {
    console.log(isLoading)
    if (isLoading) {
      res = checkLogin(setIsLoading, setUserToken).then((response) =>
        console.log(response)
      )
      console.log(res)
      console.log("test")

    }
    checkAndroidNotificationPermission();
    getDeviceToken();
    getRemoteMessaging();
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000) //timeout after 1000 ms
  }, []);
  if (isLoading) {
    return <Splash />;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen UserToken={UserToken} />
      </NavigationContainer>
    </AuthContext.Provider>

  )
}