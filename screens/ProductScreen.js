import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftCircleIcon,
  MinusIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import { StarIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectOptions from "../components/coffeeCards/selected";
import { milkeType, coffeeType, coffeeSize } from "../Data/coffeeSalect";

export default function ProdeScreen(props) {
  const item = props.route.params;
  const [size, setSize] = useState("Small");
  const [milk, setMilk] = useState("No Milk");
  const [typeCoffee, setType] = useState("Hot");

  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [nameItem, setNameItem] = useState("");
  const [imgItem, setImgItem] = useState("");
  const [price, setPrice] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    setNameItem(item.name);
    setImgItem(item.img);
    setPrice(item.price * quantity);
  }, []);

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const saveItem = async () => {
    try {
      const existingItems = await AsyncStorage.getItem("selectCoffee");
      let existingItemsArray = [];
      if (existingItems) {
        existingItemsArray = JSON.parse(existingItems);
      }
      if (!Array.isArray(existingItemsArray)) {
        existingItemsArray = [];
      }
      const newIteem = {
        ...item,
        size,
        quantity,
        nameItem,
        text,
        imgItem,
        price,
        milk,
        typeCoffee,
      };
      existingItemsArray.push(newIteem);
      await AsyncStorage.setItem(
        "selectCoffee",
        JSON.stringify(existingItemsArray)
      );
      alert("Item added to cart");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bgimg.png")}
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
    >
      <ScrollView>
        <View className="flex-1 mb-20">
          <SafeAreaView className="space-y-4 flex-1">
            <View className="mx-4 flex-row justify-between items-center">
              <TouchableOpacity
                className=" rounded-full "
                onPress={() => navigation.goBack()}
              >
                <ArrowLeftCircleIcon size="50" strokeWidth={1.2} color="#000" />
              </TouchableOpacity>
            </View>
            {/*img*/}
            <View className="flex-row justify-center">
              <View className="flex items-center justify-center rounded-3xl overflow-hidden aspect-w-1 aspect-h-1">
                <Image
                  source={{ uri: item.img }}
                  style={{ height: 150, width: 150 }}
                />
              </View>
            </View>
            {/*rate*/}
            <View
              style={{ backgroundColor: "#704332" }}
              className="flex-row justify-center items-center rounded-3xl p-1 px-2 space-x-1 opacity-90 w-40 h-7 ml-4"
            >
              <StarIcon size="15" color="white" />
              <Text className="text-s font-semibold text-white">
                {item.rate}
              </Text>
            </View>
            {/*name*/}
            <View className="px-4 flex-row justify-between items-center">
              <Text
                style={{ color: "#000000" }}
                className="text-3xl font-semibold"
              >
                {item.name}
              </Text>

              {/*price*/}
              <Text
                style={{ color: "#000000" }}
                className="text-lg font-semibold"
              >
                $ {item.price}
              </Text>
            </View>
            {/*About*/}
            <View className="px-4 space-y-2">
              <Text style={{ color: "#000000" }} className="text-lg font-bold">
                About
              </Text>
              <Text className="text-gray-600">{item.description}</Text>
            </View>
            {/* Updated section for quantity management */}
            <View className="flex-row items-center justify-center space-x-4 border-gray-500 border rounded-full w-32 h-10 ml-5">
              <TouchableOpacity onPress={decreaseQuantity}>
                <MinusIcon size="20" strokeWidth={3} color={"#000000"} />
              </TouchableOpacity>
              <Text
                style={{ color: "#000000" }}
                className="font-extrabold text-lg"
              >
                {quantity}
              </Text>
              <TouchableOpacity onPress={increaseQuantity}>
                <PlusIcon size="20" strokeWidth={3} color={"#000000"} />
              </TouchableOpacity>
            </View>

            <View className=" flex ml-5 mt-200">
              <Text style={{ color: "#000000" }} className="text-lg font-bold">
                Remarks
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setText(text)}
                value={text}
                placeholder="Write your remarks here"
                keyboardType="default"
              />
            </View>

            <SelectOptions
              title="Select type"
              data={coffeeType}
              selectedKey={typeCoffee}
              onSelect={setType}
            />
            <SelectOptions
              title="Select Size"
              data={coffeeSize}
              selectedKey={size}
              onSelect={setSize}
            />
            <SelectOptions
              title="Select milk"
              data={milkeType}
              selectedKey={milk}
              onSelect={setMilk}
            />
          </SafeAreaView>
        </View>
        {/* remarks */}
      </ScrollView>

      {/* buy now button */}
      <View className="absolute bottom-5 flex-row justify-between px-4">
        <TouchableOpacity
          onPress={saveItem}
          style={{ backgroundColor: "#704332" }}
          className="p-4 rounded-full flex-1 ml-4"
        >
          <Text className="text-center text-white text-base font-semibold">
            Add To Cart
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
