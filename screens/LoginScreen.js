import React, { useCallback } from "react";
import { View, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Authorise from "../components/Login/Authorise";

const LoginScreen = ({ isAuthUser }) => {
  const navigation = useNavigation();

  const getUserAuthentication = useCallback(
    async (authDetails) => {
      if (authDetails.isAuthorised) {
        await AsyncStorage.setItem(
          "userAuthDetails",
          JSON.stringify(authDetails)
        );
        if (authDetails?.user?.user?.isAdmin === true) {
          navigation.navigate("Barista", { screen: "BaristaScreen" });
          //console.log("Admin");
        } else {
          //console.log("User");
          navigation.navigate("Home", { screen: "HomeScreen" });
        }
      } else {
        await AsyncStorage.removeItem("userAuthDetails");
      }
      //console.log(authDetails);
      isAuthUser(authDetails.isAuthorised);
    },
    [isAuthUser, navigation]
  );

  return (
    <ImageBackground
      source={require("../assets/images/bgimg.png")}
      style={{
        flex: 1,
        resizeMode: "cover",
      }}
    >
      <View style={{ marginTop: 200 }}>
        <Authorise authUser={getUserAuthentication} navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
