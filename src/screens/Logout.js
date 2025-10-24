import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";

const Logout = () => {
  const navigation = useNavigation();
  const onLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Register"); // Navigate back to the Register screen after logout
      })
      .catch((error) => {
        console.error("Sign out error: ", error);
      });
  };

  return (
    <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/profilepicture.png')} />
      <TouchableOpacity onPress={onLogout} style={styles.button}>
        <Text style={styles.textColor}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#286090",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    margin: 8,
    height: 60,
    borderRadius: 50,
  },
  textColor: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200
  }
});