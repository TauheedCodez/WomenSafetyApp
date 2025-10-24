import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // REGISTER FUNCTION
  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      Alert.alert(
        "Verification Email Sent",
        "Please check your inbox or spam folder to verify your email."
      );

    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  };

  // LOGIN FUNCTION
  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Refresh user data
      await user.reload();

      if (user.emailVerified) {
        Alert.alert("Login successful!", `Welcome ${user.email}`);
        navigation.replace("TabNavigator");
      } else {
        Alert.alert(
          "Email not verified",
          "Please verify your email before logging in."
        );
      }
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  // RESEND VERIFICATION EMAIL
  const resendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Register first", "Please register first to resend verification email.");
        return;
      }
      await sendEmailVerification(user);
      Alert.alert(
        "Verification Email Resent",
        "Please check your inbox or spam folder to verify your email."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholderTextColor="#000"
        value={password}
        onChangeText={setPassword}
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

      {/* Resend Verification Email */}
      <TouchableOpacity onPress={resendVerification}>
        <Text style={styles.linkText}>Resend Verification Email</Text>
      </TouchableOpacity>

      {/* Navigate to Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    color: "black",
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
  },
  linkText: {
    color: "#286090",
    marginTop: 10,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});