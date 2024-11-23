import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { fetchFlights } from "../services/flightService";

export default function ChooseTicketScreen({ route, navigation }: any) {
  const { from, to, departureDate } = route.params; // Extract params from navigation
  const [flights, setFlights] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setError("");
        const flightResults = await fetchFlights(from, to, departureDate);
        if (flightResults.length === 0) {
          setError("No flights available for the selected route.");
        }
        setFlights(flightResults);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Failed to fetch flights. Please try again.");
      }
    };

    loadFlights();
  }, [from, to, departureDate]);

  const handleSelectFlight = (flightId: string) => {
    Alert.alert("Flight Selected", `You selected flight ID: ${flightId}`);
    navigation.navigate("BookingConfirmation", { flightId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Flights from {from} to {to} on {departureDate}
      </Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.flightCard}>
              <Text style={styles.flightText}>
                Departure: {item.departureTime}
              </Text>
              <Text style={styles.flightDetails}>
                Date: {item.departureDate} | Price: ${item.price}
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectFlight(item.id)}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
  },
  flightCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flightText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  flightDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
