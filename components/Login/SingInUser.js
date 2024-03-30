import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const SignIn = ({ userDetails }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onChange = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)) {
          error = "Email form";
        }
      case "password":
        if (value.length < 6) {
          error = "Password should be more than 5 characters";
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{6,})/.test(
            value
          )
        ) {
          error = "Password should have alphanumeric and special characters.";
        }
        break;
      default:
    }

    setError(error);
    name === "email" ? setEmail(value) : setPassword(value);
  };

  const login = () => {
    if (error.length === 0) {
      const body = JSON.stringify({ email, password });
      userDetails(body);
    } else {
      Alert.alert("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        onChangeText={(text) => onChange("email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => onChange("password", text)}
      />
      <View style={{ height: 100 }}>
        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
    marginLeft: "10%",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
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

export default SignIn;
