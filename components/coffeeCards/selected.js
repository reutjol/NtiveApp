import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const SelectOptions = ({ title, data, selectedKey, onSelect }) => {
  return (
    <View className="px-4 my-2">
      <Text className="text-lg font-bold">{title}:</Text>
      <View className="flex-row flex-wrap gap-2">
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect(item.name)}
            style={{
              backgroundColor:
                selectedKey == item.name ? "#704332" : "rgba(0,0,0,0.07)",
            }}
            className="p-3 px-8 rounded-full"
          >
            <Text
              style={selectedKey == item.value ? "text-white" : "text-gray-700"}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SelectOptions;
