import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { flightId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed</Text>
      <Text style={styles.flightDetails}>
        Your flight (ID: {flightId}) has been successfully booked.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MyBookings")}
      >
        <Text style={styles.buttonText}>Go to My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  flightDetails: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
