import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet} from "react-native";
import {Image } from 'react-native-elements'

export const SocietyScreen = ({ navigation }) => {
  return (
    <Image 
      source={ require('../img/cs.jpg') }
      style={{ width: 450, height: 600 }}
    />
  )
}
