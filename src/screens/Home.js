import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Alert,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const navigation = useNavigation();
  const onLocate = () => {
    navigation.navigate("Map");
  };
  const onContact = () => {
    navigation.navigate("Contacts");
  };

  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);

  // Load contacts and request location
  useEffect(() => {
    const loadContactsAndLocation = async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      // Get user's location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fetch contacts from AsyncStorage
      const storedContacts = await AsyncStorage.getItem("contacts");
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        Alert.alert("No contacts available to send the Alert");
      }
    };

    loadContactsAndLocation();
  }, []);

  // Function to send Alert message
  const sendAlert = async () => {
    if (!location) {
      Alert.alert("Location not available");
      return;
    }

    const message = `SOS! I need help. My current location is: 
    https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const numbers = contacts.map((contact) => contact.number);

      if (numbers.length > 0) {
        await SMS.sendSMSAsync(
          numbers, // List of contact numbers
          message
        );
        Alert.alert("SOS alert is Sent");
      } else {
        Alert.alert("No contacts available to send the Alert");
      }
    } else {
      Alert.alert("SMS service is not available on this device");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLocate} style={styles.Icons}>
        <Image
          style={styles.imageLocate}
          source={require("../../assets/location.png")}
        />
        <Text style={styles.textColor}>Get Location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onContact} style={styles.Icons}>
        <Image
          style={styles.imageLocate}
          source={require("../../assets/contacts.png")}
        />
        <Text style={styles.textColor}>Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendAlert} style={styles.icon}>
        <Image style={styles.image} source={require("../../assets/sos.png")} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

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
    width: "80%",
    margin: 8,
    height: 50,
    borderRadius: 5,
  },
  textColor: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#286090",
    width: "100%",
    height: "22%",
    textAlign: "center",
    borderRadius: 5
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: 250,
    marginTop: 20,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageLocate: {
    height: "78%",
    width: "100%",
    borderRadius: 7,
  },
  Icons: {
    alignItems: "center",
    justifyContent: "center",
    height: 170,
    width: 300,
    borderWidth: 2,
    borderRadius: 7,
    margin: 10,
    borderColor: 'grey'
  },
});
