import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import HomeTabs from "./HomeTabs";
import ProductScreen from "../screens/ProductScreen";
import LoginScreen from "../screens/LoginScreen";
import BaristaScreen from "../screens/barista/BaristaScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const userAuth = await AsyncStorage.getItem("userAuthDetails");
        setAdminId(JSON.parse(userAuth).user.user.id);
      } catch (e) {
        console.log(e);
      }
    };

    checkUserAuthentication();
  }, []);
  //console.log(adminId);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: "white" },
          headerShown: false,
        }}
        initialRouteName="AuthLoading"
      >
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen
          name="Barista"
          component={BaristaScreen}
          initialParams={{
            adminId,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const userAuth = await AsyncStorage.getItem("userAuthDetails");
        if (userAuth) {
          const userDetails = JSON.parse(userAuth);
          if (userDetails.isAuthorised) {
            if (userDetails.user.user.isAdmin) {
              navigation.navigate("Barista");
            } else {
              navigation.navigate("Home");
            }
          } else {
            navigation.navigate("Login");
          }
        } else {
          navigation.navigate("Login");
        }
      } catch (e) {
        console.log(e);
        navigation.navigate("Login");
      }
    };
    checkUserAuthentication();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="blue" />
      <HomeTabs />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
