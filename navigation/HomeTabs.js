import { ImageBackground, Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Profile from "../screens/ProfileSreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CartScreen from "../screens/CartBagScreen";
import ShowOrders from "../screens/HistoryOrdersScreen";

import {
  HomeIcon as HomeOutline,
  ShoppingBagIcon as BagOutline,
  Bars3BottomLeftIcon as ListOutline,
  UserCircleIcon as UserOutline,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeSolid,
  ShoppingBagIcon as BagSolid,
  Bars3BottomLeftIcon as ListSolid,
  UserCircleIcon as UserSolid,
} from "react-native-heroicons/solid";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <ImageBackground
      source={require("../assets/images/bgimg.png")}
      style={{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => menuIcons(route, focused),
          tabBarStyle: {
            marginBottom: 20,
            height: 75,
            alignItems: "center",

            borderRadius: 100,
            marginHorizontal: 20,
            backgroundColor: "#704332",
          },
          tabBarItemStyle: {
            marginTop: 30,
          },
        })}
      >
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="cart" component={CartScreen} />
        <Tab.Screen name="history" component={ShowOrders} />
        <Tab.Screen name="profile" component={Profile} />
      </Tab.Navigator>
    </ImageBackground>
  );
}

const menuIcons = (route, focused) => {
  let icon;
  switch (route.name) {
    case "home":
      icon = focused ? (
        <HomeSolid size={30} color={"#704332"} />
      ) : (
        <HomeOutline size={30} color={"white"} />
      );
      break;
    case "cart":
      icon = focused ? (
        <BagSolid size={30} color={"#704332"} />
      ) : (
        <BagOutline size={30} color={"white"} />
      );
      break;
    case "history":
      icon = focused ? (
        <ListSolid size={30} color={"#704332"} />
      ) : (
        <ListOutline size={30} color={"white"} />
      );
      break;
    case "profile":
      icon = focused ? (
        <UserSolid size={30} color={"#704332"} />
      ) : (
        <UserOutline size={30} color={"white"} />
      );
      break;

    default:
      icon = <Text>Icon</Text>;
  }

  let buttonClass = focused ? "bg-white" : "";
  return (
    <View
      className={"flex items-center rounded-full p-3 shadow " + buttonClass}
    >
      {icon}
    </View>
  );
};
