import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  SectionList, FlatList, ActivityIndicator,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { AuthContext } from "../context";
import '../browser'
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

postData = (data) => {
  console.log(data)
  fetch('https://ncufit.tk/postimage/posts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
    credentials: 'same-origin',
  }).then((response) => response.json()
  ).then((resdata) => {
    console.log(resdata)
  }).done();

}


export const Profile = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [imgdata, setimgdata] = useState(null);
  const { signOut } = React.useContext(AuthContext);
  useEffect(() => {
    if (isLoading) {
      get_profile();
    }
  });
  function convertFile(file) {
    return new Promise((resolve, reject) => {
      // 建立FileReader物件
      let reader = new FileReader()
      // 註冊onload事件，取得result則resolve (會是一個Base64字串)
      reader.onload = () => { resolve(reader.result) }
      // 註冊onerror事件，若發生error則reject
      reader.onerror = () => { reject(reader.error) }
      // 讀取檔案
      reader.readAsDataURL(file)
    })
  }
  async function get_profile() {
    var id = await AsyncStorage.getItem('@UserStorage:user_id')
    var uuid = await AsyncStorage.getItem('@UserStorage:uuid')
    id = JSON.parse(id)
    uuid = JSON.parse(uuid)
    let details = {
      'user_id': id,
      'uuid': uuid
    };
    await fetch('https://ncufit.tk/postimage/getprofileimage/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details)
    }).then((response) => response.blob())
      .then((responseData) => {
        convertFile(responseData)
          .then(data => {
            let baseImg = "data:image/png;base64," + data;
            setimgdata(data.substring(37)) // 把編碼後的字串輸出到setimgdata
            setLoading(false)
          })
          .catch(err => console.log(err))
      }).done();

  }

  async function selectFile() {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option'
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, res => {
      // console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      }
      else {
        let source = res;
        setimgdata(source.data)
        var data = new FormData();
        data.append('user_id', '106502521');
        data.append('img', {
          'uri': source.uri,
          'type': source.type,
          'name': source.fileName
        });
        console.log(source.type)
        postData(data)
      }
    });

  };
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignSelf: "center" }}>
            <View style={styles.profileImage}>
              <Image source={{ uri: 'data:image/png;base64,' + imgdata, }} style={styles.image} resizeMode="center"></Image>
            </View>
            <TouchableOpacity onPress={() => signOut()} style={styles.dm}  >
              <MaterialIcons name="chat" size={18} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></MaterialIcons>
            </TouchableOpacity>

            <View style={styles.active}></View>
            <View style={styles.add}>
              <TouchableOpacity onPress={() => selectFile()} style={styles.button}  >
                <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{'楊景豐'}</Text>
            <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>{'106502521'}</Text>
          </View>

          <View style={styles.statsContainer}>

            <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
              <Text style={[styles.text, { fontSize: 24 }]}>5000 min</Text>
              <Text style={[styles.text, styles.subText]}>Workout time</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]}>300</Text>
              <Text style={[styles.text, styles.subText]}>Followers</Text>
            </View>
          </View>

          <View style={{ marginTop: 32 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../img/arm.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../img/leg.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
              <View style={styles.mediaImageContainer}>
                <Image source={require("../img/chest.jpg")} style={styles.image} resizeMode="cover"></Image>
              </View>
            </ScrollView>
            {/* <View style={styles.mediaCount}>
                        <Text style={[styles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[styles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}
          </View>
          <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
          <View style={{ alignItems: "center" }}>
            <View style={styles.recentItem}>
              <View style={styles.activityIndicator}></View>
              <View style={{ width: 250 }}>
                <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                  Trained the chest for 50 minutes
              </Text>
              </View>
            </View>

            <View style={styles.recentItem}>
              <View style={styles.activityIndicator}></View>
              <View style={{ width: 250 }}>
                <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                  Followed by XXX
              </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D"
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500"
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden"
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32
  },
  statsBox: {
    alignItems: "center",
    flex: 1
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  activityIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20
  }
});