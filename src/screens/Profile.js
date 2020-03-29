import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../context";

export const Profile = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <Button title="signout" onPress={() =>  signOut()} />
    </View>
  );
}