import React, { useCallback, useEffect } from "react";
import SignIn from "./SingInUser";
import Register from "./Register";
import axios from "axios";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Authorise({ authUser, navigation }) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [error, setError] = React.useState("");

  const authenticateUser = useCallback(
    (userData) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post(
          "https://cofee-shop-7170efe7f047.herokuapp.com/api/auth/",
          userData,
          config
        )
        .then(
          (res) => {
            // console.log(userData);
            console.log(res.data, res.status);
            var data = { user: res.data, isAuthorised: true };
            authUser(data);
          },
          (err) => {
            setError("Invalid Credentials");
            console.log(err);
          }
        );
    },
    [authUser]
  );

  const saveNewUser = useCallback(
    (userData) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post(
          "https://cofee-shop-7170efe7f047.herokuapp.com/api/users/",
          userData,
          config
        )
        .then(
          (res) => {
            var data = { user: res.data, isAuthorised: true };
            authUser(data);
          },
          (err) => {
            console.log(err);
          }
        );
    },
    [authUser]
  );

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const userAuth = await AsyncStorage.getItem("userAuthDetails");
        if (userAuth && JSON.parse(userAuth).isAuthorised) {
        }
      } catch (e) {
        console.log(e);
      }
    };
    checkUserAuthentication();
  }, []);

  const switchType = () => {
    setIsLogin(!isLogin);
    setError("");
  };
  return (
    <View>
      <View style={{ height: 100 }}>
        <TouchableOpacity style={styles.loginButton} onPress={switchType}>
          <Text style={styles.loginButtonText}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </Text>
        </TouchableOpacity>
      </View>
      {isLogin ? (
        <SignIn userDetails={authenticateUser} />
      ) : (
        <Register userDetails={saveNewUser} />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    textAlign: "center",
    marginTop: -40,
  },
  loginButton: {
    alignSelf: "center",
    width: 200,
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

export default Authorise;
