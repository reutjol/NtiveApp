import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function CartScreen() {
  const [items, setItems] = useState([]);
  const [totalprice, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [items]);

  const navigator = useNavigation();
  useEffect(() => {
    const unsubscribe = navigator.addListener("focus", () => {
      getItemsFromLocalStorage();
    });
    return unsubscribe;
  }, [navigator]);

  const getItemsFromLocalStorage = async () => {
    try {
      const items = await AsyncStorage.getItem("selectCoffee");
      if (items !== null) {
        const parsedItems = JSON.parse(items);
        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
        } else {
          setItems([parsedItems]);
        }
      } else {
        console.log("No items in the cart");
        setItems([]);
      }
    } catch (e) {
      console.log("Error getting items from local storage", e);
    }
  };

  const removeItem = async (index) => {
    let newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    try {
      await AsyncStorage.setItem("selectCoffee", JSON.stringify(newItems));
      alert("Item removed from cart");
    } catch (e) {
      console.log("Error removing item from local storage", e);
    }
  };

  const MakeNewOrder = async () => {
    try {
      const userAuthDetails = await AsyncStorage.getItem("userAuthDetails");
      const parsedUserAuthDetails = JSON.parse(userAuthDetails);
      //console.log("token:", parsedUserAuthDetails.user.token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": parsedUserAuthDetails.user.token,
        },
      };

      if (userAuthDetails !== null) {
        const selected =
          JSON.parse(await AsyncStorage.getItem("selectCoffee")) || [];

        let total = 0,
          totalQuantity = 0;
        items.forEach((item) => {
          total += item.price * item.quantity;
          totalQuantity += item.quantity;
        });

        const body = {
          user: parsedUserAuthDetails.user.user,
          selected: selected,
          orderTotalQuantity: totalQuantity,
          orderTotalAmount: total,
        };

        await axios.post(
          "https://cofee-shop-7170efe7f047.herokuapp.com/api/orders/",
          body,
          config
        );

        await AsyncStorage.removeItem("selectCoffee");
        setItems([]);
        console.log("Order made successfully");
      } else {
        console.log("No user details found");
      }
    } catch (e) {
      console.log("Error making the order", e);
    }
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
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Cart Screen</Text>
          {items.length > 0 ? (
            items.map((item, index) => (
              <View key={item.id || index} style={styles.itemContainer}>
                <View style={styles.items}>
                  <View style={styles.side1}>
                    <Text style={styles.itemTitle}>{item.nameItem}</Text>
                    <Text style={styles.itemText}>
                      Quantity: {item.quantity}
                    </Text>
                    <Text style={styles.itemText}>price: {item.price}$</Text>

                    <Text style={styles.itemText}>Remarks: {item.text}</Text>
                    <Text style={styles.itemText}>Size: {item.size}</Text>
                    <Text style={styles.itemText}>Type: {item.typeCoffee}</Text>
                    <Text style={styles.itemText}>Milk: {item.milk}</Text>
                  </View>

                  <View style={styles.side2}>
                    <Icon
                      name="times"
                      size={30}
                      color="#704332"
                      onPress={() => removeItem(index)}
                    />
                    <Image
                      source={{ uri: item.img }}
                      style={{
                        position: "absolute",
                        top: 50,
                        left: -50,
                        height: 50,
                        width: 50,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No items in the cart.</Text>
          )}
        </View>
        {items.length ? (
          <View>
            <View style={{ height: 100, marginBottom: 30 }}>
              <Text style={styles.total}>Total price: {totalprice}$</Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={MakeNewOrder}
              >
                <Text style={styles.loginButtonText}>Make Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginLeft: 50,
    marginTop: 50,
    width: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  side2: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  side1: {
    flex: 1,
    gap: 6,
  },

  itemContainer: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  itemText: {
    fontSize: 16,
  },

  loginButton: {
    alignItems: "center",
    backgroundColor: "#704332",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 120,
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 50,
    marginTop: 20,
  },
});
