import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ShowOrders() {
  const [orders, setOrders] = useState([]);

  const fetchCoffeeItems = async () => {
    try {
      const userAuthDetails = await AsyncStorage.getItem("userAuthDetails");
      if (userAuthDetails !== null) {
        const parsedUserAuthDetails = JSON.parse(userAuthDetails);
        const userId = parsedUserAuthDetails.user.user.id;
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": parsedUserAuthDetails.user.token,
          },
        };

        const response = await axios.get(
          `https://cofee-shop-7170efe7f047.herokuapp.com/api/orders/${userId}`,
          config
        );
        setOrders(response.data);
      } else {
        console.log("No user details found");
      }
    } catch (e) {
      console.log("Error fetching orders", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCoffeeItems();
    }, [])
  );

  const OrderItem = React.memo(({ order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.cardcontainer}>
        <Text>
          <Text>Order Date: {new Date(order.date).toLocaleString()}</Text>
        </Text>
        <Text>Order Total: ${order.orderTotalAmount}</Text>
        <Text>Order Status: {order.status}</Text>
        <Text>Order Items:</Text>
        {order.selected?.map((item, index) => (
          <View style={styles.itemContainer} key={index}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  ));

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
        <Text style={styles.title}>History Screen</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginTop: 50,
    width: 350,
  },
  orderContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardcontainer: {
    padding: 20,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-around",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
