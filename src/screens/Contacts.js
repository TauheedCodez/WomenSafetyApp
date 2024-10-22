import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactsScreen() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [contacts, setContacts] = useState([]);

  // Fetch contacts from AsyncStorage when the component mounts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem("contacts");
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      } catch (error) {
        console.error("Error loading contacts", error);
      }
    };
    loadContacts();
  }, []);

  // Save contacts to AsyncStorage
  const saveContacts = async (updatedContacts) => {
    try {
      await AsyncStorage.setItem("contacts", JSON.stringify(updatedContacts));
    } catch (error) {
      console.error("Error saving contacts", error);
    }
  };

  // Add a new contact
  const addContact = () => {
    if (name.trim() === "" || number.trim() === "") {
      Alert.alert("Both name and number are required");
      return;
    }

    const newContact = { id: Date.now().toString(), name, number };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    setName("");
    setNumber("");
  };

  // Delete a contact
  const deleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  return (
    <View style={styles.container}>
      {/* Input fields for adding contacts */}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Phone Number"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        style={styles.textInput}
      />
      <TouchableOpacity onPress={addContact} style={styles.add}>
        <Text style={styles.textColor}>Add Contacts</Text>
      </TouchableOpacity>

      {/* List of contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id} // Using a unique id as the key
        renderItem={({ item }) => (
          <View style={styles.list}>
            <View style={styles.button}>
              <Text style={styles.textColor}>
                {item.name}: {item.number}
              </Text>
            </View>
            <TouchableOpacity style={styles.delete} onPress={() => deleteContact(item.id)}>
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
    alignItems: "center"
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
    width:'76%',
    backgroundColor: '#286090',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 9,
    // borderWidth: 1
  },
  add:{
    backgroundColor: "#286090",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    margin: 8,
    height: 50,
    borderRadius: 40
  },
  textColor: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    flexDirection: "row",
    alignItems: 'center',
    width: 335,
    height: 50,
    marginVertical: 8,
    // borderWidth: 1
  },
  delete: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: 11,
    // borderWidth: 1
  },
  image: {
    width: 60,
    height: 60,
  },
});
