import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ENDPOINT = "https://cofee-shop-7170efe7f047.herokuapp.com";

const BaristaScreen = () => {
  const navigation = useNavigation();

  const [idAdmin, setIdAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("newOrder", (order) => {
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const getUserAuthentication = async () => {
      try {
        const userAuthString = await AsyncStorage.getItem("userAuthDetails");

        if (userAuthString) {
          const userAuth = JSON.parse(userAuthString);
          setToken(userAuth.user.token);
          setIdAdmin(userAuth?.user?.user?.id);
        }
      } catch (error) {
        console.error("Error fetching user authentication details:", error);
      }
    };
    getUserAuthentication();
  }, []);

  useEffect(() => {
    const fetchOrdersByStatus = async () => {
      if (!idAdmin) {
        console.log("No adminId");
        return;
      }
      try {
        const response = await axios.get(
          `https://cofee-shop-7170efe7f047.herokuapp.com/api/orders/${idAdmin}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrdersByStatus();
  }, [idAdmin]);
  const status = ["new", "process", "ready"];

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userAuthDetails");

    console.log("User logged out");
    navigation.navigate("Login");
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const userAuthString = await AsyncStorage.getItem("userAuthDetails");
      const userAuth = JSON.parse(userAuthString);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": userAuth.user.token,
        },
      };

      const body = {
        status: newStatus,
      };
      //console.log("newStatus", body);
      const response = await axios.put(
        `https://cofee-shop-7170efe7f047.herokuapp.com/api/orders/${orderId}`,
        body,
        config
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bgimg.png")}
      style={{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hello Brista</Text>
          <View style={{ height: 100, width: 300 }}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
              <Text style={styles.loginButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statusRow}>
          {status.map((status) => {
            const filteredOrders = orders.filter(
              (order) => order.status === status
            );
            return (
              <View key={status} style={styles.statusContainer}>
                <Text style={styles.statusTitle}>{status.toUpperCase()}</Text>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <View key={index} style={styles.orderContainer}>
                      <Text>
                        Date: {new Date(order.date).toLocaleString("en-GB")}
                      </Text>
                      <Text>Total Amount: ${order.orderTotalAmount}</Text>
                      <Text>Total Quantity: {order.orderTotalQuantity}</Text>
                      <Text style={{ marginTop: 10 }}>items:</Text>
                      {order.selected.map((item, index) => (
                        <View key={index}>
                          <Text style={styles.itemTitle}>{item.nameItem}</Text>
                          <Text style={styles.itemText}>
                            Quantity: {item.quantity}
                          </Text>
                          <Text style={styles.itemText}>
                            Remarks: {item.text}
                          </Text>
                          <Text style={styles.itemText}>Size: {item.size}</Text>
                          <Text style={styles.itemText}>
                            Type: {item.typeCoffee}
                          </Text>
                          <Text style={styles.itemText}>Milk: {item.milk}</Text>
                        </View>
                      ))}
                      <View style={{ height: 100 }}>
                        <TouchableOpacity
                          style={styles.loginButton}
                          onPress={() => {
                            let nextStatus;
                            if (order.status === "new") {
                              nextStatus = "process";
                            } else if (order.status === "process") {
                              nextStatus = "ready";
                            } else {
                              nextStatus = "close";
                            }
                            updateOrderStatus(order._id, nextStatus);
                          }}
                        >
                          <Text style={styles.loginButtonText}>
                            {order.status === "new"
                              ? "Process"
                              : order.status === "process"
                              ? "Ready"
                              : "Close"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noOrders}>
                    No orders in this category
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusContainer: {
    flex: 1,
    margin: 20,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Optional: Adds space around items
    flexWrap: "wrap", // Optional: Allows the row to wrap to a new line
  },
  container: {
    flex: 1,
  },
  orderContainer: {
    backgroundColor: "#f8f9fa",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 6,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  newOrder: {
    borderColor: "#007bff",
    borderWidth: 2,
  },
  processOrder: {
    borderColor: "#ffc107",
    borderWidth: 2,
  },
  readyOrder: {
    borderColor: "#28a745",
    borderWidth: 2,
  },
  closedOrder: {
    borderColor: "#6c757d",
    borderWidth: 2,
  },
  orderStatus: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
  orderText: {
    fontSize: 16,
    color: "#333", // Darker text for better readability
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#704332",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginRight: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default BaristaScreen;
