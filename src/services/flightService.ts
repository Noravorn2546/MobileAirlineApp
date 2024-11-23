import { db } from "./firebase";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";

// Fetch flights based on "from", "to", and "departureDate"
export const fetchFlights = async (from: string, to: string, date: string) => {
  const flightsRef = collection(db, "flights");
  const q = query(
    flightsRef,
    where("from", "==", from),
    where("to", "==", to),
    where("departureDate", "==", date) // Filter by departure date
  );

  const querySnapshot = await getDocs(q);
  const flights: any[] = [];
  querySnapshot.forEach((doc) => flights.push({ id: doc.id, ...doc.data() }));
  return flights;
};

// Fetch all available cities
export const fetchCities = async () => {
  const citiesRef = collection(db, "cities");
  const querySnapshot = await getDocs(citiesRef);
  const cities: any[] = [];
  querySnapshot.forEach((doc) => cities.push({ id: doc.id, ...doc.data() }));
  return cities;
};

// Fetch flights based on the selected route
export const fetchRouteFlights = async (from: string, to: string, date: string) => {
  const flightsRef = collection(db, "flights");
  const q = query(
    flightsRef,
    where("from", "==", from),
    where("to", "==", to),
    where("departureDate", "==", date) // Filter by departure date
  );
  const querySnapshot = await getDocs(q);
  const flights: any[] = [];
  querySnapshot.forEach((doc) => flights.push({ id: doc.id, ...doc.data() }));
  return flights;
};

// Fetch bookings for a specific user
export const fetchBookings = async (userId: string) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  const bookings: any[] = [];
  querySnapshot.forEach((doc) => bookings.push({ id: doc.id, ...doc.data() }));
  return bookings;
};

// Add a booking for a user (prevent duplicate bookings)
export const addBooking = async (userId: string, flightId: string) => {
  const bookingsRef = collection(db, "bookings");

  // Check if the user has already booked the same flight
  const q = query(bookingsRef, where("userId", "==", userId), where("flightId", "==", flightId));
  const existingBookingSnapshot = await getDocs(q);
  if (!existingBookingSnapshot.empty) {
    throw new Error("You have already booked this flight.");
  }

  const newBooking = {
    userId,
    flightId,
    bookingDate: new Date().toISOString(),
  };
  await addDoc(bookingsRef, newBooking);
};

// Delete a booking
export const deleteBooking = async (bookingId: string) => {
  const bookingDoc = doc(db, "bookings", bookingId);
  await deleteDoc(bookingDoc);
};

// Fetch details of a specific flight
export const fetchFlightDetails = async (flightId: string) => {
  const flightsRef = collection(db, "flights");
  const q = query(flightsRef, where("__name__", "==", flightId)); // Query by document ID

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error("Flight not found");
  }

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};
