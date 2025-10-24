import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { auth, db } from "../../firebase";
import { TextInputMask } from "react-native-masked-text";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function ContactsScreen() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [contacts, setContacts] = useState([]);

  const user = auth.currentUser;
  console.log("Logged-in user UID:", user?.uid);

  // Fetch contacts in real-time for the logged-in user
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "contacts"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedContacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(fetchedContacts);
    });

    return () => unsubscribe();
  }, [user]);

  // Add a new contact
  const addContact = async () => {
    if (name.trim() === "" || number.trim() === "") {
      Alert.alert("Both name and number are required");
      return;
    }

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        number,
        userId: user.uid, // each user has their own contacts
      });
      setName("");
      setNumber("");
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error adding contact", error.message);
    }
  };

  // Delete a contact
  const deleteContact = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
    } catch (error) {
      console.error("Error deleting contact:", error);
      Alert.alert("Error deleting contact", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input fields for adding contacts */}
      <TextInput
        placeholderTextColor="#000"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <TextInputMask
        placeholderTextColor="#000"
        type={"custom"}
        placeholder="Phone Number"
        options={{
          mask: "99999 99999", // format for 10 digits
        }}
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        style={styles.textInput}
      />
      <TouchableOpacity onPress={addContact} style={styles.add}>
        <Text style={styles.textColor}>Add Contact</Text>
      </TouchableOpacity>

      {/* List of contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <View style={styles.button}>
              <Text style={styles.textColor}>
                {item.name}: {item.number}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.delete}
              onPress={() => deleteContact(item.id)}
            >
              <Image
                style={styles.image}
                source={require("../../assets/cancel.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
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
    width: "76%",
    backgroundColor: "#286090",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 9,
  },
  add: {
    backgroundColor: "#286090",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    margin: 8,
    height: 50,
    borderRadius: 40,
  },
  textColor: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    width: 335,
    height: 50,
    marginVertical: 8,
  },
  delete: {
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 11,
  },
  image: {
    width: 60,
    height: 60,
  },
});