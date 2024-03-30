import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";
import CoffeeCard from "../components/coffeeCards/coffeeCard";
import SmallCoffeeCard from "../components/coffeeCards/smallCoffeeCard";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [coffeeItems, setCoffeeItems] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCoffeeItems = async () => {
    try {
      const response = await axios.get(
        "https://cofee-shop-7170efe7f047.herokuapp.com/api/items"
      );
      setCoffeeItems(response.data);
    } catch (error) {
      console.error("Error fetching coffee items:", error);
    }
  };

  const getItemsFromLocalStorage = async () => {
    try {
      const items = await AsyncStorage.getItem("selectCoffee");
      if (items !== null) {
        // console.log("Items from local storage:", items);
      }
    } catch (error) {
      console.error("Error getting items from local storage:", error);
    }
  };
  useEffect(() => {
    getItemsFromLocalStorage();
  }, []);
  const searchItems = async (searchText) => {
    try {
      let uri = "https://cofee-shop-7170efe7f047.herokuapp.com/api/items";

      if (searchText !== "") {
        uri += "/name/" + searchText;
      }

      const response = await axios.get(uri);
      setCoffeeItems(response.data);
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  useEffect(() => {
    fetchCoffeeItems();
  }, []);

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
        <View className="flex-1 relative">
          <SafeAreaView className>
            <View className="mx-4 flex-row justify-between items-center">
              <Text className="mx-2 font-semibold text-2xl ">
                Enjoy your{"\n"}morning
                <Text className="font-bold">coffee!!</Text>
              </Text>
            </View>
            {/* search bar */}
            <View className="mx-5 shadow mt-3 flex-row items-center rounded-full p-1 bg-[#ffffff]">
              <MagnifyingGlassIcon
                size="20"
                color="gray"
                style={{ marginLeft: 10, marginRight: 5 }}
              />
              <TextInput
                placeholder="Search something"
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                  searchItems(text);
                }}
                style={{
                  flex: 1,
                  padding: 16,
                  fontWeight: "bold",
                  color: "gray",
                }}
              />
            </View>
          </SafeAreaView>
          {/*small coffee cards */}
          <Text className="mx-5 text-3xl mt-5"> Categories</Text>

          <View className={`overflow-visible flex flex-1 mt-5 `}>
            <View>
              <Carousel
                containerCustomStyle={{ overflow: "visible" }}
                data={coffeeItems}
                renderItem={({ item }) => <SmallCoffeeCard item={item} />}
                contentContainerCustomStyle={{ marginLeft: -80 }}
                firstItem={0}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={width}
                itemWidth={width * 0.45}
                slideStyle={{ display: "flex" }}
              />
            </View>
          </View>

          {/* coffee cards */}
          <Text className="mx-5 text-3xl mt-5">Special Coffee</Text>
          <View className={`overflow-visible flex flex-1 mt-5`}>
            <View>
              <Carousel
                containerCustomStyle={{ overflow: "visible" }}
                contentContainerCustomStyle={{ marginLeft: -30 }}
                data={coffeeItems}
                renderItem={({ item }) => <CoffeeCard item={item} />}
                firstItem={0}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={width}
                itemWidth={width * 0.7}
                slideStyle={{ display: "flex" }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
