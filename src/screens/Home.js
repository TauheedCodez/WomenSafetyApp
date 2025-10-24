import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import { db } from "../../firebase"; // adjust path if needed
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Home = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null); // latest location
  const [contacts, setContacts] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const onLocate = () => navigation.navigate("Map");
  const onContact = () => navigation.navigate("Contacts");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    let locationSubscription;

    const startLocationWatch = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        setLoadingLocation(false);
        return;
      }

      // Get instant last known location first
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        setLocation(lastLocation);
        console.log("Initial location:", lastLocation.coords.latitude, lastLocation.coords.longitude);
      }
      setLoadingLocation(false);

      // Watch for real-time updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1, // every meter
          timeInterval: 1000, // every second
        },
        (loc) => {
          setLocation(loc);
          console.log("Updated location:", loc.coords.latitude, loc.coords.longitude);
        }
      );
    };

    startLocationWatch();

    // --- FIRESTORE CONTACTS LISTENER ---
    const contactsRef = collection(db, "contacts");
    const q = query(contactsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedContacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(updatedContacts);
      },
      (error) => {
        if (error.code !== "permission-denied") {
          console.error("Firestore listener error:", error);
        }
      }
    );

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        unsubscribe();
        setContacts([]);
      }
    });

    return () => {
      if (locationSubscription) locationSubscription.remove();
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  // SOS Alert Function
  const sendAlert = async () => {
    if (!location) {
      Alert.alert("Location not available");
      return;
    }

    if (contacts.length === 0) {
      Alert.alert("No contacts available to send the alert");
      return;
    }

    const message = `🚨 SOS! I need help. My current location is:
https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("SMS service not available on this device");
      return;
    }

    const numbers = contacts.map((contact) => contact.number);
    try {
      await SMS.sendSMSAsync(numbers, message);
      console.log("SOS alert sent successfully!");
    } catch (error) {
      console.log("Error sending SMS:", error.message);
    }
  };

  if (loadingLocation) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

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
  textColor: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#286090",
    width: "100%",
    height: "22%",
    textAlign: "center",
    borderRadius: 5,
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
    borderColor: "grey",
  },
});