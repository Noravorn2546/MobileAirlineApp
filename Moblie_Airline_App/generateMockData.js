import admin from "firebase-admin";
import fs from "fs";

// Read the service account key using CommonJS syntax
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// List of cities
const cities = [
  "New York, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Sydney, Australia",
];

// Generate flights for 1st December 2024
const generateFlightsForDecember1 = async () => {
  const flightsRef = db.collection("flights");
  const departureDate = "2024-12-01"; // 1st December 2024

  for (const from of cities) {
    for (const to of cities) {
      if (from === to) continue; // Skip same city combinations

      const querySnapshot = await flightsRef
        .where("from", "==", from)
        .where("to", "==", to)
        .where("departureDate", "==", departureDate)
        .get();

      if (!querySnapshot.empty) {
        console.log(`Flights from ${from} to ${to} on ${departureDate} already exist. Skipping.`);
        continue;
      }

      // Generate 3 flights
      for (let i = 1; i <= 3; i++) {
        const flight = {
          from,
          to,
          departureDate,
          departureTime: `${8 + i * 2}:00 AM`, // Example times: 10:00 AM, 12:00 PM, 2:00 PM
          price: `$${100 + i * 50}`, // Example prices: $150, $200, $250
          flightNumber: `AA${Math.floor(1000 + Math.random() * 9000)}`, // Random flight number
        };

        await flightsRef.add(flight);
        console.log(`Added flight from ${from} to ${to} on ${departureDate}:`, flight);
      }
    }
  }

  console.log("Flight generation for 1st December 2024 is complete!");
};

// Run the script
generateFlightsForDecember1()
  .then(() => {
    console.log("Script completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error generating flights:", error);
    process.exit(1);
  });
