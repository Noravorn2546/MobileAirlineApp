// App.tsx

import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';

// import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

// https://www.npmjs.com/package/react-native-open-maps
import openMap from 'react-native-open-maps';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs(true);

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, DataSnapshot } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // https://github.com/firebase/firebase-js-sdk/issues/1847

import MapView from 'react-native-maps';

// Navigation imports
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

// Initialize Firebase outside of the component to prevent re-initialization
const firebaseConfig = {
  // Add your own firebase config here
};

initializeApp(firebaseConfig);

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Define types for navigation
type RootStackParamList = {
  Home: undefined;
  Details: { res_data: RestaurantData };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

// Define interfaces for data
interface Review {
  comment: string;
  stars: number;
}

interface RestaurantData {
  name: string;
  open_day: string;
  open_time: string;
  phone: string;
  images: string[];
  type: string;
  gps: string;
  reviews: Review[];
}

// Define props for Restaurant component
interface RestaurantProps {
  res_data: RestaurantData;
  navigation: HomeScreenNavigationProp | DetailsScreenNavigationProp;
}

// Define props for Stars component
interface StarsProps {
  stars: number;
}

// Define props for StarWithAverage component
interface StarWithAverageProps {
  stars: number;
}

// Define props for Reviews component
interface ReviewsProps {
  reviews: Review[];
}

// Define the Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

const RADIUS = 20; // in kilometers

// Restaurant Component
const Restaurant: React.FC<RestaurantProps> = ({ res_data, navigation }) => {
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('Details', {
          res_data: res_data,
        });
      }}
      underlayColor="white"
    >
      <View style={styles.restaurant}>
        <Text style={{ fontSize: 20 }}>{res_data.name}</Text>
        <Text style={{ fontSize: 12 }}>
          วันทำการ {res_data.open_day} เวลาทำการ {res_data.open_time}
        </Text>
        <Text style={{ fontSize: 12 }}>โทรศัพท์ {res_data.phone}</Text>
        <View style={{ flexDirection: 'row' }}>
          {res_data.images.slice(0, 3).map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.food_img} />
          ))}
        </View>
      </View>
    </TouchableHighlight>
  );
};

// Stars Component
const Stars: React.FC<StarsProps> = ({ stars }) => {

  if (stars === 1) {
    return (
      <View style={stars > 1 ? styles.star_container : undefined}>
        <Image source={require("./images/1-star.png")} style={styles.star_img} />
      </View>
    );
  }
  else if (stars === 2) {
    return (
      <View style={styles.star_container}>
        <Image source={require("./images/2-star.png")} style={styles.star_img} />
      </View>
    );
  }
  else if (stars === 3) {
    return (
      <View style={styles.star_container}>
        <Image source={require("./images/3-star.png")} style={styles.star_img} />
      </View>
    );
  }
  else if (stars === 4) {
    return (
      <View style={styles.star_container}>
        <Image source={require("./images/4-star.png")} style={styles.star_img} />
      </View>
    );
  }
  else if (stars === 5) {
    return (
      <View style={styles.star_container}>
        <Image source={require("./images/5-star.png")} style={styles.star_img} />
      </View>
    );
  }
  return null;
};

// StarWithAverage Component
const StarWithAverage: React.FC<StarWithAverageProps> = ({ stars }) => {
  const stars_int = Math.round(stars);
  const stars2decimal = stars.toFixed(2);
  return (
    <View>
      <Text>Average star: {stars2decimal}</Text>
      <Stars stars={stars_int} />
    </View>
  );
};

// Reviews Component
const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>Reviews</Text>
      </View>
      <ScrollView>
        {reviews.map((review, i) => (
            <View key={i}>
            <Text>{review.comment}</Text>
            <Stars stars={parseInt(review.stars.toString(), 10)} />
            </View>
        ))}
        {/* Workaround for ScrollView cutoff at the bottom */}
        <Image source={require('./images/bottom_filler.png')} />
      </ScrollView>
    </View>
  );
};

interface SignupLoginProps {
    loginCB: () => void;
  }
  
  const SignupLogin: React.FC<SignupLoginProps> = ({ loginCB }) => {
    // State variables
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showLogin, setShowLogin] = useState<boolean>(true);
  
    // Handler to toggle to Login view
    const toggleShowLogin = () => {
      setShowLogin(true);
    };
  
    // Handler to toggle to Signup view
    const toggleShowSignup = () => {
      setShowLogin(false);
    };
  
    // Handler for Login action
    const doLogin = () => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, username, password).then( () => {
        console.log("login successful");
        loginCB();
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
        // ...
      })
    };
  
    // Handler for Signup action
    const doSignup = () => {
      // check if the two password fields match
      if (password === confirmPassword){
        // do signup
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, username, password).then( () => {
          console.log("created new user successful");
          setShowLogin(true) // show login page
        })
        .catch(function(error) {
          // Handle Errors here.
          console.log(error.code);
          console.log(error.message);
          alert(error.message);
        });
      }
      else {
        alert("Password do not match !!!");
      }
    };
  
    // Render Signup form
    const renderSignup = () => (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
          />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={toggleShowLogin}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button} onPress={doSignup}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  
    // Render Login form
    const renderLogin = () => (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={toggleShowSignup}>
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button} onPress={doLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  
    return (
      <View style={styles.containerLogin}>
        {showLogin ? renderLogin() : renderSignup()}
      </View>
    );
  };

// HomeScreen Component
const HomeScreen: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [isShowNearby, setIsShowNearby] = useState<boolean>(true);
  const [restaurantData, setRestaurantData] = useState<RestaurantData[] | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<RestaurantData[]>([]);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const restaurantRef = ref(getDatabase(), 'restaurant/');

  useEffect(() => {
    _readDB();
    if (Platform.OS === 'android' && !Device.isDevice) {
      setErrorMessage('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      _getLocationAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _getLocationAsync = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setLocation(loc);
    } catch (error) {
      console.error(error);
    }
  };

  const _readDB = () => {
    get(restaurantRef)
      .then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Assuming data is an object with numeric keys or an array
          const restaurantList: RestaurantData[] = Object.values(data);
          setRestaurantData(restaurantList);
          console.log(restaurantList);
        } else {
          console.log('No data available');
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const _computeDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRadians = (deg: number): number => {
      return (deg * Math.PI) / 180;
    };

    const R = 6371e3; // metres
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const delta_phi = toRadians(lat2 - lat1);
    const delta_lambda = toRadians(lon2 - lon1);

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(delta_lambda / 2) * Math.sin(delta_lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;

    return d; // in metres
  };

  const _isWithinRadius = (latlong: string): boolean => {
    /*
    latlong is string of latlong, e.g. "13.6565217,100.6212236"
    This function computes the distance from current location
    (location.coords.latitude, location.coords.longitude)
    to latlong and determine if it's within RADIUS km
    */
    if (typeof latlong !== 'string') throw new Error('latlong must be a string');
    const data = latlong.split(',');
    const lat = parseFloat(data[0]);
    const long = parseFloat(data[1]);

    if (location) {
      const currentLat = location.coords.latitude;
      const currentLong = location.coords.longitude;
      const distance = _computeDistance(lat, long, currentLat, currentLong);
      return distance <= RADIUS * 1000;
    } else {
      throw new Error('Location is not available yet');
    }
  };

  const _onPressButton = () => {
    if (restaurantData) {
      const restaurantFound: RestaurantData[] = [];
      const patt = new RegExp(searchText, 'i'); // build regex pattern

      // Search by restaurant name
      restaurantData.forEach((restaurant) => {
        if (patt.test(restaurant.name)) {
          restaurantFound.push(restaurant);
        }
      });

      // Search by food type
      restaurantData.forEach((restaurant) => {
        if (patt.test(restaurant.type)) {
          restaurantFound.push(restaurant);
        }
      });

      setIsShowNearby(false);
      setSearchResult(restaurantFound);
    }
  };

  const showNearby = () => {
    if (restaurantData) {
      const nearbyRestaurantData = restaurantData.filter((restaurant) => {
        try {
          return _isWithinRadius(restaurant.gps);
        } catch (error) {
          console.error(error);
          return false;
        }
      });

      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{ flex: 1 }}>
            {nearbyRestaurantData.map((res_data, i) => (
              <Restaurant key={i} res_data={res_data} navigation={navigation} />
            ))}
            {/* Workaround for ScrollView cutoff at the bottom */}
            <Image source={require('./images/bottom_filler.png')} />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.restaurantContainer}>
          <Text>Please Wait</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  };

  const showSearchResult = () => {
    if (searchResult.length > 0) {
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{ flex: 1 }}>
            {searchResult.map((res_data, i) => (
              <Restaurant key={i} res_data={res_data} navigation={navigation} />
            ))}
            {/* Workaround for ScrollView cutoff at the bottom */}
            <Image source={require('./images/bottom_filler.png')} />
          </ScrollView>
        </View>
      );
    } else {
      return <Text>No restaurant found</Text>;
    }
  };

  const showHome = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant Search</Text>
        <View style={styles.searchArea}>
          <TextInput
            style={{ height: 40, width: 300, fontSize: 20 }}
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableHighlight onPress={_onPressButton} underlayColor="white">
            <View style={styles.searchButton}>
              <Image style={{ height: 30, width: 30 }} source={require('./images/search_icon.png')} />
            </View>
          </TouchableHighlight>
        </View>
        <View>{isShowNearby ? showNearby() : showSearchResult()}</View>
      </View>
    );
  }

  const loginSuccess = () => {
    setIsLogin(true);
  }

  const showLoginSignup = () => {
    return (
      <SignupLogin loginCB={loginSuccess}/>
    );
  }

  return (
    <View style={styles.container}>
      {isLogin ? showHome() : showLoginSignup()}
    </View>
  );
};

// DetailsScreen Component
const DetailsScreen: React.FC<{
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
}> = ({ route, navigation }) => {
  const { res_data } = route.params;
  const reviews = res_data.reviews;
  console.log(reviews.length);
  const sum_stars = reviews.reduce((sum, review) => sum + parseInt(review.stars.toString(), 10), 0);
  console.log(sum_stars);
  const average_star = reviews.length > 0 ? sum_stars / reviews.length : 0;
  console.log(average_star);

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, styles.restaurantContainer]}>
      <Restaurant res_data={res_data} navigation={navigation} />
      {/* Show star picture and average star value */}
      <StarWithAverage stars={average_star} />
      {/* Show review texts */}
      <Reviews reviews={reviews} />
    </View>
  );
};

// App Component
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Restaurants',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  searchArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#E5E4E3',
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButton: {
    // Add styles for the search button if needed
  },
  restaurantContainer: {
    padding: 5,
    margin: 10,
    backgroundColor: '#E5E4E3',
    width: 350,
    flex: 1,
  },
  restaurant: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  food_img: {
    width: 100,
    height: 100,
    margin: 3,
  },
  star_img: {
    width: 120,
    height: 30,
    margin: 3,
  },
  star_container: {
    padding: 5,
    margin: 5,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  group: {
    marginTop: 20
  },
  center: {
    alignItems: 'center'
  },
  signupText : {
    fontSize: 20,
    color: 'blue'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 30
  },
  input: {
    padding: 10,
    height: 40,
    borderWidth: 1
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20
  },
});
