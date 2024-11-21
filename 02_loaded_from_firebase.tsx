import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TextInput, Image, Alert, ScrollView } from 'react-native';
import { LogBox } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Ignore specific warning
LogBox.ignoreLogs(['Setting a timer']);

// Firebase configuration
const firebaseConfig = {
// firebase config here
};

// Initialize Firebase app
initializeApp(firebaseConfig);

type RestaurantProps = {
  name: string;
  open_day: string;
  open_time: string;
  phone: string;
  food_img: string[];
};

const Restaurant: React.FC<RestaurantProps> = ({ name, open_day, open_time, phone, food_img }) => {
  return (
    <View style={styles.restaurant}>
      <Text style={{ fontSize: 20 }}>{name}</Text>
      <Text style={{ fontSize: 12 }}>วันทำการ {open_day}    เวลาทำการ {open_time}</Text>
      <Text style={{ fontSize: 12 }}>โทรศัพท์ {phone}</Text>
      <View style={{ flexDirection: 'row' }}>
        {food_img.map((imgSrc, index) => (
          <Image key={index} source={{ uri: imgSrc }} style={styles.food_img} />
        ))}
      </View>
    </View>
  );
};

const App: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [isShowNearby, setIsShowNearby] = useState<boolean>(true);
  const [restaurantData, setRestaurantData] = useState<any[]>([]);

  const restaurantRef = ref(getDatabase(), 'restaurant/');

  useEffect(() => {
    readDB();
  }, []);

  const onPressButton = () => {
    Alert.alert(searchText);
  };

  const readDB = async () => {
    try {
      const snapshot = await get(restaurantRef);
      if (snapshot.exists()) {
        setRestaurantData(snapshot.val());
        console.log(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showNearby = () => {
    if (restaurantData && restaurantData.length > 0) {
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{ flex: 1 }}>
            {restaurantData.map((res_data, i) => (
              <Restaurant
                key={i}
                name={res_data.name}
                open_day={res_data.open_day}
                open_time={res_data.open_time}
                phone={res_data.phone}
                food_img={res_data.images}
              />
            ))}
            <Image source={require('./images/bottom_filler.png')} />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.restaurantContainer}>
          <Text>Please Wait</Text>
        </View>
      );
    }
  };

  const showSearchResult = () => <Text>search result</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Search</Text>
      <View style={styles.searchArea}>
        <TextInput
          style={{ height: 20, width: 300, fontSize: 20 }}
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableHighlight onPress={onPressButton} underlayColor="white">
          <View style={styles.searchButton}>
            <Image style={{ height: 30, width: 30 }} source={require('./images/search_icon.png')} />
          </View>
        </TouchableHighlight>
      </View>
      <View>{isShowNearby ? showNearby() : showSearchResult()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 30,
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
    marginLeft: 10,
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
});

export default App;
