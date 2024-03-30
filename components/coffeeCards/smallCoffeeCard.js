import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export default function smallCoffeeCard({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Product", { ...item })}
    >
      <View
        className="flex"
        style={{
          borderRadius: 30,
          backgroundColor: "#ffffff",
          height: height * 0.2,
          width: width * 0.4,
        }}
      >
        <View className="flex items-center mt-2 justify-center overflow-hidden aspect-w-1 aspect-h-1">
          <Image
            source={{ uri: item.img }}
            style={{ height: 100, width: 100, borderRadius: 10 }}
          />
        </View>
        <View className={`px-5 py-5 flex-1 gap-2`}>
          <Text className="flex text-m text-black font-semibold">
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
