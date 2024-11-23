import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { fetchCities, fetchFlights } from "../services/flightService";

export default function SearchFlightsScreen() {
  const [cities, setCities] = useState<string[]>([]);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>(
    new Date(2024, 11, 1) // Default to 1st December 2024
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<any>();
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityResults = await fetchCities();
        setCities(cityResults.map((city) => city.name));
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities. Please try again later.");
      }
    };
    loadCities();
  }, []);

  const handleSearchFlights = async () => {
    setError("");

    if (!from || !to) {
      setError("Both 'From' and 'To' fields are required!");
      return;
    }

    if (from === to) {
      setError("Departure and destination cities cannot be the same!");
      return;
    }

    try {
      const formattedDate = departureDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const flights = await fetchFlights(from, to, formattedDate);

      if (flights.length === 0) {
        setError("No flights found for the selected route and date.");
        return;
      }

      // Navigate to FlightResultsScreen with search results
      navigation.navigate("FlightResults", {
        flights,
        from,
        to,
        departureDate: formattedDate,
      });
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights. Please try again later.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search Flights</Text>

      {/* From Picker */}
      <Text style={styles.label}>From</Text>
      <Picker
        selectedValue={from}
        onValueChange={(value) => setFrom(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select a city" value="" />
        {cities.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      {/* To Picker */}
      <Text style={styles.label}>To</Text>
      <Picker
        selectedValue={to}
        onValueChange={(value) => setTo(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select a city" value="" />
        {cities.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      {/* Departure Date Picker */}
      <Text style={styles.label}>Departure Date</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          {departureDate.toISOString().split("T")[0]} {/* Display selected date */}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
        value={
          departureDate || new Date(Date.UTC(2024, 11, 1)) // Default to UTC December 1, 2024
        }
        mode="date"
        minimumDate={new Date(Date.UTC(2024, 11, 1))} // December 1, 2024
        maximumDate={new Date(Date.UTC(2024, 11, 31))} // December 31, 2024
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) {
            // Normalize the selected date to UTC to avoid time zone offsets
            const normalizedDate = new Date(
              Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
              )
            );
            setDepartureDate(normalizedDate);
          }
        }}
      />
      
      )}

      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearchFlights}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: 15,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});
