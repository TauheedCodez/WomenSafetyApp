import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Map = () => {
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    let subscription;

    const userLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access Location was denied");
        return;
      }

      // Get instant last known location
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        setMapRegion({
          latitude: lastLocation.coords.latitude,
          longitude: lastLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        console.log("Initial coordinates:", lastLocation.coords.latitude, lastLocation.coords.longitude);
      }

      // Watch for real-time updates
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setMapRegion(coords);
          console.log("Updated coordinates:", coords.latitude, coords.longitude);
        }
      );
    };

    userLocation();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (!mapRegion) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion} showsUserLocation>
        <Marker coordinate={mapRegion} title="You are here" />
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});