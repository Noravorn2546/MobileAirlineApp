import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { addBooking } from "../services/flightService";

export default function FlightResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { flights, from, to, departureDate } = route.params;

  const handleBookFlight = async (flightId: string) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert("Error", "You need to log in to book a flight.");
      return;
    }

    try {
      await addBooking(userId, flightId);
      Alert.alert("Success", "Your booking has been confirmed.");
      navigation.navigate("BookingConfirmation", { flightId });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }


  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Flights from {from} to {to} on {departureDate}
      </Text>

      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.flightCard}>
            <Text style={styles.flightText}>
              {item.from} → {item.to}
            </Text>
            <Text style={styles.flightDetails}>
              Date: {item.departureDate} | Time: {item.departureTime}
            </Text>
            <Text style={styles.priceText}>Price: {item.price}</Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBookFlight(item.id)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  flightCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  flightText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  flightDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
