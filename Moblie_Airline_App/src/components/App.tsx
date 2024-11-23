import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "./LoginScreen";
import WelcomePage from "./WelcomePage";
import SearchFlightsScreen from "./SearchFlightsScreen";
import MyBookingsScreen from "./MyBookingsScreen";
import ChooseTicketScreen from "./ChooseTicketScreen"; 
import BookingConfirmationScreen from "./BookingConfirmationScreen"; 
import FlightResultsScreen from "./FlightResultsScreen"; 

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  WelcomePage: { email: string };
  SearchFlights: undefined;
  MyBookings: undefined;
  ChooseTicket: { flightId: string; from: string; to: string }; 
  BookingConfirmation: { flightId: string }; 
  FlightResults: { flights: any[]; from: string; to: string; departureDate: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomePage" component={WelcomePage} options={{headerTitle: "Home", headerBackVisible: false, }}/>
        <Stack.Screen name="SearchFlights" component={SearchFlightsScreen} options={{ headerTitle: "Search Flights" }} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerTitle: "My Bookings" }} />
        <Stack.Screen name="ChooseTicket" component={ChooseTicketScreen} options={{ headerTitle: "Choose Ticket" }} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ headerTitle: "Booking Confirmation" }}/>
        <Stack.Screen name="FlightResults" component={FlightResultsScreen} options={{ headerTitle: "Flight Results" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
