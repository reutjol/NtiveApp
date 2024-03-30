import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export default function Profile() {
  const navigation = useNavigation();
  const [userData, setuserData] = useState([]);

  const fetchOrders = async () => {
    try {
      const userAuthDetails = await AsyncStorage.getItem("userAuthDetails");
      if (userAuthDetails !== null) {
        const parsedUserAuthDetails = JSON.parse(userAuthDetails);
        setuserData(parsedUserAuthDetails.user.user);
      } else {
        console.log("No user details found");
      }
    } catch (e) {
      console.log("Error fetching user data", e);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userAuthDetails");

    console.log("User logged out");
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bgimg.png")}
      style={{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Name: {userData.name}</Text>
        <Text style={styles.text}>Email: {userData.email}</Text>
        <View style={{ height: 100 }}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.loginButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    margin: 10,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#704332",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
