import 'react-native-gesture-handler';
// In App.js in a new project

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
import { LoginScreen, Splash } from './src/screens/LoginScreen';
import { LineUpScreen } from './src/screens/LineUpScreen';
import { RecordScreen } from './src/screens/RecordScreen';
import { NotificationScreen } from './src/screens/NotificationScreen';
import { SocietyScreen } from './src/screens/SocietyScreen';
import { Profile } from './src/screens/Profile';

import { AuthContext } from "./src/context"
import { Browser } from "./src/browser";
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
    <Tabs.Screen name="LineUp" component={LineUpScreen} />
    <Tabs.Screen name="Record" component={RecordScreen} />
    <Tabs.Screen name="Notification" component={NotificationScreen} />
    <Tabs.Screen name="Society" component={SocietyScreen} />
  </Tabs.Navigator>
)
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator >
    <HomeStack.Screen name="TabsScreen" component={TabsScreen}
      options={{
        headerLeft: () => (
          <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
          />
        ),
      }} />
  </HomeStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} options={{ title: "User's name" }} />
  </ProfileStack.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeStackScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
  </Drawer.Navigator>
);
const RootStack = createStackNavigator();
const RootStackScreen = ({ UserToken }) => (
  <RootStack.Navigator headerMode="none">
    {UserToken ? (
      <RootStack.Screen name="Tabs" component={DrawerScreen} />
    ) : (
        <RootStack.Screen name="Login" component={LoginScreen} />
      )}
    <RootStack.Screen name="Browser" component={Browser} />
  </RootStack.Navigator>
)

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [UserToken, setUserToken] = React.useState(null);
  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      }
    }
  })
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000) //timeout after 1000 ms
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