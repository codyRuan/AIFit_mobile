import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export const HomeScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to line up system!</Text>
      </View>
    );
  }