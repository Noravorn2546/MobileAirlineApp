import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { fetchBookings, fetchFlightDetails, deleteBooking } from "../services/flightService";
import { getAuth } from "firebase/auth";

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = getAuth().currentUser?.uid;

  // Load bookings on mount
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        if (userId) {
          const bookingsData = await fetchBookings(userId);
          setBookings(bookingsData);

          // Fetch flight details for each booking
          const flightDetails = await Promise.all(
            bookingsData.map((booking) => fetchFlightDetails(booking.flightId))
          );
          setFlights(flightDetails);
        }
      } catch (err) {
        console.error("Error loading bookings:", err);
        Alert.alert("Error", "Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [userId]);

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      setFlights((prev) =>
        prev.filter((flight, index) => bookings[index].id !== bookingId)
      );
      Alert.alert("Success", "Your booking has been canceled.");
    } catch (err) {
      console.error("Error deleting booking:", err);
      Alert.alert("Error", "Failed to cancel your booking. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {loading ? (
        <Text>Loading your bookings...</Text>
      ) : flights.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.flightText}>
                Flight: {item.flightNumber} ({item.from} → {item.to})
              </Text>
              <Text style={styles.flightDetails}>
                Date: {item.departureDate} | Time: {item.departureTime}
              </Text>
              <Text style={styles.flightDetails}>Price: {item.price}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleDeleteBooking(bookings[index].id)}
              >
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  noBookingsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  bookingCard: {
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
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
