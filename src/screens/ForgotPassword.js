import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase"; // adjust path if needed
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your registered email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Email Sent",
        "Check your inbox or spam and follow the link to reset your password."
      );
      navigation.goBack(); // return to login screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholderTextColor="#000"
        style={styles.textInput}
        placeholder="Enter your registered email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.textColor}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#286090",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    color: "#286090",
    fontSize: 16,
    fontWeight: "bold",
  },
});