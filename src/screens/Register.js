import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; 

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const onRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("User registered successfully!", `Welcome ${user.email}`);
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Registration failed", errorMessage);
      });
  };
  
  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Login successful!", `Welcome back ${user.email}`);
        navigation.navigate("TabNavigator");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Login failed", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={(value) => setEmail(value)} // Use onChangeText instead of onChange
        style={styles.textInput}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={(value) => setPassword(value)} // Use onChangeText instead of onChange
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={onRegister} style={styles.button}>
        <Text style={styles.textColor}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogin} style={styles.button}>
        <Text style={styles.textColor}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    width: "80%",
    margin: 8,
    height: 50,
    borderRadius: 5,
    padding: 8,
  },
  button: {
    backgroundColor: "#286090",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    margin: 8,
    height: 50,
    borderRadius: 5,
  },
  textColor: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  }
});
